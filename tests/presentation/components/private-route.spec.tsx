import { PrivateRoute } from '@/presentation/components'
import { createMemoryHistory, MemoryHistory } from 'history'
import { mockAccountModel } from '@/tests/domain/mocks'
import { renderWithHistory } from '@/tests/presentation/mocks'

import React from 'react'

type SutTypes = {
  history: MemoryHistory
}

const makeSut = (account = mockAccountModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })
  renderWithHistory({
    history,
    Page: () => PrivateRoute({ outlet: <></> }),
    account
  })
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
