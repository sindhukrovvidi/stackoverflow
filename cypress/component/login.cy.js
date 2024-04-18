import Login from '../../src/components/Login/index';

it('renders login form correctly', () => {
    const signInMock = jest.fn(); // Mock for the signIn function
    const navigateMock = jest.fn(); // Mock for the navigate function
    const navigateTo = '/'; // Destination URL

    render(
        <Login 
            navigateTo={navigateTo} 
            signIn={signInMock} 
            navigate={navigateMock} 
        />
    );
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email*')).toBeInTheDocument();
    expect(screen.getByLabelText('Password*')).toBeInTheDocument();
    expect(screen.getByText('New User?')).toBeInTheDocument();
    expect(screen.getByText('Register')).toHaveAttribute('href', '/register');
});

it('calls login function on form submission', async () => {
    const signInMock = jest.fn(); // Mock for the signIn function
    const navigateMock = jest.fn(); // Mock for the navigate function
    const navigateTo = '/'; // Destination URL
    const email = 'test@example.com';
    const password = 'password123';

    render(
        <Login 
            navigateTo={navigateTo} 
            signIn={signInMock} 
            navigate={navigateMock} 
        />
    );

    userEvent.type(screen.getByLabelText('Email'), email);
    userEvent.type(screen.getByLabelText('Password'), password);
    userEvent.click(screen.getByText('Login'));

    await waitFor(() => {
        expect(loginUser).toHaveBeenCalledWith(email, password);
        expect(signInMock).toHaveBeenCalled();
        expect(signInMock).toHaveBeenCalledWith('mocked_token');
        expect(navigateMock).toHaveBeenCalledWith(navigateTo);
    });
});
