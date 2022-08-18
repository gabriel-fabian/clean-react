/* eslint-disable react/prop-types */
import React, { useContext } from 'react'
import Styles from './input-styles.scss'
import { FormContext } from '@/presentation/contexts/'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(FormContext)
  const error = state[`${props.name}Error`]
  return (
    <div
      data-testid={`${props.name}-wrap`}
      className={Styles.inputWrap}
      data-status={error ? 'invalid' : 'valid'}
    >
      <input
        {...props}
        placeholder=" "
        title={error}
        data-testid={props.name}
        onChange={e => { setState(old => ({ ...old, [e.target.name]: e.target.value })) }}
      />
      <label
        data-testid={`${props.name}-label`}
        title={error}
      >
        {props.placeholder}
      </label>
    </div>
  )
}

export default Input
