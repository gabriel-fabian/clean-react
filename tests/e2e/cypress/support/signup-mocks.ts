import * as Helper from './http-mocks'

import { faker } from '@faker-js/faker'

export const mockEmailInUseError = (): void => Helper.mockEmailInUseError(/signup/)
export const mockUnexpectedError = (): void => Helper.mockUnexpectedError(/signup/, 'POST')
export const mockOk = (): void => Helper.mockOk(/signup/, 'POST', {
  account: {
    name: faker.name.findName(),
    accessToken: faker.datatype.uuid()
  }
})
