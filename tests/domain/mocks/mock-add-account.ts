import { AddAccount } from '@/domain/usecases'
import { mockAccountModel } from './mock-account'
import { faker } from '@faker-js/faker'

export const mockAddAccountParams = (): AddAccount.Params => {
  const password = faker.internet.password()
  return {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: password,
    passwordConfirmation: password
  }
}

export const mockAddAccountModel = (): AddAccount.Model => mockAccountModel()
