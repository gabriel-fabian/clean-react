import { AxiosHttpClient } from '@/infra/http'
import { mockAxios, mockHttpResponse } from '@/tests/infra/mocks'
import { mockHttpRequest } from '@/tests/data/mocks'

import axios from 'axios'

jest.mock('axios')

type SutTypes = {
  sut: AxiosHttpClient
  mockedAxios: jest.Mocked<typeof axios>
}

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient()
  const mockedAxios = mockAxios()
  return {
    sut,
    mockedAxios
  }
}

describe('AxiosHttpClient', () => {
  test('Call axios with correct values', async () => {
    const request = mockHttpRequest()
    const { sut, mockedAxios } = makeSut()
    await sut.request(request)
    expect(mockedAxios.request).toHaveBeenCalledWith({
      url: request.url,
      data: request.body,
      headers: request.headers,
      method: request.method
    })
  })

  test('Return correct response on axios', async () => {
    const { sut, mockedAxios } = makeSut()
    const HttpResponse = await sut.request(mockHttpRequest())
    const axiosResponse = await mockedAxios.request.mock.results[0].value
    expect(HttpResponse).toEqual({
      statusCode: axiosResponse.status,
      body: axiosResponse.data
    })
  })

  test('Return correct error on axios', () => {
    const { sut, mockedAxios } = makeSut()
    mockedAxios.request.mockRejectedValueOnce({
      response: mockHttpResponse()
    })
    const promise = sut.request(mockHttpRequest())
    expect(promise).toEqual(mockedAxios.request.mock.results[0].value)
  })
})
