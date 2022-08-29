import { RemoteSaveSurveyResult } from '@/data/usecases'
import { HttpStatusCode } from '@/data/protocols/http'
import { HttpClientSpy, mockRemoteSurveyResultModel } from '@/tests/data/mocks'
import { faker } from '@faker-js/faker'

type SutTypes = {
  sut: RemoteSaveSurveyResult
  httpGetClientSpy: HttpClientSpy
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpClientSpy()
  const sut = new RemoteSaveSurveyResult(url, httpGetClientSpy)
  return {
    sut,
    httpGetClientSpy
  }
}

describe('RemoteSaveSurveyResult', () => {
  test('Should call HttpGetClient with correct URL and method', async () => {
    const url = faker.internet.url()
    const { sut, httpGetClientSpy } = makeSut(url)
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: mockRemoteSurveyResultModel()
    }
    await sut.save({
      answer: faker.random.word()
    })
    expect(httpGetClientSpy.url).toBe(url)
    expect(httpGetClientSpy.method).toBe('put')
  })
})
