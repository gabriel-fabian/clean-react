import { makeLocalStorageAdapter } from '@/main/factories/cache'
import { LocalUpdateCurrentAccount } from '@/data/usecases/'
import { UpdateCurrentAccount } from '@/domain/usecases'

export const makeLocalUpdateCurrentAccount = (): UpdateCurrentAccount => {
  return new LocalUpdateCurrentAccount(makeLocalStorageAdapter())
}
