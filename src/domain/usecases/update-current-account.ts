import { AccountModel } from '@/domain/models'

export interface UpdateCurrentAccount {
  set: (account: AccountModel) => Promise<void>
}
