import Header from '../../src/components/Header/index';

it('header shows search bar, image, and login button', () => {
    const setQuestionPageSpy = cy.spy().as('setQuestionPageSpy');
    const searchQuery = '';
    const loginButtonText = 'Login'; // Text of the login button

    cy.mount(
        <Header 
            search={searchQuery} 
            setQuestionPage={setQuestionPageSpy}
            isAuthenticated={false} // Assuming the user is not authenticated initially
            Login={() => {}} // Placeholder for the Login function
        />
    );
    
    cy.get('#searchBar').should('have.value', searchQuery);
    cy.get('#searchBar').should('have.attr', 'placeholder');
    cy.get('img').should('be.visible').click(); // Ensure the image is present and clickable
    cy.get('.form_postBtn').contains(loginButtonText); // Select the login button by class name and verify its text
});


it('search bar shows search text entered by user', () => {
    const setQuesitonPageSpy = cy.spy().as('setQuesitonPageSpy')
    const searchQuery = 'test search'
    cy.mount(<Header 
                search={searchQuery} 
                setQuesitonPage={setQuesitonPageSpy}/>)
    cy.get('#searchBar').should('have.value', searchQuery)
    cy.get('#searchBar').should('have.attr', 'placeholder');
    cy.get('#searchBar').clear()
    cy.get('#searchBar').type('Search change')
    cy.get('#searchBar').should('have.value', 'Search change')
})

it('set question page called when enter is pressed in search', () => {
    const setQuesitonPageSpy = cy.spy().as('setQuesitonPageSpy')
    const searchQuery = 'test search'
    cy.mount(<Header 
                search={searchQuery} 
                setQuesitonPage={setQuesitonPageSpy}/>)
    cy.get('#searchBar').type('{enter}')
    cy.get('@setQuesitonPageSpy').should('have.been.calledWith', searchQuery, 'Search Results')
})



it('clicking on login button calls the navigate function', () => {
        const navigateSpy = cy.spy(); // Create a spy to track the navigate function
        const navigateTo = "/login"; // Define the destination URL
    
        // Mount the Login component with the spy and the destination URL
        cy.mount(
            <Login 
                navigateTo={navigateTo} 
                navigate={navigateSpy} // Pass the spy as the navigate prop
            />
        );
    
        // Click on the login button
        cy.get('.form_postBtn').contains('Login').click(); 
    
        // Verify that the navigate function is called once with the correct destination URL
        cy.wrap(navigateSpy).should('have.been.calledOnceWith', navigateTo);
    });


it('header shows logo, search bar, user name, and logout button when logged in', () => {
    const setQuestionPageSpy = cy.spy().as('setQuestionPageSpy');
    const userName = 'johndoee'; // Example user name
    const searchQuery = 'test search';

    cy.mount(
        <Header 
            search={searchQuery} 
            setQuestionPage={setQuestionPageSpy}
            isAuthenticated={true} // Assuming the user is authenticated
            userName={userName} // Pass the user name  // this will become cliclable bcoz user profile
            signOut={() => {}} // Placeholder for the signOut function
        />
    );

    cy.get('img').should('be.visible'); // Verify that the logo image is present
    cy.get('#searchBar').should('have.value', searchQuery); // Verify that the search bar has the correct value
    cy.contains(userName); // Verify that the user name is displayed
    cy.contains('Sign Out'); // Verify that the logout button is displayed
});