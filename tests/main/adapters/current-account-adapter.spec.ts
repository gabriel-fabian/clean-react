import { UnexpectedError } from '@/domain/errors'
import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter'
import { setCurrentAccountAdapter, getCurrentAccountAdapter } from '@/main/adapters'
import { mockAccountModel } from '@/tests/domain/mocks'

jest.mock('@/infra/cache/local-storage-adapter')

describe('CurrentAccountAdapter', () => {
  test('Should call localStorageAdapter.set with correct values', () => {
    const account = mockAccountModel()
    const setSpy = jest.spyOn(LocalStorageAdapter.prototype, 'set')
    setCurrentAccountAdapter(account)
    expect(setSpy).toHaveBeenCalledWith('account', account)
  })

  test('Should thow UnexpectedError', () => {
    expect(() => {
      setCurrentAccountAdapter(undefined)
    }).toThrow(new UnexpectedError())
  })

  test('Should call localStorageAdapter.get with correct values', () => {
    const account = mockAccountModel()
    const getSpy = jest.spyOn(LocalStorageAdapter.prototype, 'get').mockReturnValueOnce(account)
    const currentAccount = getCurrentAccountAdapter()
    expect(getSpy).toHaveBeenCalledWith('account')
    expect(currentAccount).toEqual(account)
  })
})
