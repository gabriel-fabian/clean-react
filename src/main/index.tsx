import React from 'react'
import ReactDOM from 'react-dom'
import '@/presentation/styles/global.scss'
import Router from '@/presentation/components/router/router'
import { makeLogin } from '@/main/factories/pages/login/login-factory'
import { makeSignUp } from './factories/pages/signup/signup-factory'

ReactDOM.render(
  <Router
    MakeLogin={makeLogin}
    MakeSignUp={makeSignUp}
  />,
  document.getElementById('main')
)
