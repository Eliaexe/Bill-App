import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({ document, localStorage, onNavigate })
  }
  
  handleChangeFile = e => {
    e.preventDefault()
    const input = e.target
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    const fileName = file.name
    const formData = new FormData()
    const email = JSON.parse(localStorage.getItem("user")).email
    formData.append('file', file)
    formData.append('email', email)
    // Bug hunt 3
    if (fileName.includes('.gif') || fileName.includes('.png') || fileName.includes('jpeg') || fileName.includes('jpg') ) {
      input.classList.add('ok-input')
      this.sendTheData(formData, e.target.value, fileName)
    } else {
      input.classList.add('error-input')
    }
  }

  sendTheData = (data, url , name) => {
    this.store
    .bills()
    .create({
      data: data,
      headers: {
        noContentType: true
      }
    })
    .then(({key}) => {
      this.billId = key
      this.fileUrl = url
      this.fileName = name
    }).catch(error =>  {
      console.error(error);
      // throw error;
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const email = JSON.parse(localStorage.getItem("user")).email
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    } 

    const checkFormIsOk = () => {
      var counter = 0
      const formElements = document.getElementsByClassName('required')
      for (let i = 0; i < formElements.length; i++) {
        const e = formElements[i];
        if (!e.value == "") { counter++ }
        if (counter = 7) {
          this.updateBill(bill)
          this.onNavigate(ROUTES_PATH['Bills'])
        }
      }
    }
    checkFormIsOk()
  }

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
      .bills()
      .update({data: JSON.stringify(bill), selector: this.billId})
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => console.error(error))
    }
  }
}