import { Hook, HookContext } from '@feathersjs/feathers'

import { Application } from '../../declarations'
import { getFreeGameserver } from '../networking/instance-provision/instance-provision.class'

export default (): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const { app, result } = context
    const matchInstanceId = result?.id
    const connection = result?.connection
    const gameMode = result?.gamemode

    if (!connection) {
      // assignment is not found yet
      return context
    }
    if (!gameMode) {
      // throw error?!
      throw new Error('Unexpected response from match finder. ' + JSON.stringify(result))
    }

    const locationName = 'game-' + gameMode
    const location = await app.service('location').find({
      query: {
        name: locationName
      }
    })
    if (!location.data.length) {
      // throw error?!
      throw new Error(`Location for match type '${gameMode}'(${locationName}) is not found.`)
    }

    const freeInstance = await getFreeGameserver(app as Application, 0, location.data[0].id, null!)
    try {
      const existingInstance = await app.service('instance').find({
        query: {
          ipAddress: `${freeInstance.ipAddress}:${freeInstance.port}`,
          locationId: location.data[0].id,
          ended: false
        }
      })

      let instanceId
      if (existingInstance.total === 0) {
        const newInstance = {
          ipAddress: `${freeInstance.ipAddress}:${freeInstance.port}`,
          currentUsers: 0,
          locationId: location.data[0].id,
          assigned: true,
          assignedAt: new Date()
        }
        const newInstanceResult = await app.service('instance').create(newInstance)
        instanceId = newInstanceResult.id
      } else {
        instanceId = existingInstance.data[0].id
      }

      // matchInstanceId
      await app.service('match-instance').patch(matchInstanceId, {
        gameserver: instanceId
      })

      context.result.gameserver = instanceId
    } catch (e) {
      console.log('matchmaking instance create error', e)
      // TODO: check error? skip?
      console.log('instance creation failed:', e.errors[0].message)
    }

    return context
  }
}
