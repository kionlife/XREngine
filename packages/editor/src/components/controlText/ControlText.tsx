import React from 'react'
import { useTranslation } from 'react-i18next'

import { TransformMode } from '@xrengine/engine/src/scene/constants/transformConstants'

import { useModeState } from '../../services/ModeServices'
import { useSelectionState } from '../../services/SelectionServices'
import styles from './styles.module.scss'

/**
 * ControlText used to render viewport.
 *
 * @author Robert Long
 * @constructor
 */
export function ControlText() {
  const modeState = useModeState()
  const { t } = useTranslation()

  const objectSelected = useSelectionState().selectedEntities.length > 0

  let controlsText

  if (modeState.isFlyModeEnabled.value) {
    controlsText =
      '[W][A][S][D] ' + t('editor:viewport.command.movecamera') + ' | [Shift] ' + t('editor:viewport.command.flyFast')
  } else {
    controlsText =
      '[LMB] ' +
      t('editor:viewport.command.orbit') +
      ' | [MMB] ' +
      t('editor:viewport.command.pan') +
      ' | [RMB] ' +
      t('editor:viewport.command.fly')
  }

  if (objectSelected) {
    controlsText +=
      ' | [F] ' +
      t('editor:viewport.command.focus') +
      ' | [Q] ' +
      t('editor:viewport.command.rotateLeft') +
      ' | [E] ' +
      t('editor:viewport.command.rotateRight')
  }

  if (modeState.transformMode.value === TransformMode.Placement) {
    controlsText += ' | [ESC / G] ' + t('editor:viewport.command.cancelPlacement')
  } else if (modeState.transformMode.value === TransformMode.Grab) {
    controlsText +=
      ' | [Shift + Click] ' +
      t('editor:viewport.command.placeDuplicate') +
      ' | [ESC / G] ' +
      t('editor:viewport.command.cancelGrab')
  } else if (objectSelected) {
    controlsText +=
      '| [G] ' + t('editor:viewport.command.grab') + ' | [ESC] ' + t('editor:viewport.command.deselectAll')
  }

  return <div className={styles.controlsText}>{controlsText}</div>
}
