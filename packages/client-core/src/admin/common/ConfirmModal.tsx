import classNames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Fade from '@mui/material/Fade'
import Modal from '@mui/material/Modal'

import { useStyles } from '../styles/ui'

interface Props {
  popConfirmOpen: boolean
  handleCloseModal: () => void
  submit: () => void
  name: string | JSX.Element
  label: string
  type?: string
  processing?: boolean
}

const ConfirmModal = (props: Props) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const { popConfirmOpen, handleCloseModal, submit, name, label, type, processing } = props
  return (
    <Modal
      open={popConfirmOpen}
      onClose={handleCloseModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={classes.modal}
      closeAfterTransition
    >
      <Fade in={popConfirmOpen}>
        <div
          className={classNames({
            [classes.paper]: true,
            [classes.modalContent]: true
          })}
        >
          {!processing && (
            <div>
              <DialogTitle id="alert-dialog-title" style={{ color: 'gray' }}>
                {t('admin:components.common.doYouWantTo')} {type || 'delete'} {label} <b>{name}</b> ?
              </DialogTitle>
              <DialogActions>
                <Button onClick={handleCloseModal} className={classes.spanNone}>
                  {t('admin:components.common.cancel')}
                </Button>
                <Button className={classes.spanDange} onClick={submit} autoFocus>
                  {t('admin:components.common.confirm')}
                </Button>
              </DialogActions>
            </div>
          )}
          {processing && (
            <div>
              <CircularProgress color="primary" />
              <div className={classes.accentText}>{t('admin:components.project.processing')}</div>
            </div>
          )}
        </div>
      </Fade>
    </Modal>
  )
}

export default ConfirmModal
