/**
 * @jest-environment jsdom
 */

import {fireEvent, screen, wait, waitFor} from "@testing-library/dom"
import '@testing-library/jest-dom/extend-expect'
import BillsUI from "../views/BillsUI.js"
import { bills, corruptedBill } from "../fixtures/bills.js"
import { ROUTES_PATH, ROUTES} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bill from "../containers/Bills.js"
import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";
import mockedBills from "../__mocks__/store";
import { formatDate, formatStatus } from "../app/format.js"
import corruptedBills from "../__mocks__/corruptedStore.js"

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
    test("Clicked the eye icon should be displayed the bill image", async () =>{
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
  describe("When the 'Nouvelle note de frais' is clicked", () => {
    test('The new bill form should be displayed', async () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;
      const bill = new Bill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
      const btn = screen.getByTestId('btn-new-bill')
      await waitFor(() => {btn})
      const handleClickNewBill = jest.fn((e) => bill.handleClickNewBill(e))
      btn.addEventListener("click", handleClickNewBill)
      fireEvent.click(btn)
      const form = screen.getByTestId('form-new-bill')
      await waitFor(() => {form})
      expect(form).toBeVisible()
    })
  })
  
  describe("When the data is fetched whit getBills()", () => {
    test("and the data are NOT CORRUPTED it should return the data with dates FORMATTED", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = mockedBills
      const bill = new Bill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
      // const handlegetBills = jest.fn(() => )
      const originalData = bill.getBills().then(x => {
        // console.log(x[0].date , x[0].id);
        return x[0].date
      })
      const formattedData = await mockedBills.bills().list().then(x => {
        // console.log(x[0].date , x[0].id);
        return x[0].date
      })
      expect(originalData.toString()).toMatch(/[^A-Za-z0-9]+/)
      expect(formattedData.toString()).toMatch(/^[0-9\.\-\/]+/)
    })
    test("and the data are CORRUPTED it should return data NOT formatted", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = corruptedBills
      const bill = new Bill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
      const corruptedData = await bill.getBills().then(x => {
        // console.log(x[0].date , x[0].id);
        return x[0].date
      })
      expect(corruptedData).toEqual('LOL corrupted LOL')
    })
  })

})
