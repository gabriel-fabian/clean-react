import { InvalidFieldError } from '@/validation/errors'
import { MinLenghtValidation } from './min-length-validation'

describe('MinLengthValidation', () => {
  test('Shoul return error if value is invalid', () => {
    const sut = new MinLenghtValidation('field', 5)
    const error = sut.validate('123')
    expect(error).toEqual(new InvalidFieldError())
  })
})
