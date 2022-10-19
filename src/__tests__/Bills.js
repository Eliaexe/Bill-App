/**
 * @jest-environment jsdom
 */

import {fireEvent, screen, waitFor} from "@testing-library/dom"
import '@testing-library/jest-dom/extend-expect'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bill from "../containers/Bills.js"
import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.getAttribute('class')).toContain('active-icon')
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("The eye icon should display the bill image", async () =>{
      const store = null;
      const bill = new Bill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
      const eyeBtn = screen.getAllByTestId('icon-eye')[0]
      $.fn.modal = jest.fn();
      const handleClickIconEye = jest.fn(() => bill.handleClickIconEye(eyeBtn));
      eyeBtn.addEventListener("click", handleClickIconEye);
      fireEvent.click(eyeBtn)
      await waitFor(() => {screen.getAllByTestId("billImage")})
      expect(screen.getAllByTestId("billImage")[0]).toBeVisible()
    })
  })
})
