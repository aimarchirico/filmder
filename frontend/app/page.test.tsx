import { render, screen } from "@testing-library/react";
import Movies from "./page";
import SplashScreen from "@/components/SplashScreen";

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

describe("Splash screen component", () => {
  it("renders 'FILMDER'", async () => {
    render(<SplashScreen />);

    // Wait for the element to appear in the DOM
    expect(await screen.findByText("FILMDER")).toBeInTheDocument();
  });

  it("renders 'TDT4100 Group 28'", async () => {
    render(<SplashScreen />);
    
    expect(await screen.findByText("TDT4140 Group 28")).toBeInTheDocument();
  });
});