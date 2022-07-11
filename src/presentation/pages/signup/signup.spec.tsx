import React from 'react'
import { faker } from '@faker-js/faker'
import { cleanup, render, RenderResult } from '@testing-library/react'
import SignUp from './signup'
import { Helper, ValidationStub } from '@/presentation/test'

type SutTypes = {
  sut: RenderResult
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const sut = render(
      <SignUp
        validation={validationStub}
      />
  )
  return {
    sut
  }
}

describe('SignUp Component', () => {
  afterEach(cleanup)

  test('Should render with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.expectChildCount(sut, 'error-wrap', 0)
    Helper.expectButtonIsDisabled(sut, 'submit', true)
    Helper.expectStatusForField(sut, 'name', validationError)
    Helper.expectStatusForField(sut, 'email', 'Campo Obrigatório')
    Helper.expectStatusForField(sut, 'password', 'Campo Obrigatório')
    Helper.expectStatusForField(sut, 'passwordConfirmation', 'Campo Obrigatório')
  })

  test('Should show name error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, 'name')
    Helper.expectStatusForField(sut, 'name', validationError)
  })
})
