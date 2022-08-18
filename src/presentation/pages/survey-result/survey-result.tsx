import Styles from './survey-result-styles.scss'
import { Footer, Header, Loading } from '@/presentation/components'
import React from 'react'

const SurveyResult: React.FC = () => {
  return (
    <div className={Styles.surveyResultWrap}>
      <Header />
      <div className={Styles.contentWrap}>
        <h2>Qual é o seu framework web favorito</h2>
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
        {false && <Loading />}
      </div>
      <Footer />
    </div>
  )
}

export default SurveyResult
