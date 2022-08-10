/* eslint-disable react/prop-types */
import React, { useContext } from 'react'
import Styles from './input-styles.scss'
import { FormContext } from '@/presentation/contexts/'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(FormContext)
  const error = state[`${props.name}Error`]
  return (
    <div className={Styles.inputWrap}>
      <input
        {...props}
        placeholder=" "
        data-testid={props.name}
        onChange={e => { setState({ ...state, [e.target.name]: e.target.value }) }}
      />
      <label>
        {props.placeholder}
      </label>
      <span
        data-testid={`${props.name}-status`}
        title={error || 'Tudo certo!'}
        className={Styles.status}
      >
        {error ? '🔴' : '🟢'}
      </span>
    </div>
  )
}

export default Input
