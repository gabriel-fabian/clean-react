import { AccountModel } from '@/domain/models'
import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter'

import { faker } from '@faker-js/faker'
import 'jest-localstorage-mock'

const makeSut = (): LocalStorageAdapter => new LocalStorageAdapter()

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('Should call localStorage with correct values', () => {
    const sut = makeSut()
    const key = faker.database.column()
    const value: AccountModel = {
      accessToken: faker.datatype.uuid(),
      name: faker.name.findName()
    }
    sut.set(key, value)
    expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value))
  })
})
