import { SurveyList } from '@/presentation/pages'
import { ApiContext } from '@/presentation/contexts'
import { UnexpectedError } from '@/domain/errors'
import { LoadSurveyListSpy, mockAccountModel } from '@/tests/domain/mocks'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import React from 'react'

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy
}

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()): SutTypes => {
  const history = createMemoryHistory()
  render(
    <ApiContext.Provider value={{ setCurrentAccount: jest.fn(), getCurrentAccount: () => mockAccountModel() }}>
      <Router location={history.location} navigator={history}>
        <SurveyList loadSurveyList={loadSurveyListSpy}/>
      </Router>
    </ApiContext.Provider>
  )
  return {
    loadSurveyListSpy
  }
}

describe('SurveyList Component', () => {
  test('Should present 4 empty items on start', async () => {
    makeSut()
    const surveyList = screen.getByTestId('survey-list')
    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    await waitFor(() => surveyList)
  })

  test('Should call LoadSurveyList', async () => {
    const { loadSurveyListSpy } = makeSut()
    expect(loadSurveyListSpy.callsCount).toBe(1)
    await waitFor(() => screen.getByRole('heading'))
  })

  test('Should render SurveyItems on success', async () => {
    makeSut()
    const surveyList = screen.getByTestId('survey-list')
    await waitFor(() =>
      expect(surveyList.querySelectorAll('li.surveyItemWrap')).toHaveLength(3)
    )
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
  })

  test('Should render error on failure', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(error)
    makeSut(loadSurveyListSpy)
    await waitFor(() =>
      expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument()
    )
    expect(screen.getByTestId('error').textContent).toEqual(error.message)
  })

  test('Should call LoadSurveyList on retry', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(new UnexpectedError())
    makeSut(loadSurveyListSpy)
    await waitFor(() =>
      expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument()
    )
    fireEvent.click(screen.getByTestId('reload'))
    expect(loadSurveyListSpy.callsCount).toBe(1)
  })
})
