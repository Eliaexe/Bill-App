/**
 * @jest-environment jsdom
 */

import { fireEvent, logDOM, screen, wait, waitFor} from "@testing-library/dom"
import '@testing-library/jest-dom/extend-expect'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"


describe("Given I am connected as an employee", () => {
  beforeAll(() => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
      })
    );
  });
  describe("When I am on NewBill Page", () => {
    test("Then it should renders the form", () => {
      document.body.innerHTML = NewBillUI()
      expect(screen.getByTestId('form-new-bill')).toBeTruthy()
    });
    describe("When I do not fill the form i submit", () => {
      test("Then it should not change page", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;
      const billNew = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
      const form = screen.getByTestId('form-new-bill')
      const handleSubmit = jest.fn((e) => billNew.handleSubmit(e))
      form.addEventListener('submit', handleSubmit)
      // const formElements = {
      //   type: screen.getByTestId('expense-type').value,
      //   name:  screen.getByTestId('expense-name').value,
      //   amount: parseInt(screen.getByTestId('amount').value),
      //   date:  screen.getByTestId('datepicker').value,
      //   vat: screen.getByTestId('vat').value,
      //   pct: parseInt(screen.getByTestId('pct').value) || 20,
      //   commentary: screen.getByTestId('commentary').value,
      //   file: screen.getByTestId('file'),
      // }


      fireEvent.submit(form)
      expect(form).toBeTruthy()
      })
    });
  })
})
