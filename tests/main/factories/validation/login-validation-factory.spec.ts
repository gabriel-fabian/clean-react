import { makeLoginValidation } from '@/main/factories/pages/login/login-validation-factory'
import {
  EmailValidation,
  MinLenghtValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@/validation/validators'

describe('LoginValidationFactory', () => {
  test('Should make ValidationComposite with correct validations', () => {
    const composite = makeLoginValidation()
    expect(composite).toEqual(ValidationComposite.build([
      new RequiredFieldValidation('email'),
      new EmailValidation('email'),
      new RequiredFieldValidation('password'),
      new MinLenghtValidation('password', 5)
    ]))
  })
})
