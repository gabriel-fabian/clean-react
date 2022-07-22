import React from 'react'
import Styles from './survey-item-styles.scss'
import { Icon } from '@/presentation/components'

const SurveyItem: React.FC = () => {
  return (
    <li className={Styles.surveyItemWrap}>
      <div className={Styles.surveyContent}>
        <Icon className={Styles.iconWrap} iconName={'thumbDown'}/>
        <time>
          <span className={Styles.day}>14</span>
          <span className={Styles.month}>07</span>
          <span className={Styles.year}>2022</span>
        </time>
        <p>Qual é o seu framework web favorito?</p>
      </div>
      <footer>Ver Resultado</footer>
    </li>
  )
}

export default SurveyItem
