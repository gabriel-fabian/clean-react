import { ValidationBuilder as Builder } from '@/validation/validators/builder/validation-builder'
import { ValidationComposite } from '@/validation/validators'

export const makeSignUpValidation = (): ValidationComposite => {
  return ValidationComposite.build([
    ...Builder.field('name').required().minLength(2).build(),
    ...Builder.field('email').required().email().build(),
    ...Builder.field('password').required().minLength(5).build(),
    ...Builder.field('passwordConfirmation').required().minLength(5).build()
  ])
}
