import { render, screen, waitFor, userEvent } from '@testing-library/react';
import Photos from '../app/albums/[userId]/photos/[albumId]/page';
import { rest } from 'msw';

const server = setupServer(
  rest.get("https://jsonplaceholder.typicode.com/photos", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          albumId: 1,
          id: 1,
          title: "Photo 1",
          url: "https://example.com/photo1",
          thumbnailUrl: "https://example.com/thumbnail1",
        },
        {
          albumId: 1,
          id: 2,
          title: "Photo 2",
          url: "https://example.com/photo2",
          thumbnailUrl: "https://example.com/thumbnail2",
        },
      ])
    );
  }),
);

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

describe('Photos Component', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(() => {
    useParams.mockReturnValue({ albumId: '1' });
  });

  it('fetches and renders photos correctly', async () => {
    render(<Photos />);

    expect(screen.getByText('Photos')).toBeInTheDocument();

    // Wait for photos to be loaded
    await waitFor(() => {
      expect(screen.getAllByRole('listitem').length).toBe(2);
    });

    expect(screen.getByText('Photo 1')).toBeInTheDocument();
    expect(screen.getByText('Photo 2')).toBeInTheDocument();

    // Check if images are rendered with correct URLs
    expect(screen.getAllByRole('img')[0]).toHaveAttribute(
      'src',
      'https://example.com/thumbnail1'
    );
    expect(screen.getAllByRole('img')[1]).toHaveAttribute(
      'src',
      'https://example.com/thumbnail2'
    );

    // Check if links are correct
    userEvent.click(screen.getAllByRole('breadcrumbs')[1]);
    expect(window.location.href).toBe('/album/1');
  });

  it('handles fetch error', async () => {
    server.use(
      rest.get('https://jsonplaceholder.typicode.com/photos', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<Photos />);

    expect(screen.getByText('Photos')).toBeInTheDocument();

    // Wait for error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });
});
