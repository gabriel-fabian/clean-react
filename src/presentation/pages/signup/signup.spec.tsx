import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import SignUp from './signup'

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

const expectChildCount = (sut: RenderResult, fieldName: string, count: number): void => {
  const el = sut.getByTestId(fieldName)
  expect(el.childElementCount).toBe(count)
}

const expectButtonIsDisabled = (sut: RenderResult, fieldName: string, isDisabled: boolean): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

const expectStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const status = sut.getByTestId(`${fieldName}-status`)
  expect(status.title).toBe(validationError || 'Tudo certo!')
  expect(status.textContent).toBe(validationError ? '🔴' : '🟢')
}

describe('SignUp Component', () => {
  test('Should render with initial state', () => {
    const validationError = 'Campo Obrigatório'
    const { sut } = makeSut()
    expectChildCount(sut, 'error-wrap', 0)
    expectButtonIsDisabled(sut, 'submit', true)
    expectStatusForField(sut, 'name', validationError)
    expectStatusForField(sut, 'email', validationError)
    expectStatusForField(sut, 'password', validationError)
    expectStatusForField(sut, 'passwordConfirmation', validationError)
  })
})
