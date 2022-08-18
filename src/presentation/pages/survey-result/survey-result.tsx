import Styles from './survey-result-styles.scss'
import { Calendar, Error, Footer, Header, Loading } from '@/presentation/components'
import { LoadSurveyResult } from '@/domain/usecases'
import React, { useState } from 'react'

const SurveyResult: React.FC = () => {
  const [state] = useState({
    isLoading: false,
    error: '',
    SurveyResult: null as LoadSurveyResult.Model
  })

  return (
    <div className={Styles.surveyResultWrap}>
      <Header />
      <div data-testid="survey-result" className={Styles.contentWrap}>
        {state.SurveyResult &&
          <>
          <hgroup>
            <Calendar date={new Date()} className={Styles.calendarWrap}/>
            <h2>Qual é o seu framework web favorito?</h2>
          </hgroup>
          <ul>
            <li>
              <img src="https://fordevs.herokuapp.com/static/img/logo-react.png" />
              <span className={Styles.answer}>ReactJS</span>
              <span className={Styles.percent}>50%</span>
            </li>
            <li className={Styles.active}>
              <img src="https://fordevs.herokuapp.com/static/img/logo-react.png" />
              <span className={Styles.answer}>ReactJS</span>
              <span className={Styles.percent}>50%</span>
            </li>
            <li>
              <img src="https://fordevs.herokuapp.com/static/img/logo-react.png" />
              <span className={Styles.answer}>ReactJS</span>
              <span className={Styles.percent}>50%</span>
            </li>
          </ul>
          <button>Voltar</button>
          {state.isLoading && <Loading />}
          {state.error && <Error error={state.error} reload={() => {}} />}
          </>
        }
      </div>
      <Footer />
    </div>
  )
}

export default SurveyResult
