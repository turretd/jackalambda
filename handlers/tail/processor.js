import { createJsonHandler } from '../../lib'

import { createFactories } from '../factories'

const createProcessor = (factories, { log }) => async (event, context) => {
  log.info('handled')
  return event
}

export const handleInvoke = createJsonHandler([], createFactories, createProcessor)
