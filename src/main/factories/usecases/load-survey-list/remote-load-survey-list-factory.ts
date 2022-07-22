
import { makeAxiosHttpClient, makeApiUrl } from '@/main/factories/http'
import { LoadSurveyList } from '@/domain/usecases/load-survey-list'
import { RemoteLoadSurveyList } from '@/data/usecases'

export const makeRemoteLoadSurveyList = (): LoadSurveyList => {
  return new RemoteLoadSurveyList(makeApiUrl('/surveys'), makeAxiosHttpClient())
}
