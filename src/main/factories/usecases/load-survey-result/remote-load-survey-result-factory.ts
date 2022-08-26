
import { makeApiUrl } from '@/main/factories/http'
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators'
import { RemoteLoadSurveyResult } from '@/data/usecases'
import { LoadSurveyResult } from '@/domain/usecases'

export const makeRemoteLoadSurveyResult = (id: string): LoadSurveyResult => {
  return new RemoteLoadSurveyResult(makeApiUrl(`/surveys/${id}/results`), makeAuthorizeHttpClientDecorator())
}
