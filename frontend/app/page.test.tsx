import { render, screen } from "@testing-library/react";
import Movies from "./page";

// Mock the Supabase client
jest.mock("../utils/supabase/client", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          data: [{ id: 1, name: "Movie 1" }],
        })),
      })),
    })),
  })),
}));

describe("Movies component", () => {
  it("renders 'Filmder av gruppe 28!'", async () => {
    render(<Movies />);

    // Wait for the element to appear in the DOM
    expect(await screen.findByText("Filmder av gruppe 28!")).toBeInTheDocument();
  });

  it("renders 'Koblet til Supabase!'", async () => {
    render(<Movies />);
    
    expect(await screen.findByText("Koblet til Supabase!")).toBeInTheDocument();
  });
});