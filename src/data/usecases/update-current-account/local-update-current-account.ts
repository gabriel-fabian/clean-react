import { SetStorage } from '@/data/protocols/cache/set-storage'
import { AccountModel } from '@/domain/models'
import { UpdateCurrentAccount } from '@/domain/usecases/update-current-account'

export class LocalUpdateCurrentAccount implements UpdateCurrentAccount {
  constructor (
    private readonly setStorage: SetStorage
  ) {}

  async set (account: AccountModel): Promise<void> {
    await this.setStorage.set('account', JSON.stringify(account))
  }
}
