/* eslint-disable react/prop-types */
import React from 'react'
import Styles from './input-styles.scss'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  state: any
  setState: any
}

const Input: React.FC<Props> = ({ state, setState, ...props }: Props) => {
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
