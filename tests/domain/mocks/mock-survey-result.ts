import { LoadSurveyResult } from '@/domain/usecases'

import { faker } from '@faker-js/faker'

export const mockSurveyResultModel = (): LoadSurveyResult.Model => ({
  question: faker.random.words(),
  date: faker.date.recent(),
  answers: [{
    image: faker.internet.url(),
    answer: faker.random.word(),
    count: faker.datatype.number(100),
    percent: faker.datatype.number(100),
    isCurrentAccountAnswer: true
  }, {
    answer: faker.random.word(),
    count: faker.datatype.number(100),
    percent: faker.datatype.number(100),
    isCurrentAccountAnswer: false
  }]
})

export class LoadSurveyResultSpy implements LoadSurveyResult {
  callsCount = 0
  surveyResult = mockSurveyResultModel()

  async load (): Promise<LoadSurveyResult.Model> {
    this.callsCount++
    return this.surveyResult
  }
}
