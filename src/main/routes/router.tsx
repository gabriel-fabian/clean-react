import { MakeLogin, MakeSignUp, MakeSurveyList, MakeSurveyResult } from '@/main/factories/pages'
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '@/main/adapters'
import { ApiContext } from '@/presentation/contexts'
import { PrivateRoute } from '@/presentation/components'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import React from 'react'

const Router: React.FC = () => {
  return (
    <RecoilRoot>
      <ApiContext.Provider
        value={{
          setCurrentAccount: setCurrentAccountAdapter,
          getCurrentAccount: getCurrentAccountAdapter
        }}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<MakeLogin />} />
            <Route path="/signup" element={<MakeSignUp />} />
            <Route path="/" element={<PrivateRoute outlet={<MakeSurveyList />}/>} />
            <Route path="/surveys/:id" element={<PrivateRoute outlet={<MakeSurveyResult />}/>} />
          </Routes>
        </BrowserRouter>
      </ApiContext.Provider>
    </RecoilRoot>
  )
}

export default Router
