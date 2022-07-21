import React from 'react'
import { PrivateRoute } from '@/presentation/components'
import { render } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { ApiContext } from '@/presentation/contexts'
import { mockAccountModel } from '@/tests/domain/mocks'
import { SignUp } from '@/presentation/pages'
import { AddAccountSpy, ValidationStub } from '@/tests/presentation/mocks'

type SutTypes = {
  history: MemoryHistory
}

const makeSut = (account = mockAccountModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })
  const validationStub = new ValidationStub()
  const addAccountSpy = new AddAccountSpy()
  render(
    <ApiContext.Provider value={{ getCurrentAccount: () => account }}>
      <Router location={history.location} navigator={history}>
          <PrivateRoute>
            <SignUp
              addAccount={addAccountSpy}
              validation={validationStub}
            />
          </PrivateRoute>
      </Router>
    </ApiContext.Provider>
  )
  return {
    history
  }
}

describe('PrivateRoute', () => {
  test('Should redirect to /login if accessToken is empty', () => {
    const { history } = makeSut(null)
    expect(history.location.pathname).toBe('/login')
  })

  test('Should render current component if accessToken is not empty', () => {
    const { history } = makeSut()
    expect(history.location.pathname).toBe('/')
  })
})
