
import { makeApiUrl } from '@/main/factories/http'
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators'
import { LoadSurveyList } from '@/domain/usecases/load-survey-list'
import { RemoteLoadSurveyList } from '@/data/usecases'

export const makeRemoteLoadSurveyList = (): LoadSurveyList => {
  return new RemoteLoadSurveyList(makeApiUrl('/surveys'), makeAuthorizeHttpClientDecorator())
}
