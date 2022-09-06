import { SurveyList } from '@/presentation/pages'
import { currentAccountState } from '@/presentation/components'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'
import { LoadSurveyListSpy, mockAccountModel } from '@/tests/domain/mocks'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import React from 'react'

type SutTypes = {
  loadSurveyListSpy: LoadSurveyListSpy
  history: MemoryHistory
  setCurrentAccountMock: (account: AccountModel) => void
}

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })
  const setCurrentAccountMock = jest.fn()
  const mockedState = { setCurrentAccount: setCurrentAccountMock, getCurrentAccount: () => mockAccountModel() }
  render(
    <RecoilRoot initializeState={({ set }) => set(currentAccountState, mockedState)}>
      <Router location={history.location} navigator={history}>
        <SurveyList loadSurveyList={loadSurveyListSpy}/>
      </Router>
    </RecoilRoot>
  )
  return {
    loadSurveyListSpy,
    history,
    setCurrentAccountMock
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

  test('Should render error on UnexpectedError', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(error)
    makeSut(loadSurveyListSpy)
    await waitFor(() =>
      expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument()
    )
    expect(screen.getByTestId('error').textContent).toEqual(error.message)
  })

  test('Should logout on AccessDeniedError', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy()
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(new AccessDeniedError())
    const { setCurrentAccountMock, history } = makeSut(loadSurveyListSpy)
    await waitFor(() =>
      expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    )
    expect(history.location.pathname).toBe('/login')
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
