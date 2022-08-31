import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { SurveyResult } from '@/presentation/pages'
import { ApiContext } from '@/presentation/contexts'
import { AccountModel } from '@/domain/models'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import {
  mockAccountModel,
  LoadSurveyResultSpy,
  mockSurveyResultModel,
  SaveSurveyResultSpy
} from '@/tests/domain/mocks'
import { createMemoryHistory, MemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import React from 'react'
import { act } from 'react-dom/test-utils'

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy
  saveSurveyResultSpy: SaveSurveyResultSpy
  history: MemoryHistory
  setCurrentAccountMock: (account: AccountModel) => void
}

type SutParams = {
  loadSurveyResultSpy?: LoadSurveyResultSpy
  saveSurveyResultSpy?: SaveSurveyResultSpy
}

const makeSut = ({ loadSurveyResultSpy = new LoadSurveyResultSpy(), saveSurveyResultSpy = new SaveSurveyResultSpy() }: SutParams = {}): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/', '/surveys/any_id'] })
  const setCurrentAccountMock = jest.fn()
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock, getCurrentAccount: () => mockAccountModel() }}>
      <Router location={history.location} navigator={history}>
        <SurveyResult
          loadSurveyResult={loadSurveyResultSpy}
          saveSurveyResult={saveSurveyResultSpy}
        />
      </Router>
    </ApiContext.Provider>
  )
  return {
    loadSurveyResultSpy,
    saveSurveyResultSpy,
    history,
    setCurrentAccountMock
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
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date('2022-01-10T00:00:00')
    })
    loadSurveyResultSpy.surveyResult = surveyResult
    makeSut({ loadSurveyResultSpy })
    await waitFor(() => { screen.getByTestId('back-button') })
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
        expect(images[1]).toBeFalsy()
        const percents = screen.queryAllByTestId('percent')
        expect(percents[0]).toHaveTextContent(`${surveyResult.answers[0].percent}%`)
        expect(percents[1]).toHaveTextContent(`${surveyResult.answers[1].percent}%`)
      })
  })

  test('Should render error on UnexpectedError', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(error)
    makeSut({ loadSurveyResultSpy })
    await waitFor(() => { screen.getByTestId('error') })
      .then(() => {
        expect(screen.queryByTestId('question')).not.toBeInTheDocument()
        expect(screen.getByTestId('error')).toHaveTextContent(error.message)
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      })
  })

  test('Should logout on AccessDeniedError', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(new AccessDeniedError())
    const { setCurrentAccountMock, history } = makeSut({ loadSurveyResultSpy })
    await waitFor(() => { screen.getByTestId('survey-result') })
      .then(() => {
        expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
        expect(history.location.pathname).toBe('/login')
      })
  })

  test('Should call LoadSurveyResult on retry', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(new UnexpectedError())
    makeSut({ loadSurveyResultSpy })
    await waitFor(() => { screen.getByTestId('error') })
      .then(() => {
        fireEvent.click(screen.getByTestId('reload'))
        expect(loadSurveyResultSpy.callsCount).toBe(1)
      })
  })

  test('Should goto SurveyList on back button click', async () => {
    const { history } = makeSut()
    await waitFor(() => { screen.getByTestId('back-button') })
      .then(() => {
        fireEvent.click(screen.getByTestId('back-button'))
        expect(history.location.pathname).toBe('/')
      })
  })

  test('Should not present on active answer click', async () => {
    makeSut()
    await waitFor(() => { screen.getByTestId('back-button') })
      .then(() => {
        const answersWrap = screen.queryAllByTestId('answer-wrap')
        fireEvent.click(answersWrap[0])
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      })
  })

  test('Should call SaveSurveyResult on non active answer click', async () => {
    const { saveSurveyResultSpy, loadSurveyResultSpy } = makeSut()
    await waitFor(() => { screen.getByTestId('back-button') })
      .then(() => {
        const answersWrap = screen.queryAllByTestId('answer-wrap')
        fireEvent.click(answersWrap[1])
        expect(screen.queryByTestId('loading')).toBeInTheDocument()
        expect(saveSurveyResultSpy.params).toEqual({
          answer: loadSurveyResultSpy.surveyResult.answers[1].answer
        })
      })
  })

  test('Should render error on UnexpectedError', async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    const error = new UnexpectedError()
    jest.spyOn(saveSurveyResultSpy, 'save').mockRejectedValueOnce(error)
    makeSut({ saveSurveyResultSpy })
    await waitFor(() => { screen.getByTestId('back-button') })
      .then(() => {
        const answersWrap = screen.queryAllByTestId('answer-wrap')
        fireEvent.click(answersWrap[1])
      })
    await waitFor(() => { screen.getByTestId('error') })
      .then(() => {
        expect(screen.queryByTestId('question')).not.toBeInTheDocument()
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
        expect(screen.getByTestId('error')).toHaveTextContent(error.message)
      })
  })

  test('Should logout on AccessDeniedError', async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    jest.spyOn(saveSurveyResultSpy, 'save').mockRejectedValueOnce(new AccessDeniedError())
    const { setCurrentAccountMock, history } = makeSut({ saveSurveyResultSpy })
    await waitFor(() => { screen.getByTestId('back-button') })
      .then(() => {
        const answersWrap = screen.queryAllByTestId('answer-wrap')
        fireEvent.click(answersWrap[1])
      })
    await waitFor(() => { screen.getByTestId('survey-result') })
      .then(() => {
        expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
        expect(history.location.pathname).toBe('/login')
      })
  })

  test('Should present SurveyResult data on SaveSurveyResult success', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date('2021-02-13T00:00:00')
    })
    loadSurveyResultSpy.surveyResult = surveyResult
    makeSut({ loadSurveyResultSpy })
    await waitFor(() => { screen.getByTestId('back-button') })
      .then(() => {
        const answersWrap = screen.queryAllByTestId('answer-wrap')
        act(() => {
          fireEvent.click(answersWrap[1])
        })
        expect(screen.queryByTestId('loading')).toBeInTheDocument()
        expect(screen.getByTestId('day')).toHaveTextContent('13')
        expect(screen.getByTestId('month').textContent).toBe('fev')
        expect(screen.getByTestId('year')).toHaveTextContent('2021')
        expect(screen.getByTestId('question')).toHaveTextContent(surveyResult.question)
        expect(screen.getByTestId('answers').childElementCount).toBe(2)
        expect(answersWrap[0]).toHaveClass('active')
        expect(answersWrap[1]).not.toHaveClass('active')
        const images = screen.queryAllByTestId('image')
        expect(images[0]).toHaveAttribute('src', surveyResult.answers[0].image)
        expect(images[0]).toHaveAttribute('alt', surveyResult.answers[0].answer)
        expect(images[1]).toBeFalsy()
        const percents = screen.queryAllByTestId('percent')
        expect(percents[0]).toHaveTextContent(`${surveyResult.answers[0].percent}%`)
        expect(percents[1]).toHaveTextContent(`${surveyResult.answers[1].percent}%`)
      })
    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument())
  })
})
