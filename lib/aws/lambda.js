import { v4 as uuidv4 } from 'uuid'
import createLogger from '@meltwater/mlabs-logger'

import { Lambda } from './sdk'

export class LambdaClient {
  constructor({
    arn,
    name = 'lambda',
    reqId = uuidv4(),
    log = createLogger(),
    params = {}
  }) {
    const defaultParams = { FunctionName: arn, ...params }
    this._lambda = new Lambda({ params: defaultParams })
    this._reqId = reqId
    this._log = log.child({
      defaultParams,
      client: name,
      class: 'LambdaClient',
      reqId
    })
  }

  async invokeJson(input, params = {}) {
    const log = this._log.child({
      meta: { input, params },
      method: 'invokeJson'
    })
    try {
      log.info('start')

      const req = {
        Payload: JSON.stringify(input),
        ...params
      }

      const res = await this._lambda.invoke(req).promise()

      checkStatusCode(res.StatusCode)

      const data = JSON.parse(res.Payload)
      log.debug('end')
      return data
    } catch (err) {
      log.error({ err }, 'fail')
      throw err
    }
  }
}

const checkStatusCode = (statusCode) => {
  const is200StatusCode = statusCode > 200 && statusCode < 299

  if (is200StatusCode) return

  const err = new Error(`Status code error: ${statusCode}`)
  err.statusCode = statusCode
  throw err
}