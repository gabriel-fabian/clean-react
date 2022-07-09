import { InvalidFieldError } from '@/validation/errors'
import { FieldValidation } from '@/validation/protocols/field-validation'

export class MinLenghtValidation implements FieldValidation {
  constructor (
    readonly field: string,
    private readonly minLength: number
  ) {}

  validate (value: string): Error {
    return new InvalidFieldError()
  }
}
