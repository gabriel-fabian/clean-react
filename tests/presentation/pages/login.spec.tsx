import { Login } from '@/presentation/pages'
import { currentAccountState } from '@/presentation/components'
import { Authentication } from '@/domain/usecases'
import { InvalidCredentialsError } from '@/domain/errors'
import { ValidationStub, AuthenticationSpy, Helper } from '@/tests/presentation/mocks'
import { mockAccountModel } from '@/tests/domain/mocks'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { faker } from '@faker-js/faker'
import { RecoilRoot } from 'recoil'
import React from 'react'

type SutTypes = {
  authenticationSpy: AuthenticationSpy
  setCurrentAccountMock: (account: Authentication.Model) => void
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
  const mockedState = { setCurrentAccount: setCurrentAccountMock, getCurrentAccount: () => mockAccountModel() }
  render(
      <RecoilRoot initializeState={({ set }) => set(currentAccountState, mockedState)}>
        <Router location={history.location} navigator={history}>
          <Login
            validation={validationStub}
            authentication={authenticationSpy}
          />
        </Router>
      </RecoilRoot>
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
    expect(screen.getByTestId('submit')).toBeDisabled()
    expect(screen.getByTestId('error-wrap').children).toHaveLength(0)
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
    expect(screen.getByTestId('submit')).toBeEnabled()
  })

  test('Should show spinner on submit', () => {
    makeSut()
    simulateValidSubmit()
    expect(screen.queryByTestId('spinner')).toBeInTheDocument()
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
      expect(screen.getByTestId('error-message')).toHaveTextContent(error.message)
      expect(screen.getByTestId('error-wrap').children).toHaveLength(1)
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
