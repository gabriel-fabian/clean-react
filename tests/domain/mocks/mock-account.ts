import { AddAccount, Authentication } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

export const mockAuthentication = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAccountModel = (): AddAccount.Model => ({
  accessToken: faker.datatype.uuid(),
  name: faker.name.findName()
})
