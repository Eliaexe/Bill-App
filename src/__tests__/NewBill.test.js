/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import localStorageMock from "../__mocks__/localStorage.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then i submit whit the form incomplete", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      
    })
  })
})
