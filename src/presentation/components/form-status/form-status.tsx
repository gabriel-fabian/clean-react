import Styles from './form-status-styles.scss'
import { Spinner } from '@/presentation/components'
import React from 'react'

type Props = {
  state: any
}

const FormStatus: React.FC<Props> = ({ state }: Props) => {
  return (
    <div data-testid="error-wrap" className={Styles.errorWrap}>
      { state.isLoading && <Spinner className={Styles.spinner}/> }
      { state.errorMessage && <span data-testid="error-message" className={Styles.error}>{state.errorMessage}</span> }
    </div>
  )
}

export default FormStatus
