import { render, screen } from '@testing-library/react';
import SignupPage from './page';
import { createClient } from '../../utils/supabase/client';

// Mock the dependencies
jest.mock('../../utils/supabase/client');
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
}));

// track unhandled promise rejections
let handleUnhandledRejection: jest.Mock;

describe('SignupPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up a clean mocked client for each test
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signUp: jest.fn().mockResolvedValue({ 
          data: { user: { id: 'new-user-id' } },
          error: null
        }),
      },
    });
    
    // Monitor for unhandled promise rejections
    handleUnhandledRejection = jest.fn();
    process.on('unhandledRejection', handleUnhandledRejection);
  });
  
  afterEach(() => {
    process.off('unhandledRejection', handleUnhandledRejection);
  });

  // basic rendering test to see if the component renders without errors
  it('renders signup form without crashing', () => {
    render(<SignupPage />);
    
    // Basic check for the form heading
    const heading = screen.getByText(/Create an Account/i);
    expect(heading).toBeInTheDocument();
  });

  // Test if we can find the form elements
  it('contains all necessary form elements', () => {
    render(<SignupPage />);
    
    // Just check if all form elements exist
    expect(screen.getByPlaceholderText(/Enter your full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });
  
  // Test if login link is visible
  it('displays link to login page', () => {
    render(<SignupPage />);
    
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });
});