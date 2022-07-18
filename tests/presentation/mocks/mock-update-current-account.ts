import { AccountModel } from '@/domain/models'
import { UpdateCurrentAccount } from '@/domain/usecases'

export class UpdateCurrentAccountMock implements UpdateCurrentAccount {
  account: AccountModel

  async set (account: AccountModel): Promise<void> {
    this.account = account
  }
}
