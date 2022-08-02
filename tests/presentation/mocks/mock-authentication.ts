import { Authentication } from '@/domain/usecases'
import { mockAccountModel } from '@/tests/domain/mocks'

export class AuthenticationSpy implements Authentication {
  account = mockAccountModel()
  params: Authentication.Params
  callsCount = 0

  async auth (params: Authentication.Params): Promise<Authentication.Model> {
    this.params = params
    this.callsCount++
    return await Promise.resolve(this.account)
  }
}

export const mockAuthenticationModel = (): Authentication.Model => mockAccountModel()
