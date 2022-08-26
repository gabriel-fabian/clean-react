import {
  HttpClient,
  HttpRequest,
  HttpResponse,
  HttpStatusCode
} from '@/data/protocols/http'

import { faker } from '@faker-js/faker'

export const mockHttpRequest = (): HttpRequest => ({
  url: faker.internet.url(),
  method: faker.helpers.arrayElement(['get', 'post', 'put']),
  body: faker.datatype.json(),
  headers: faker.datatype.json()
})

export class HttpClientSpy<R = any> implements HttpClient<R> {
  url?: string
  method?: string
  body?: any
  headers?: any
  response: HttpResponse<R> = {
    statusCode: HttpStatusCode.ok
  }

  async request (data: HttpRequest): Promise<HttpResponse<R>> {
    this.url = data.url
    this.method = data.method
    this.body = data.body
    this.headers = data.headers
    return await Promise.resolve(this.response)
  }
}

export const mockGetRequest = (): HttpRequest => ({
  url: faker.internet.url(),
  method: 'get',
  headers: faker.datatype.json()
})
