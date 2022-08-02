import { ApiContext } from '@/presentation/contexts'
import { AccessDeniedError } from '@/domain/errors'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

type CallBackType = (error: Error) => void
type ResultType = CallBackType

export const useErrorHandler = (callback: CallBackType): ResultType => {
  const navigate = useNavigate()
  const { setCurrentAccount } = useContext(ApiContext)
  return (error: Error): void => {
    if (error instanceof AccessDeniedError) {
      setCurrentAccount(undefined)
      navigate('/login', { replace: true })
    } else {
      callback(error)
    }
  }
}
