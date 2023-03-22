/**
 * @jest-environment jsdom
 */

 import { fireEvent, logDOM, screen, wait, waitFor, render} from "@testing-library/dom"
 import '@testing-library/jest-dom/extend-expect'
 import NewBillUI from "../views/NewBillUI.js"
 import NewBill from "../containers/NewBill.js"
 import {localStorageMock} from "../__mocks__/localStorage.js"
 import { ROUTES, ROUTES_PATH } from "../constants/routes"
 import userEvent from "@testing-library/user-event"
 import mockedBills from "../__mocks__/store.js"
 import user from '@testing-library/user-event'
 import router from "../app/Router"
 import mockStore from "../__mocks__/store"
 
  describe("Given I am connected as an employee", () => {
    beforeAll(() => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "employee@test.tld"
        })
      );
    });

    describe("I submit the form whitout fill the inputs required", ()=> {
      test('it should remain in the New Bill page', () =>{
        const html = NewBillUI()
        document.body.innerHTML = html
        const form = screen.getByTestId("form-new-bill")
        expect(form).toBeVisible()
        const handleSubmit = jest.fn((e) => e.preventDefault());
        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form);
        expect(screen.getByText('Envoyer une note de frais')).toBeVisible()
      })
    })
    describe("I submit the form filled whit the data required", ()=>{
      test('it should return the Bills page', async () =>{
        const html = NewBillUI()
        document.body.innerHTML = html
        const form = screen.getByTestId("form-new-bill")
        expect(form).toBeVisible()
  
        const type = screen.getByTestId('expense-type')
        fireEvent.change(type, { target: { value: "Services en ligne" } })
        expect(type.value).toBe("Services en ligne")
  
        const name = screen.getByTestId('expense-name')
        fireEvent.change(name, { target: { value: "Facture telephone Free" } })
        expect(name.value).toBe("Facture telephone Free")
  
        const date = screen.getByTestId('datepicker')
        var time = new Date();
        var currentDate = time.toISOString().substring(0,10);
        fireEvent.change(date, { target: { value: currentDate } })
        expect(date.value).toBe(currentDate)        

        const amount = screen.getByTestId('amount')
        fireEvent.change(amount, { target: { value: "16" } })
        expect(amount.value).toBe("16")
        
        const vat = screen.getByTestId('vat')
        fireEvent.change(vat, { target: { value: "10" } })
        expect(vat.value).toBe("10")

        const pct = screen.getByTestId('pct')
        fireEvent.change(pct, { target: { value: "15" } })
        expect(pct.value).toBe("15")

        const file = screen.getByTestId('file')
        const fileTest = { name: "facturefreemobile.jpg", lastModified: 1664646423688, webkitRelativePath: "", size: 23241, type: "image/jpeg" }
        fireEvent.change(file, {
          target: { files: { item: fileTest, length: 1, 0: file } },
        });
        expect(file.files[0]).not.toBe("")

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const store = mockedBills;
        const billNew = new NewBill({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage,
        });
        
        const handleSubmit = jest.fn((e) => billNew.handleSubmit(e));
        form.addEventListener("submit", handleSubmit)
        fireEvent.submit(form);
        expect(screen.getByTestId('btn-new-bill')).toBeVisible()
      })
    })
    describe("I try to use the input file uploading some file", () => {
      test('i upload the file whit the RIGHT extension, ', async ()=> {
        const html = NewBillUI()
        document.body.innerHTML = html
        const form = screen.getByTestId("form-new-bill")
        expect(form).toBeVisible()
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const store = mockedBills;
        const billNew = new NewBill({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage,
        });
        
        const handleChangeFile = jest.fn((e) => billNew.handleChangeFile(e));
        const input = screen.getByTestId('file')
        expect(input).toBeVisible()
        input.addEventListener("change", handleChangeFile)

        const file = new File(["hello"], "hello.png", { type: "image/png" });
        fireEvent.change(input, {
          target: { files: { item: () => file, length: 1, 0: file } },
        });
        expect(input.classList.contains("ok-input")).toBe(true)
      })
      test('i upload the file whit the WRONG extension, ', async ()=> {
        const html = NewBillUI()
        document.body.innerHTML = html
        const form = screen.getByTestId("form-new-bill")
        expect(form).toBeVisible()
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const store = mockedBills;
        const billNew = new NewBill({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage,
        });
        
        const handleChangeFile = jest.fn((e) => billNew.handleChangeFile(e));
        const input = screen.getByTestId('file')
        expect(input).toBeVisible()
        input.addEventListener("change", handleChangeFile)

        const file = new File(["hello"], "hello.pdf", { type: "application/pdf" });
        fireEvent.change(input, {
          target: { files: { item: () => file, length: 1, 0: file } },
        });
        expect(input.classList.contains("error-input")).toBe(true)
      })
    })    
  })
 