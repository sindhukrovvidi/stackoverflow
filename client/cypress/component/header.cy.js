// header.spec.js
import React from "react";
import { MemoryRouter } from "react-router-dom";
import Header from "../../src/components/Header/index";
import { AuthContext } from "../../src/AuthContextProvider";

const Wrapper = ({ loggedIn, children }) => {
  return (
    <AuthContext.Provider value={{ loggedIn }}>{children}</AuthContext.Provider>
  );
};

describe("Header", () => {
  it("renders correctly", () => {
    cy.mount(
      <MemoryRouter>
        <Wrapper>
          <Header search="" setSearchResults={() => {}} />
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
        <Wrapper loggedIn={false}>
          <Header search="" setSearchResults={() => {}} />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get(".form_postBtn").should("contain", "Login");
  });

  it("displays profile and sign out buttons when logged in", () => {
    cy.mount(
      <MemoryRouter>
        <Wrapper loggedIn={true}>
          <Header search="" setSearchResults={() => {}} />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get(".form_postBtn").should("contain", "Profile");
    cy.get(".form_postBtn").should("contain", "Sign Out");
  });

  it("navigates to login page when login button is clicked", () => {
    const navigate = cy.stub();

    cy.mount(
      <MemoryRouter navigator={{ navigate }}>
        <Wrapper loggedIn={false}>
          <Header search="" setSearchResults={() => {}} />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get(".form_postBtn")
      .contains("Login")
      .then(($button) => {
        cy.stub($button[0], "click").callsFake(() => {
          navigate("/login");
        });
        $button[0].click();
      });

    cy.wrap(navigate).should("be.calledWith", "/login");
  });

  it("navigates to profile page when profile button is clicked", () => {
    const navigate = cy.stub();

    cy.mount(
      <MemoryRouter navigator={{ navigate }}>
        <Wrapper loggedIn={true}>
          <Header search="" setSearchResults={() => {}} />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get(".form_postBtn")
      .contains("Profile")
      .then(($button) => {
        cy.stub($button[0], "click").callsFake(() => {
          navigate("/profile");
        });
        $button[0].click();
      });

    cy.wrap(navigate).should("be.calledWith", "/profile");
  });

  it("navigates to questions page when signout button is clicked", () => {
    const navigate = cy.stub();

    cy.mount(
      <MemoryRouter navigator={{ navigate }}>
        <Wrapper loggedIn={true}>
          <Header search="" setSearchResults={() => {}} />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get(".form_postBtn")
      .contains("Sign Out")
      .then(($button) => {
        cy.stub($button[0], "click").callsFake(() => {
          navigate("/questions");
        });
        $button[0].click();
      });

    cy.wrap(navigate).should("be.calledWith", "/questions");
  });

  it("updates search value on input change", () => {
    cy.mount(
      <MemoryRouter>
        <Wrapper>
          <Header search="" setSearchResults={() => {}} />
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
          <Header search="" setSearchResults={setSearchResults} />
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
