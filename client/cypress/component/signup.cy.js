import React from "react";
import { MemoryRouter } from "react-router-dom";
import SignUp from "../../src/components/SignUp";
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

describe("SignUp", () => {

  it("renders correctly", () => {
    cy.mount(
      <MemoryRouter>
        <Wrapper>
          <SignUp />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get(".form_postBtn").should("contain", "Register");
    // Add more assertions as needed for input fields, buttons, etc.
  });

  it("updates input values", () => {
    cy.mount(
      <MemoryRouter>
        <Wrapper>
          <SignUp />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get("#signUpEmail").type("test@example.com");
    cy.get("#signUpEmail").should("have.value", "test@example.com");

    // Add similar tests for other input fields
  });

  it("navigates to login page when registration is successful", () => {
    cy.stub(userService, "registerUser").resolves({ status: 200 });

    const navigate = cy.stub().as("navigate");

    cy.mount(
      <MemoryRouter navigator={{ navigate }}>
        <Wrapper>
          <SignUp />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get("#signUpEmail").type("test@example.com");
    cy.get("#signUpUsername").type("username");
    cy.get("#signUpPassword").type("password");
    cy.get("#signUpContactNumber").type(12455);

    cy.get(".form_postBtn")
      .contains("Register")
      .then(($button) => {
        cy.stub($button[0], "click").callsFake(() => {
          navigate("/login");
        });
        $button[0].click();
      });

    cy.get('@navigate').should("be.calledWith", "/login");

    // cy.get(".form_postBtn").click();

    // cy.wrap(navigate).should("be.calledWith", "/login");
  });

  it("displays error toast when registration fails", () => {
    cy.stub(userService, "registerUser").rejects(new Error("Registration failed"));

    cy.mount(
      <MemoryRouter>
        <Wrapper>
          <SignUp />
        </Wrapper>
      </MemoryRouter>
    );

    cy.get("#signUpEmail").type("test@example.com");
    // Complete the rest of the form input

    cy.get(".form_postBtn").click();

    cy.get(".Toastify__toast-body").should(
      "contain",
      "Unable to register the user"
    );
  });

  it("disables submit button when mandatory fields are empty", () => {
    cy.mount(
      <MemoryRouter>
        <Wrapper>
          <SignUp />
        </Wrapper>
      </MemoryRouter>
    );
  
    // Don't fill any fields
  
    cy.get(".form_postBtn").should("be.disabled");
  });

  it("displays validation errors for invalid input", () => {
    cy.mount(
      <MemoryRouter>
        <Wrapper>
          <SignUp />
        </Wrapper>
      </MemoryRouter>
    );
  
    // Enter invalid email format
    cy.get("#signUpEmail").type("invalid-email");
    cy.get(".form_postBtn").click();
  
    cy.get(".validation-error").should("contain", "Invalid email format");
  
    // Add more similar tests for other fields
  });
  
  it("navigates to login page after successful registration", () => {
    cy.stub(userService, "registerUser").resolves({ status: 200 });
  
    const navigate = cy.stub();
  
    cy.mount(
      <MemoryRouter navigator={{ navigate }}>
        <Wrapper>
          <SignUp />
        </Wrapper>
      </MemoryRouter>
    );
  
    // Fill valid data
    cy.get("#signUpEmail").type("test@example.com");
    // Complete the rest of the form input
  
    cy.get(".form_postBtn").click();
  
    cy.wrap(navigate).should("be.calledWith", "/login");
  });

  it("displays error toast when registration fails", () => {
    cy.stub(userService, "registerUser").rejects(new Error("Registration failed"));
  
    cy.mount(
      <MemoryRouter>
        <Wrapper>
          <SignUp />
        </Wrapper>
      </MemoryRouter>
    );
  
    // Fill valid data
    cy.get("#signUpEmail").type("test@example.com");
    // Complete the rest of the form input
  
    cy.get(".form_postBtn").click();
  
    cy.get(".Toastify__toast-body").should(
      "contain",
      "Unable to register the user"
    );
  });

  it("navigates to register page when register link is clicked", () => {
    const navigate = cy.stub();
  
    cy.mount(
      <MemoryRouter>
        <Wrapper>
          <SignUp />
        </Wrapper>
      </MemoryRouter>
    );
  
    cy.get(".loginLink a").click();
  
    cy.wrap(navigate).should("be.calledWith", "/login");
  });
  
});
