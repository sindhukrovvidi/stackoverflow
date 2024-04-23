import React from "react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../src/components/Login";
import { AuthContext } from "../../src/AuthContextProvider";
import * as userService from "../../src/services/userService";
import { toast } from "react-toastify";

const Wrapper = ({ children }) => {
  const mockSignIn = cy.stub();
  const mockSignOutAuth = cy.stub();
  const mockUpdateUser = cy.stub();
  const mockUpdateCsrfToken = cy.stub();
  const user = cy.stub();

  return (
    <AuthContext.Provider
      value={{
        signIn: mockSignIn,
        signOutAuth: mockSignOutAuth,
        updateUser: mockUpdateUser,
        updateCsrfToken: mockUpdateCsrfToken,
        user: user
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

  afterEach(() => {
    fetchStub.restore();
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

  it("displays error toast when login fails", () => {
    cy.stub(userService, "loginUser").rejects(new Error("Login failed"));
    const mockToastError = cy.stub(toast, "error");

    cy.mount(
      <MemoryRouter>
        <Wrapper>
          <Login navigateTo="/questions" />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get("#loginEmail").type("test@example.com");
    cy.get("#loginPassword").type("wrongpassword");
    cy.get(".form_postBtn").click();

    cy.wrap(mockToastError).should(
      "be.calledWith",
      "Unable to login, please try again or check credentials."
    );
  });
});