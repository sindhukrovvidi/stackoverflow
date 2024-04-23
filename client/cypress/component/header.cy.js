import React from "react";
import { MemoryRouter } from "react-router-dom";
import Header from "../../src/components/Header/index";
import { AuthContext } from "../../src/AuthContextProvider";
import * as userService from "../../src/services/userService";

const Wrapper = ({ user, children }) => {
  const mockUpdateUser = cy.stub();

  return (
    <AuthContext.Provider value={{ updateUser: mockUpdateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

describe("Header", () => {
  beforeEach(() => {
    cy.stub(userService, "checkLoginStatus").resolves({ loggedIn: false });
    cy.stub(userService, "logoutUser").resolves();
    cy.stub(userService, "getCurrentUserDetails").resolves();
  });

  it("renders correctly", () => {
    cy.mount(
      <MemoryRouter>
        <Wrapper>
          <Header search="" setSearchResults={() => {}} isLoggedIn={false} />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get("#header").should("exist");
    cy.get("#searchBar").should("exist");
    cy.get(".form_postBtn").should("contain", "Login");
  });

  it("displays login button when not logged in", () => {
    cy.mount(
      <MemoryRouter>
        <Wrapper>
          <Header search="" setSearchResults={() => {}} isLoggedIn={false} />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get(".form_postBtn").should("contain", "Login");
  });

  it("displays profile and sign out buttons when logged in", () => {
    cy.stub(userService, "checkLoginStatus").resolves({ loggedIn: true });

    cy.mount(
      <MemoryRouter>
        <Wrapper>
          <Header search="" setSearchResults={() => {}} isLoggedIn={true} />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get(".form_postBtn").should("contain", "Profile");
    cy.get(".form_postBtn").should("contain", "Sign Out");
  });

  it("updates search value on input change", () => {
    cy.mount(
      <MemoryRouter>
        <Wrapper>
          <Header search="" setSearchResults={() => {}} isLoggedIn={false} />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get("#searchBar").type("test search");
    cy.get("#searchBar").should("have.value", "test search");
  });

  it("calls setSearchResults when Enter is pressed in search input", () => {
    const setSearchResults = cy.stub();

    cy.mount(
      <MemoryRouter>
        <Wrapper>
          <Header search="" setSearchResults={setSearchResults} isLoggedIn={false} />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get("#searchBar").type("test search{enter}");
    cy.wrap(setSearchResults).should(
      "be.calledWith",
      "test search",
      "Search Results"
    );
  });
});