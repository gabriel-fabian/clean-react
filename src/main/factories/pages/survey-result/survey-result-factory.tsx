import { SurveyResult } from '@/presentation/pages'
import { makeRemoteLoadSurveyResult, makeRemoteSaveSurveyResult } from '@/main/factories/usecases'
import { useParams } from 'react-router-dom'
import React from 'react'

export const MakeSurveyResult: React.FC = () => {
  const { id } = useParams()
  return (
    <SurveyResult
      loadSurveyResult={makeRemoteLoadSurveyResult(id)}
      saveSurveyResult={makeRemoteSaveSurveyResult(id)}
    />
  )
}
