import { RemoteLoadSurveyResult } from '@/data/usecases'
import { HttpGetClientSpy } from '@/tests/data/mocks'
import { faker } from '@faker-js/faker'

describe('RemoteLoadSurveyResult', () => {
  test('Should call HttpGetClient with correct URL', async () => {
    const url = faker.internet.url()
    const httpGetClientSpy = new HttpGetClientSpy()
    const sut = new RemoteLoadSurveyResult(url, httpGetClientSpy)
    await sut.load()
    expect(httpGetClientSpy.url).toBe(url)
  })
})
