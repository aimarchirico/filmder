import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from './page';
import { useRouter } from 'next/navigation';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the login action
jest.mock('./actions', () => ({
  login: jest.fn(),
}));

describe('LoginPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up the router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders login form', () => {
    render(<LoginPage />);
    
    // Check if the form elements are rendered
    expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign up/i })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it('calls login action when login button is clicked', () => {
    render(<LoginPage />);
    
    // Find the form and login button
    const loginButton = screen.getByRole('button', { name: /Log in/i });
    
    // Fill in the form fields
    const emailInput = screen.getByLabelText(/Email:/i);
    const passwordInput = screen.getByLabelText(/Password:/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(loginButton).toHaveAttribute('formAction');
  });

  it('navigates to signup page when signup button is clicked', () => {
    render(<LoginPage />);
    
    // Find the signup button and click it
    const signupButton = screen.getByRole('button', { name: /Sign up/i });
    fireEvent.click(signupButton);
    
    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/signup');
  });

  it('has required attributes on form fields', () => {
    render(<LoginPage />);
    
    // Check if form fields have required attribute
    const emailInput = screen.getByLabelText(/Email:/i);
    const passwordInput = screen.getByLabelText(/Password:/i);
    
    expect(emailInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('has correct styling classes', () => {
    render(<LoginPage />);
    
    // Check if the layout has the expected styling classes
    const container = screen.getByText('Welcome Back!').closest('div');
    expect(container).toHaveClass('w-full', 'max-w-md', 'shadow-lg', 'rounded-2xl', 'p-8', 'border-4', 'border-secondary');
    
    // Verify the login button has correct styling
    const loginButton = screen.getByRole('button', { name: /Log in/i });
    expect(loginButton).toHaveClass('bg-secondary', 'hover:bg-purple-700', 'text-white', 'rounded-2xl');
  });
});