import Styles from './survey-result-styles.scss'
import { Calendar, Error, Footer, Header, Loading } from '@/presentation/components'
import { useErrorHandler } from '@/presentation/hooks'
import { LoadSurveyResult } from '@/domain/usecases'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

type Props = {
  loadSurveyResult: LoadSurveyResult
}

const SurveyResult: React.FC<Props> = ({ loadSurveyResult }: Props) => {
  const handleError = useErrorHandler((error: Error) => {
    setState(old => ({ ...old, surveyResult: null, error: error.message }))
  })
  const [state, setState] = useState({
    isLoading: false,
    error: '',
    surveyResult: null as LoadSurveyResult.Model,
    reload: false
  })
  const reload = (): void => { setState(old => ({ isLoading: false, surveyResult: null, error: '', reload: !old.reload })) }
  const navigate = useNavigate()

  useEffect(() => {
    loadSurveyResult.load()
      .then(surveyResult => setState(old => ({ ...old, surveyResult })))
      .catch(handleError)
  }, [state.reload])

  return (
    <div className={Styles.surveyResultWrap}>
      <Header />
      <div data-testid="survey-result" className={Styles.contentWrap}>
        {state.surveyResult &&
          <>
          <hgroup>
            <Calendar date={state.surveyResult.date} className={Styles.calendarWrap}/>
            <h2 data-testid="question">{state.surveyResult.question}</h2>
          </hgroup>
          <ul data-testid="answers">
            {state.surveyResult.answers.map(answer =>
              <li data-testid="answer-wrap" key={answer.answer} className={answer.isCurrentAccountAnswer ? Styles.active : ' '}>
                {answer.image && <img data-testid="image" src={answer.image} alt={answer.answer} />}
                <span data-testid="answer" className={Styles.answer}>{answer.answer}</span>
                <span data-testid="percent" className={Styles.percent}>{answer.percent}%</span>
              </li>
            )}
          </ul>
          <button data-testid="back-button" onClick={() => navigate(-1)}>Voltar</button>
          </>
        }
        {state.isLoading && <Loading />}
        {state.error && <Error error={state.error} reload={reload} />}
      </div>
      <Footer />
    </div>
  )
}

export default SurveyResult
