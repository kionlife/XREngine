import { BadRequest } from '@feathersjs/errors'
import { HookContext } from '@feathersjs/feathers'
import _ from 'lodash'

import { extractLoggedInUserFromParams } from '../user/auth-management/auth-management.utils'

// This will attach the owner ID in the contact while creating/updating list item
export default () => {
  return async (context: HookContext): Promise<HookContext> => {
    const { params, app } = context
    const loggedInUser = extractLoggedInUserFromParams(params)
    const partyId = params.query!.partyId
    const userId = params.query!.userId || loggedInUser.id
    const paramsClone = _.cloneDeep(context.params)
    paramsClone.provider = null!
    if (params.partyUsersRemoved !== true) {
      const partyUserResult = await app.service('party-user').find({
        query: {
          partyId: partyId,
          userId: userId
        }
      })
      if (partyUserResult.total === 0) {
        console.log('INVALID PARTY ID')
        throw new BadRequest('Invalid party ID in party-user-permission')
      }
    }
    return context
  }
}
