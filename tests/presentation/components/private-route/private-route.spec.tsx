import React from 'react'
import { PrivateRoute } from '@/presentation/components'
import { render } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

describe('PrivateRoute', () => {
  test('Should redirect to /login if accessToken is empty', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] })
    render(
      <Router location={history.location} navigator={history}>
        <PrivateRoute />
      </Router>
    )
    expect(history.location.pathname).toBe('/login')
  })
})
