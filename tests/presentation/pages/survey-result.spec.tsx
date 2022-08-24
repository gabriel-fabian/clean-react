import { render, screen, waitFor } from '@testing-library/react'
import { SurveyResult } from '@/presentation/pages'
import { ApiContext } from '@/presentation/contexts'
import { createMemoryHistory } from 'history'
import { mockAccountModel, LoadSurveyResultSpy, mockSurveyResultModel } from '@/tests/domain/mocks'
import { Router } from 'react-router-dom'
import React from 'react'

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy
}

const makeSut = (surveyResult = mockSurveyResultModel()): SutTypes => {
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  loadSurveyResultSpy.surveyResult = surveyResult
  const history = createMemoryHistory({ initialEntries: ['/surveys'] })
  render(
    <ApiContext.Provider value={{ setCurrentAccount: jest.fn(), getCurrentAccount: () => mockAccountModel() }}>
      <Router location={history.location} navigator={history}>
        <SurveyResult loadSurveyResult={loadSurveyResultSpy} />
      </Router>
    </ApiContext.Provider>
  )
  return {
    loadSurveyResultSpy
  }
}

describe('SurveyResult Component', () => {
  test('Should present correct initial state', async () => {
    makeSut()
    const surveyResult = screen.getByTestId('survey-result')
    expect(surveyResult.childElementCount).toBe(0)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    await waitFor(() => surveyResult)
  })

  test('Should call LoadSurveyResult', async () => {
    const { loadSurveyResultSpy } = makeSut()
    await waitFor(() => screen.getByTestId('survey-result'))
    expect(loadSurveyResultSpy.callsCount).toBe(1)
  })

  test('Should present SurveyResult data on success', async () => {
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date('2022-01-10T00:00:00')
    })
    makeSut(surveyResult)
    await waitFor(() => { screen.getByText(surveyResult.question) })
      .then(() => {
        expect(screen.getByTestId('day')).toHaveTextContent('10')
        expect(screen.getByTestId('month').textContent).toBe('jan')
        expect(screen.getByTestId('year')).toHaveTextContent('2022')
        expect(screen.getByTestId('question')).toHaveTextContent(surveyResult.question)
        expect(screen.getByTestId('answers').childElementCount).toBe(2)
        const answersWrap = screen.queryAllByTestId('answer-wrap')
        expect(answersWrap[0]).toHaveClass('active')
        expect(answersWrap[1]).not.toHaveClass('active')
        const images = screen.queryAllByTestId('image')
        expect(images[0]).toHaveAttribute('src', surveyResult.answers[0].image)
        expect(images[0]).toHaveAttribute('alt', surveyResult.answers[0].answer)
        expect(images[1]).not.toHaveAttribute('src')
        const percents = screen.queryAllByTestId('percent')
        expect(percents[0]).toHaveTextContent(`${surveyResult.answers[0].percent}%`)
        expect(percents[1]).toHaveTextContent(`${surveyResult.answers[1].percent}%`)
      })
  })
})
