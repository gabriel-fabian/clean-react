import { SetStorage } from '@/data/protocols/cache/set-storage'

export class SetStorageMock implements SetStorage {
  key: string
  value: string

  set (key: string, value: any): void {
    this.key = key
    this.value = value
  }
}
