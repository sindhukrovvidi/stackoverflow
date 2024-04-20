import React from "react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../src/components/Login";
import { AuthContext } from "../../src/AuthContextProvider";
import * as userService from "../../src/services/userService";

const Wrapper = ({ children }) => {
  const mockSignIn = cy.stub();
  const mockSignOutAuth = cy.stub();
  const mockUpdateUser = cy.stub();
  const mockUpdateCsrfToken = cy.stub();

  return (
    <AuthContext.Provider
      value={{
        signIn: mockSignIn,
        signOutAuth: mockSignOutAuth,
        updateUser: mockUpdateUser,
        updateCsrfToken: mockUpdateCsrfToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

describe("Login", () => {
    let fetchStub;
  beforeEach(() => {
    
    fetchStub = cy.stub(window, "fetch").callsFake((input, init) => {
      if (init.method === "GET" && init.url === "/check-login") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ csrfToken: "mock-csrf-token" }),
        });
      }
    });
  });

  it("renders correctly", () => {
    cy.mount(
      <MemoryRouter>
        <Wrapper>
          <Login navigateTo="/questions" />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get(".login-container").should("exist");
    cy.get("#loginEmail").should("exist");
    cy.get("#loginPassword").should("exist");
    cy.get(".form_postBtn").should("contain", "Login");
    cy.get(".registerButton a").should("have.attr", "href", "/register");
  });

  it("updates email and password input values", () => {
    cy.mount(
      <MemoryRouter>
        <Wrapper>
          <Login navigateTo="/questions" />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get("#loginEmail").type("test@example.com");
    cy.get("#loginEmail").should("have.value", "test@example.com");

    cy.get("#loginPassword").type("password123");
    cy.get("#loginPassword").should("have.value", "password123");
  });

  it("navigates to register page when register link is clicked", () => {
    const navigate = cy.stub();

    cy.mount(
      <MemoryRouter>
        <Wrapper>
          <Login navigateTo="/questions" />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get(".registerButton a")
      .contains("Register")
      .then(($button) => {
        cy.stub($button[0], "click").callsFake(() => {
          navigate("/register");
        });
        $button[0].click();
      });

    cy.wrap(navigate).should("be.calledWith", "/register");
  });

  it("navigates to questions page and signs in when login is successful", () => {
    cy.stub(userService, "checkLoginStatus").resolves({ loggedIn: true });

    const navigate = cy.stub().as("navigate");

    cy.mount(
      <MemoryRouter navigator={{ navigate }}>
        <Wrapper>
          <Login navigateTo="/questions" />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get("#loginEmail").type("test@example.com");
    cy.get("#loginPassword").type("password123");
    cy.get(".form_postBtn")
      .contains("Login")
      .then(($button) => {
        cy.stub($button[0], "click").callsFake(() => {
          navigate("/questions");
        });
        $button[0].click();
      });

    cy.get("@navigate").should("be.calledWith", "/questions");
  });

  it("displays error toast when login fails", () => {
    cy.stub(userService, "checkLoginStatus").resolves({ loggedIn: false }); // Stub the method from the imported module

    const navigate = cy.stub().as("navigate");

    cy.mount(
      <MemoryRouter navigator={{ navigate }}>
        <Wrapper>
          <Login navigateTo="/questions" />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get("#loginEmail").type("test@example.com");
    cy.get("#loginPassword").type("wrongpassword");
    cy.get(".form_postBtn").click();

    cy.get(".Toastify__toast-body").should(
      "contain",
      "Unable to login, please try again or check credentials."
    );
  });
});
