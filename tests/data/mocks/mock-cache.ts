import { GetStorage } from '@/data/protocols/cache'
import { faker } from '@faker-js/faker'

export class GetStorageSpy implements GetStorage {
  key: string
  value = faker.datatype.json()

  get (key: string): any {
    this.key = key
    return this.value
  }
}
