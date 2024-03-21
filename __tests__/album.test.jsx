import { render, screen, waitFor, userEvent } from '@testing-library/react';
import Albums from '../app/albums/[userId]/page';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useParams } from 'next/navigation';  

const server = setupServer( 
  rest.get("https://jsonplaceholder.typicode.com/albums", (req, res, ctx) => {
  return res(
    ctx.json([
      { userId: 1, id: 1, title: "Album 1" },
      { userId: 1, id: 2, title: "Album 2" },
    ])
  );
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

describe('Albums Component', () => {
  it('fetches and renders albums correctly', async () => {
    useParams.mockReturnValue({ userId: '1' });

    render(<Albums />);

    expect(screen.getByText('Albums')).toBeInTheDocument();

    // Wait for albums to be loaded
    await waitFor(() => {
      expect(screen.getAllByRole('listitem').length).toBe(2);
    });

    expect(screen.getByText('Album 1')).toBeInTheDocument();
    expect(screen.getByText('Album 2')).toBeInTheDocument();

    // Check breadcrumbs
    userEvent.click(screen.getAllByRole('breadcrumbs')[0]);
    expect(window.location.href).toBe('/');
  });

  it('handles fetch error', async () => {
    useParams.mockReturnValue({ userId: '1' });

    server.use(
      rest.get('https://jsonplaceholder.typicode.com/albums', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<Albums />);

    expect(screen.getByText('Albums')).toBeInTheDocument();

    // Wait for error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });
});
