import Styles from './result-styles.scss'
import { Calendar } from '@/presentation/components'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import { LoadSurveyResult } from '@/domain/usecases'

type Props = {
  surveyResult: LoadSurveyResult.Model
}

const Result: React.FC<Props> = ({ surveyResult }: Props) => {
  const navigate = useNavigate()
  return (
    <>
      <hgroup>
        <Calendar date={surveyResult.date} className={Styles.calendarWrap}/>
        <h2 data-testid="question">{surveyResult.question}</h2>
      </hgroup>
      <ul data-testid="answers" className={Styles.answerList}>
        {surveyResult.answers.map(answer =>
          <li data-testid="answer-wrap" key={answer.answer} className={answer.isCurrentAccountAnswer ? Styles.active : ' '}>
            {answer.image && <img data-testid="image" src={answer.image} alt={answer.answer} />}
            <span data-testid="answer" className={Styles.answer}>{answer.answer}</span>
            <span data-testid="percent" className={Styles.percent}>{answer.percent}%</span>
          </li>
        )}
      </ul>
      <button data-testid="back-button" className={Styles.button} onClick={() => navigate(-1)}>Voltar</button>
    </>
  )
}

export default Result
