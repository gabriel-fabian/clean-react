import { makeSignUpValidation } from '@/main/factories/pages/signup/signup-validation-factory'
import { ValidationBuilder as Builder } from '@/validation/validators/builder/validation-builder'
import { ValidationComposite } from '@/validation/validators'

describe('SignUpValidationFactory', () => {
  test('Should make ValidationComposite with correct validations', () => {
    const composite = makeSignUpValidation()
    expect(composite).toEqual(ValidationComposite.build([
      ...Builder.field('name').required().minLength(2).build(),
      ...Builder.field('email').required().email().build(),
      ...Builder.field('password').required().minLength(5).build(),
      ...Builder.field('passwordConfirmation').required().equalTo('password').build()
    ]))
  })
})
