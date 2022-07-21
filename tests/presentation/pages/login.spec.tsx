import React from 'react'
import { act } from 'react-dom/test-utils'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { faker } from '@faker-js/faker'
import { Router } from 'react-router-dom'
import { ApiContext } from '@/presentation/contexts'
import { Login } from '@/presentation/pages'
import { ValidationStub, AuthenticationSpy, Helper } from '@/tests/presentation/mocks'
import { InvalidCredentialsError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'

type SutTypes = {
  authenticationSpy: AuthenticationSpy
  setCurrentAccountMock: (account: AccountModel) => void
}

type SutParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/login'] })
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const authenticationSpy = new AuthenticationSpy()
  const setCurrentAccountMock = jest.fn()
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router location={history.location} navigator={history}>
        <Login
          validation={validationStub}
          authentication={authenticationSpy}
        />
      </Router>
    </ApiContext.Provider>
  )
  return {
    authenticationSpy,
    setCurrentAccountMock
  }
}

const simulateValidSubmit = (email = faker.internet.email(), password = faker.internet.password()): void => {
  Helper.populateField('email', email)
  Helper.populateField('password', password)
  const submitButton = screen.getByTestId('submit')
  fireEvent.click(submitButton)
}

describe('Login Component', () => {
  test('Should render with initial state', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    Helper.expectButtonIsDisabled('submit', true)
    Helper.expectChildCount('error-wrap', 0)
    Helper.expectStatusForField('email', validationError)
    Helper.expectStatusForField('password', validationError)
  })

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    Helper.populateField('email')
    Helper.expectStatusForField('email', validationError)
  })

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    Helper.populateField('password')
    Helper.expectStatusForField('password', validationError)
  })

  test('Should show valid email state if Validation succeeds', () => {
    makeSut()
    Helper.populateField('email')
    Helper.expectStatusForField('email')
  })

  test('Should show valid password state if Validation succeeds', () => {
    makeSut()
    Helper.populateField('password')
    Helper.expectStatusForField('password')
  })

  test('Should enable submit button if form is valid', () => {
    makeSut()
    Helper.populateField('email')
    Helper.populateField('password')
    Helper.expectButtonIsDisabled('submit', false)
  })

  test('Should show spinner on submit', () => {
    makeSut()
    simulateValidSubmit()
    Helper.testElementExists('spinner')
  })

  test('Should call Authentication with correct values', () => {
    const { authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    simulateValidSubmit(email, password)
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('Should call Authentication only once', () => {
    const { authenticationSpy } = makeSut()
    simulateValidSubmit()
    simulateValidSubmit()
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words()
    const { authenticationSpy } = makeSut({ validationError })
    Helper.populateField('email')
    fireEvent.submit(screen.getByTestId('form'))
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should present error if Authentication fails', async () => {
    const { authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)
    simulateValidSubmit()
    await waitFor(() => {
      Helper.testElementText('error-message', error.message)
      Helper.expectChildCount('error-wrap', 1)
    })
  })

  test('Should clear error message on authentication retry', async () => {
    const { authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error)
    simulateValidSubmit() // Populate errorMessage
    await waitFor(() => {
      const errorMessage = screen.queryAllByText(error.message)
      expect(errorMessage.length).toBe(1)
    })
    act(() => { simulateValidSubmit() })
    await waitFor(() => {
      const errorMessage = screen.queryAllByText(error.message)
      expect(errorMessage.length).toBe(0)
    })
  })

  test('Should call UpdateCurrentAccount on success', async () => {
    const { authenticationSpy, setCurrentAccountMock } = makeSut()
    simulateValidSubmit()
    await waitFor(() => {
      screen.getByTestId('form')
      expect(setCurrentAccountMock).toHaveBeenCalledWith(authenticationSpy.account)
    })
    expect(history.location.pathname).toBe('/')
    expect(history.index).toBe(0)
  })

  test('Should redirect to signUp page', async () => {
    makeSut()
    const signup = screen.getByTestId('signup-link')
    fireEvent.click(signup)
    expect(history.location.pathname).toBe('/signup')
    expect(history.index).toBe(1)
  })
})
