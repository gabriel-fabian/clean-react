import { ValidationBuilder as sut } from './validation-builder'
import { RequiredFieldValidation, EmailValidation, MinLenghtValidation } from '@/validation/validators'
import { faker } from '@faker-js/faker'

describe('ValidationBuilder', () => {
  test('Should return RequiredFieldValidation', () => {
    const field = faker.database.column()
    const validations = sut.field(field).required().build()
    expect(validations).toEqual([new RequiredFieldValidation(field)])
  })

  test('Should return EmailValidation', () => {
    const field = faker.database.column()
    const validations = sut.field(field).email().build()
    expect(validations).toEqual([new EmailValidation(field)])
  })

  test('Should return MinLength', () => {
    const field = faker.database.column()
    const length = faker.datatype.number()
    const validations = sut.field(field).minLength(length).build()
    expect(validations).toEqual([new MinLenghtValidation(field, length)])
  })

  test('Should return a list of validations', () => {
    const field = faker.database.column()
    const length = faker.datatype.number()
    const validations = sut.field(field).required().minLength(length).email().build()
    expect(validations).toEqual([
      new RequiredFieldValidation(field),
      new MinLenghtValidation(field, length),
      new EmailValidation(field)
    ])
  })
})
