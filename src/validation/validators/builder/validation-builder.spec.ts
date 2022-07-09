import { ValidationBuilder as sut } from './validation-builder'
import { RequiredFieldValidation, EmailValidation, MinLenghtValidation } from '@/validation/validators'

describe('ValidationBuilder', () => {
  test('Should return RequiredFieldValidation', () => {
    const validations = sut.field('any_field').required().build()
    expect(validations).toEqual([new RequiredFieldValidation('any_field')])
  })

  test('Should return EmailValidation', () => {
    const validations = sut.field('any_field').email().build()
    expect(validations).toEqual([new EmailValidation('any_field')])
  })

  test('Should return MinLength', () => {
    const validations = sut.field('any_field').minLength(5).build()
    expect(validations).toEqual([new MinLenghtValidation('any_field', 5)])
  })
})
