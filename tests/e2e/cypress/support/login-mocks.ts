import * as Http from './http-mocks'
import { faker } from '@faker-js/faker'

export const mockInvalidCredentialsError = (): void => Http.mockUnauthorizedError(/login/)
export const mockUnexpectedError = (): void => Http.mockServerError(/login/, 'POST')
export const mockOk = (): void => Http.mockOk(/login/, 'POST', {
  account: {
    name: faker.name.findName(),
    accessToken: faker.datatype.uuid()
  }
})
