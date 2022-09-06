import { currentAccountState } from '@/presentation/components'
import { useRecoilValue } from 'recoil'
import { Navigate } from 'react-router-dom'
import React from 'react'

type Props = {
  outlet: JSX.Element
}

const PrivateRoute: React.FC<Props> = ({ outlet }: Props) => {
  const { getCurrentAccount } = useRecoilValue(currentAccountState)
  return getCurrentAccount()?.accessToken
    ? outlet
    : <Navigate to='/login' replace/>
}

export default PrivateRoute
