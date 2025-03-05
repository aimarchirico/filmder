import { render, screen, waitFor, act } from "@testing-library/react";
import ProfilePage from "./page";
import { createClient } from "../../utils/supabase/client";
import { useRouter } from "next/navigation";

// Mock Supabase client and useRouter
jest.mock("../../utils/supabase/client");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ProfilePage", () => {
  let supabaseMock: any;
  let routerMock: any;

  beforeEach(() => {
    jest.clearAllMocks();

    supabaseMock = {
      auth: {
        getUser: jest.fn(),
        signOut: jest.fn(),
      },
    };

    routerMock = { push: jest.fn() };

    (createClient as jest.Mock).mockReturnValue(supabaseMock);
    (useRouter as jest.Mock).mockReturnValue(routerMock);
  });

  it("renders loading state initially", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: null, error: null });

    render(<ProfilePage />);
    
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects to login if user is not found", async () => {
  supabaseMock.auth.getUser.mockResolvedValue({ data: null, error: "User not found" });

  await act(async () => {
    render(<ProfilePage />);
  });

  await waitFor(() => {
    expect(routerMock.push).toHaveBeenCalledWith("/login");
  });
});


  it("renders user details when authenticated", async () => {
    const mockUser = {
      user_metadata: { fullName: "Test User" },
      email: "testuser@example.com",
    };

    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    await act(async () => {
      render(<ProfilePage />);
    });

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
      expect(screen.getByText("testuser@example.com")).toBeInTheDocument();
    });
  });

  it("calls signOut and redirects to login on sign out", async () => {
    const mockUser = {
      user_metadata: { fullName: "Test User" },
      email: "testuser@example.com",
    };

    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

    await act(async () => {
      render(<ProfilePage />);
    });

    const signOutButton = screen.getByText("Sign Out");
    await act(async () => {
      signOutButton.click();
    });

    await waitFor(() => {
      expect(supabaseMock.auth.signOut).toHaveBeenCalledTimes(1);
      expect(routerMock.push).toHaveBeenCalledWith("/login");
    });
  });
});
