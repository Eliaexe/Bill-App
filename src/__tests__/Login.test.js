/**
 * @jest-environment jsdom
 */

import LoginUI from "../views/LoginUI";
import Login from "../containers/Login.js";
import { ROUTES } from "../constants/routes";
import { fireEvent, screen, waitFor } from "@testing-library/dom";
import '@testing-library/jest-dom/extend-expect'

describe("Given that I am a user on login page", () => {
  describe("When i am the employee and i click on the submit button without filling the form", () => {
    test("Then It should renders Login page", () => {
      document.body.innerHTML = LoginUI();
      const inputEmail = screen.getByTestId("employee-email-input");
      expect(inputEmail.value).toBe("");
      const inputPassword = screen.getByTestId("employee-password-input");
      expect(inputPassword.value).toBe("");
      const form = screen.getByTestId("form-employee");
      const submit = jest.fn((e) => e.preventDefault());
      form.addEventListener("submit", submit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-employee")).toBeTruthy();
    });
  });

  describe("When i am the employee and i do fill fields in incorrect format and I click on the submit button", () => {
    test("Then It should renders Login page", () => {
      document.body.innerHTML = LoginUI();
      const inputEmail = screen.getByTestId("employee-email-input");
      fireEvent.change(inputEmail, { target: { value: "falsemail" } });
      expect(inputEmail.value).toBe("falsemail");
      const inputPassword = screen.getByTestId("employee-password-input");
      fireEvent.change(inputPassword, { target: { value: "passworddd" } });
      expect(inputPassword.value).toBe("passworddd");
      const form = screen.getByTestId("form-employee");
      const submit = jest.fn((e) => e.preventDefault());
      form.addEventListener("submit", submit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-employee")).toBeTruthy();
    });
  });

  describe("When i am the employee and i click on the submit button with the form filled in correct format", () => {
    test("Then I should be identified as an Employee in app", () => {
      // localStorage 
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      });
      // navigation 
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      let PREVIOUS_LOCATION = "";
      const store = jest.fn();
      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        store,
      });
      document.body.innerHTML = LoginUI();
      const inputData = {
        email: "johndoe@email.com",
        password: "azerty",
      };
      const inputEmail = screen.getByTestId("employee-email-input");
      fireEvent.change(inputEmail, { target: { value: inputData.email } });
      expect(inputEmail.value).toBe(inputData.email);
      const inputPassword = screen.getByTestId("employee-password-input");
      fireEvent.change(inputPassword, {
        target: { value: inputData.password },
      });
      expect(inputPassword.value).toBe(inputData.password);
      const form = screen.getByTestId("form-employee");
      const submit = jest.fn(login.handleSubmitEmployee);
      login.login = jest.fn().mockResolvedValue({});
      form.addEventListener("submit", submit);
      fireEvent.submit(form);
      expect(submit).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Employee",
          email: inputData.email,
          password: inputData.password,
          status: "connected",
        })
      );
    });
  });
});

describe("Given that I am a user on login page", () => {
  // test('handleSubmitAdmin calls createUser on login rejection', () => {
  //   document.body.innerHTML = LoginUI();
  //   const mockStore = {
  //     login: jest.fn().mockRejectedValue(new Error('login error')),
  //     users: jest.fn(),
  //   }
  //   const login = new Login({
  //     document: document,
  //     localStorage: localStorage,
  //     onNavigate: jest.fn(),
  //     PREVIOUS_LOCATION: '',
  //     store: mockStore,
  //   })
  //   const form = document.createElement('form')
  //   form.setAttribute('data-testid', 'form-admin')
  //   const emailInput = document.createElement('input')
  //   emailInput.setAttribute('data-testid', 'admin-email-input')
  //   emailInput.value = 'admin@example.com'
  //   const passwordInput = document.createElement('input')
  //   passwordInput.setAttribute('data-testid', 'admin-password-input')
  //   passwordInput.value = 'password'
  //   form.appendChild(emailInput)
  //   form.appendChild(passwordInput)
  //   const event = new Event('submit')
  //   form.dispatchEvent(event)
  //   expect(mockStore.login).toHaveBeenCalledWith(
  //     JSON.stringify({
  //       email: 'admin@example.com',
  //       password: 'password',
  //     })
  //   )
  //   expect(mockStore.users).not.toHaveBeenCalled()
  //   expect(login.PREVIOUS_LOCATION).toBe('')
  // })
  describe("When i am the admin and i click on the submit button without filling the form", () => {
    test("Then It should renders Login page", () => {
      document.body.innerHTML = LoginUI();
      const inputEmail = screen.getByTestId("admin-email-input");
      expect(inputEmail.value).toBe("");
      const inputPassword = screen.getByTestId("admin-password-input");
      expect(inputPassword.value).toBe("");
      const form = screen.getByTestId("form-admin");
      const handleSubmit = jest.fn((e) => e.preventDefault());
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-admin")).toBeTruthy();
    });
  });

  describe("When i am the admin and i do fill fields in incorrect format and I click on the submit button", () => {
    test("Then it should renders Login page", () => {
      document.body.innerHTML = LoginUI();
      const inputEmail = screen.getByTestId("admin-email-input");
      fireEvent.change(inputEmail, { target: { value: "falsemail" } });
      expect(inputEmail.value).toBe("falsemail");
      const inputPassword = screen.getByTestId("admin-password-input");
      fireEvent.change(inputPassword, { target: { value: "password" } });
      expect(inputPassword.value).toBe("password");
      const form = screen.getByTestId("form-admin");
      const handleSubmit = jest.fn((e) => e.preventDefault());
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(screen.getByTestId("form-admin")).toBeTruthy();
    });
  });

  describe("When i am the admin and i click on the submit button with the form filled in correct format", () => {
    test("Then I should be identified as an HR admin in app", () => {
      // localStorage
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      });
      // navigation
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      let PREVIOUS_LOCATION = "";
      const store = jest.fn();
      const login = new Login({
        document,
        localStorage: window.localStorage,
        onNavigate,
        PREVIOUS_LOCATION,
        store,
      });

      document.body.innerHTML = LoginUI();
      const inputData = {
        type: "Admin",
        email: "johndoe@email.com",
        password: "azerty",
        status: "connected",
      };
      const inputEmail = screen.getByTestId("admin-email-input");
      fireEvent.change(inputEmail, { target: { value: inputData.email } });
      expect(inputEmail.value).toBe(inputData.email);
      const inputPassword = screen.getByTestId("admin-password-input");
      fireEvent.change(inputPassword, {
        target: { value: inputData.password },
      });
      expect(inputPassword.value).toBe(inputData.password);
      const form = screen.getByTestId("form-admin");
      const submit = jest.fn(login.handleSubmitAdmin);
      login.login = jest.fn().mockResolvedValue({});
      form.addEventListener("submit", submit);
      fireEvent.submit(form);
      expect(submit).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Admin",
          email: inputData.email,
          password: inputData.password,
          status: "connected",
        })
      );
    });
  });

  describe('Login class', () => {
    describe('login method', () => {

    })
  })
});
