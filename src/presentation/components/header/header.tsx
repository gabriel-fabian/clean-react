import Styles from './header-styles.scss'
import { Logo } from '@/presentation/components'
import { ApiContext } from '@/presentation/contexts'
import React, { memo, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

export const Header: React.FC = () => {
  const navigate = useNavigate()
  const { setCurrentAccount } = useContext(ApiContext)
  const logout = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    event.preventDefault()
    setCurrentAccount(undefined)
    navigate('/login', { replace: true })
  }

  return (
    <header className={Styles.headerWrap}>
    <div className={Styles.headerContent}>
      <Logo />
      <div className={Styles.logoutWrap}>
        <span>Fabian</span>
        <a data-testid="logout" href="#" onClick={logout}>Sair</a>
      </div>
    </div>
  </header>
  )
}

export default memo(Header)
