import { getContentType } from '@xrengine/common/src/utils/getContentType'
import { AudioComponent } from '@xrengine/engine/src/audio/components/AudioComponent'
import { EntityTreeNode } from '@xrengine/engine/src/ecs/classes/EntityTree'
import { createEntity } from '@xrengine/engine/src/ecs/functions/EntityFunctions'
import { createEntityNode } from '@xrengine/engine/src/ecs/functions/EntityTreeFunctions'
import { ImageComponent } from '@xrengine/engine/src/scene/components/ImageComponent'
import { LinkComponent } from '@xrengine/engine/src/scene/components/LinkComponent'
import { ModelComponent } from '@xrengine/engine/src/scene/components/ModelComponent'
import { VideoComponent } from '@xrengine/engine/src/scene/components/VideoComponent'
import { ScenePrefabs, ScenePrefabTypes } from '@xrengine/engine/src/scene/functions/registerPrefabs'

import { executeCommandWithHistory, setPropertyOnEntityNode } from '../classes/History'
import EditorCommands from '../constants/EditorCommands'

/**
 * Adds media node from passed url. Type of the media will be detected automatically
 * @param url URL of the passed media
 * @param parent Parent node will be set as parent to newly created node
 * @param before Newly created node will be set before this node in parent's children array
 * @returns Newly created media node
 */
export async function addMediaNode(
  url: string,
  parent?: EntityTreeNode,
  before?: EntityTreeNode
): Promise<EntityTreeNode> {
  let contentType = (await getContentType(url)) || ''
  const { hostname } = new URL(url)

  let node = createEntityNode(createEntity())
  let prefabType = '' as ScenePrefabTypes
  let updateFunc = null! as Function

  if (contentType.startsWith('model/gltf')) {
    prefabType = ScenePrefabs.model
    updateFunc = () =>
      setPropertyOnEntityNode(
        node,
        {
          component: ModelComponent,
          properties: { src: url }
        },
        false
      )
  } else if (contentType.startsWith('video/') || hostname === 'www.twitch.tv') {
    prefabType = ScenePrefabs.video
    updateFunc = () =>
      setPropertyOnEntityNode(
        node,
        {
          component: VideoComponent,
          properties: { videoSource: url }
        },
        false
      )
  } else if (contentType.startsWith('image/')) {
    prefabType = ScenePrefabs.image
    updateFunc = () =>
      setPropertyOnEntityNode(
        node,
        {
          component: ImageComponent,
          properties: { imageSource: url }
        },
        false
      )
  } else if (contentType.startsWith('audio/')) {
    prefabType = ScenePrefabs.audio
    updateFunc = () =>
      setPropertyOnEntityNode(
        node,
        {
          component: AudioComponent,
          properties: { audioSource: url }
        },
        false
      )
  } else if (url.includes('.uvol')) {
    prefabType = ScenePrefabs.volumetric
    updateFunc = () =>
      setPropertyOnEntityNode(
        node,
        {
          component: AudioComponent,
          properties: { audioSource: url }
        },
        false
      )
  } else {
    prefabType = ScenePrefabs.link
    updateFunc = () =>
      setPropertyOnEntityNode(
        node,
        {
          component: LinkComponent,
          properties: { href: url }
        },
        false
      )
  }

  if (prefabType) {
    executeCommandWithHistory(EditorCommands.ADD_OBJECTS, node, {
      prefabTypes: prefabType,
      parents: parent,
      befores: before
    })

    updateFunc()
  }

  return node
}
