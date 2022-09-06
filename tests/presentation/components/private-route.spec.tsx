import React from 'react'
import { currentAccountState, PrivateRoute } from '@/presentation/components'
import { render } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { mockAccountModel } from '@/tests/domain/mocks'

type SutTypes = {
  history: MemoryHistory
}

const makeSut = (account = mockAccountModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })
  const mockedState = { setCurrentAccount: jest.fn(), getCurrentAccount: () => account }
  render(
    <RecoilRoot initializeState={({ set }) => set(currentAccountState, mockedState)}>
      <Router location={history.location} navigator={history}>
          <PrivateRoute
            outlet={<></>}
          />
      </Router>
    </RecoilRoot>
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
