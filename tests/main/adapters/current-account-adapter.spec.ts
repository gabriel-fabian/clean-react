import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter'
import { setCurrentAccountAdapter } from '@/main/adapters/current-account-adapter'
import { mockAccountModel } from '@/tests/domain/mocks'

jest.mock('@/infra/cache/local-storage-adapter')

describe('CurrentAccountAdapter', () => {
  test('Should call localStorageAdapter with correct values', () => {
    const account = mockAccountModel()
    const setSpy = jest.spyOn(LocalStorageAdapter.prototype, 'set')
    setCurrentAccountAdapter(account)
    expect(setSpy).toHaveBeenCalledWith('account', account)
  })
})
