import Home from "../app/page";
import { render, screen } from "@testing-library/react";
import {rest} from "msw";
import { setupServer } from "msw/node";

// Mocking the API response
const server = setupServer(
  rest.get("https://jsonplaceholder.typicode.com/users", (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
      ])
    );
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Home Component", () => {
  it("renders users list", async () => {
    render(<Home />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    // Wait for users to be fetched and rendered
    await screen.findByText("John Doe");
    await screen.findByText("Jane Smith");

    // Check if the users' names are rendered
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("renders correct links for users", async () => {
    render(<Home />);

    // Wait for users to be fetched and rendered
    await screen.findByText("John Doe");
    await screen.findByText("Jane Smith");

    // Check if the links for users are rendered correctly
    expect(screen.getByRole("user-link")).toHaveAttribute(
      "href",
      "/albums/1"
    );
    expect(screen.getByRole("user-link")).toHaveAttribute(
      "href",
      "/albums/2"
    );
  });
});
