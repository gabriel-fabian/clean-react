import React from 'react'
import SignUp from './signup'
import { render, RenderResult } from '@testing-library/react'
import { Helper } from '@/presentation/test'

type SutTypes = {
  sut: RenderResult
}

const makeSut = (): SutTypes => {
  const sut = render(
      <SignUp />
  )
  return {
    sut
  }
}

describe('SignUp Component', () => {
  test('Should render with initial state', () => {
    const validationError = 'Campo Obrigatório'
    const { sut } = makeSut()
    Helper.expectChildCount(sut, 'error-wrap', 0)
    Helper.expectButtonIsDisabled(sut, 'submit', true)
    Helper.expectStatusForField(sut, 'name', validationError)
    Helper.expectStatusForField(sut, 'email', validationError)
    Helper.expectStatusForField(sut, 'password', validationError)
    Helper.expectStatusForField(sut, 'passwordConfirmation', validationError)
  })
})
