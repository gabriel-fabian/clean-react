import React, { useContext } from 'react'
import { ApiContext } from '@/presentation/contexts'
import { Navigate } from 'react-router-dom'

type Props = {
  outlet: JSX.Element
}

const PrivateRoute: React.FC<Props> = ({ outlet }: Props) => {
  const { getCurrentAccount } = useContext(ApiContext)
  return getCurrentAccount()?.accessToken
    ? outlet
    : <Navigate to='/login' replace/>
}

export default PrivateRoute
