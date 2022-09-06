import * as FormHelper from '../utils/form-helpers'
import * as Helper from '../utils/helpers'
import * as Http from '../utils/http-mocks'
import { faker } from '@faker-js/faker'

const path = /api\/login/
const mockInvalidCredentialsError = (): void => Http.mockUnauthorizedError(path)
const mockUnexpectedError = (): void => Http.mockServerError(path, 'POST')
const mockSucces = (): void => {
  Http.mockOk(/api\/surveys/, 'GET', 'survey-list')
  Http.mockOk(path, 'POST', 'account', 'loginRequest')
}

const populateFields = (): void => {
  cy.getByTestId('email').type(faker.internet.email())
  cy.getByTestId('password').type(faker.random.alphaNumeric(5))
}

const simulateValidSubmit = (): void => {
  populateFields()
  cy.getByTestId('submit').click()
}

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })

  it('Should load with correct initial state', () => {
    FormHelper.testInputStatus('email', 'Campo obrigatório')
    FormHelper.testInputStatus('password', 'Campo obrigatório')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should reset state on page load', () => {
    cy.getByTestId('email').type(faker.internet.email())
    FormHelper.testInputStatus('email')
    cy.getByTestId('signup-link').click()
    cy.getByTestId('login-link').click()
    FormHelper.testInputStatus('email', 'Campo obrigatório')
  })

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').type(faker.random.word())
    FormHelper.testInputStatus('email', 'Valor inválido')
    cy.getByTestId('password').type(faker.random.alphaNumeric(3))
    FormHelper.testInputStatus('password', 'Valor inválido')
    cy.getByTestId('submit').should('have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('email').type(faker.internet.email())
    FormHelper.testInputStatus('email')
    cy.getByTestId('password').type(faker.random.alphaNumeric(5))
    FormHelper.testInputStatus('password')
    cy.getByTestId('submit').should('not.have.attr', 'disabled')
    cy.getByTestId('error-wrap').should('not.have.descendants')
  })

  it('Should present invalidCredentialsError on 401', () => {
    mockInvalidCredentialsError()
    simulateValidSubmit()
    FormHelper.testErrorMessage('Credenciais inválidas')
    Helper.testUrl('/login')
  })

  it('Should present unexpectedError on default error cases', () => {
    mockUnexpectedError()
    simulateValidSubmit()
    FormHelper.testErrorMessage('Algo de errado aconteceu. Tente novamente em breve')
    Helper.testUrl('/login')
  })

  it('Should store account on localStorage if valid credentials are provided', () => {
    mockSucces()
    simulateValidSubmit()
    Helper.testUrl('/')
    Helper.testLocalStorageItem('account')
  })

  it('Should prevent multiple submits', () => {
    mockSucces()
    populateFields()
    cy.getByTestId('submit').dblclick()
    cy.wait('@loginRequest')
    cy.get('@loginRequest.all').should('have.length', 1)
  })

  it('Should not call submit if form is invalid', () => {
    mockSucces()
    cy.getByTestId('email').type(faker.internet.email()).type('{enter}')
    cy.get('@loginRequest.all').should('have.length', 0)
  })
})
