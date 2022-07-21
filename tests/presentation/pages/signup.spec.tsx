import React from 'react'
import { faker } from '@faker-js/faker'
import { fireEvent, render, waitFor, screen } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { ApiContext } from '@/presentation/contexts'
import { SignUp } from '@/presentation/pages'
import { AddAccountSpy, Helper, ValidationStub } from '@/tests/presentation/mocks'
import { EmailInUseError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'

type SutTypes = {
  addAccountSpy: AddAccountSpy
  setCurrentAccountMock: (account: AccountModel) => void
}

type SutParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/login'] })
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const addAccountSpy = new AddAccountSpy()
  const setCurrentAccountMock = jest.fn()
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router location={history.location} navigator={history}>
        <SignUp
          validation={validationStub}
          addAccount={addAccountSpy}
        />
      </Router>
    </ApiContext.Provider>
  )
  return {
    addAccountSpy,
    setCurrentAccountMock
  }
}

const simulateValidSubmit = async (name = faker.name.findName(), email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  Helper.populateField('name', name)
  Helper.populateField('email', email)
  Helper.populateField('password', password)
  Helper.populateField('passwordConfirmation', password)
  const form = screen.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

describe('SignUp Component', () => {
  test('Should render with initial state', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    expect(screen.getByTestId('error-wrap').children).toHaveLength(0)
    expect(screen.getByTestId('submit')).toBeDisabled()
    Helper.expectStatusForField('name', validationError)
    Helper.expectStatusForField('email', validationError)
    Helper.expectStatusForField('password', validationError)
    Helper.expectStatusForField('passwordConfirmation', validationError)
  })

  test('Should show name error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    Helper.populateField('name')
    Helper.expectStatusForField('name', validationError)
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

  test('Should show passwordConfirmation error if Validation fails', () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    Helper.populateField('passwordConfirmation')
    Helper.expectStatusForField('passwordConfirmation', validationError)
  })

  test('Should show valid name state if Validation succeeds', () => {
    makeSut()
    Helper.populateField('name')
    Helper.expectStatusForField('name')
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

  test('Should show valid passwordConfirmation state if Validation succeeds', () => {
    makeSut()
    Helper.populateField('passwordConfirmation')
    Helper.expectStatusForField('passwordConfirmation')
  })

  test('Should enable submit button if form is valid', () => {
    makeSut()
    Helper.populateField('name')
    Helper.populateField('email')
    Helper.populateField('password')
    Helper.populateField('passwordConfirmation')
    expect(screen.getByTestId('submit')).toBeEnabled()
  })

  test('Should show spinner on submit', async () => {
    makeSut()
    await simulateValidSubmit()
    expect(screen.queryByTestId('spinner')).toBeInTheDocument()
  })

  test('Should call AddAccount with correct values', async () => {
    const { addAccountSpy } = makeSut()
    const name = faker.internet.email()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmit(name, email, password)
    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password
    })
  })

  test('Should call AddAccount only once', async () => {
    const { addAccountSpy } = makeSut()
    await simulateValidSubmit()
    await simulateValidSubmit()
    expect(addAccountSpy.callsCount).toBe(1)
  })

  test('Should not call AddAccount if form is invalid', async () => {
    const validationError = faker.random.words()
    const { addAccountSpy } = makeSut({ validationError })
    await simulateValidSubmit()
    expect(addAccountSpy.callsCount).toBe(0)
  })

  test('Should present error if AddAccount fails', async () => {
    const { addAccountSpy } = makeSut()
    const error = new EmailInUseError()
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error)
    await simulateValidSubmit()
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(error.message)
      expect(screen.getByTestId('error-wrap').children).toHaveLength(1)
    })
  })

  test('Should clear error message on AddAccount retry', async () => {
    const { addAccountSpy } = makeSut()
    const error = new EmailInUseError()
    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error)
    await simulateValidSubmit() // Populate errorMessage
    await waitFor(() => {
      const errorMessage = screen.queryAllByText(error.message)
      expect(errorMessage.length).toBe(1)
    })
    await simulateValidSubmit()
    await waitFor(() => {
      const errorMessage = screen.queryAllByText(error.message)
      expect(errorMessage.length).toBe(0)
    })
  })

  test('Should call SaveAccessToken on success', async () => {
    const { addAccountSpy, setCurrentAccountMock } = makeSut()
    await simulateValidSubmit()
    await waitFor(() => {
      screen.getByTestId('form')
      expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account)
    })
    expect(history.location.pathname).toBe('/')
    expect(history.index).toBe(0)
  })

  test('Should redirect to login page', async () => {
    makeSut()
    const loginLink = screen.getByTestId('login-link')
    fireEvent.click(loginLink)
    expect(history.location.pathname).toBe('/login')
    expect(history.index).toBe(1)
  })
})
