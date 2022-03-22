import React from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'

import { useAuthState } from '../../../user/services/AuthService'
import { useFetchAdminLocations } from '../../common/hooks/Location.hooks'
import { GameserverService } from '../../services/GameserverService'
import { LocationService, useLocationState } from '../../services/LocationService'
import { useStyles } from '../../styles/ui'

interface Props {
  open: boolean
  handleClose: any
  closeViewModal?: any
}

const PatchGameserver = (props: Props) => {
  const { open, handleClose, closeViewModal } = props
  const classes = useStyles()
  const [state, setState] = React.useState({
    location: '',
    locationError: ''
  })

  const { t } = useTranslation()
  const authState = useAuthState()
  const user = authState.user
  const adminLocationState = useLocationState()
  const location = adminLocationState
  const adminLocations = adminLocationState.locations

  useFetchAdminLocations(user, adminLocationState, LocationService)

  React.useEffect(() => {
    if (location.created.value) {
      closeViewModal(false)
      setState({
        ...state,
        location: ''
      })
    }
  }, [location.created])

  const handleChange = (e) => {
    const { name, value } = e.target
    setState({ ...state, [name]: value, locationError: value.length < 2 ? 'Location is required!' : '' })
  }

  const handleSubmit = () => {
    let locationError = ''
    if (!state.location) {
      locationError = "Location can't be empty"
      setState({ ...state, locationError })
    } else {
      GameserverService.patchGameserver(state.location)
      closeViewModal(false)
    }
  }

  return (
    <React.Fragment>
      <Drawer anchor="right" classes={{ paper: classes.paperDrawer }} open={open} onClose={handleClose(false)}>
        <Container maxWidth="sm" className={classes.marginTp}>
          <DialogTitle id="form-dialog-title" className={classes.texAlign}>
            {t('admin:components.setting.patchGameserver')}
          </DialogTitle>
          <label>{t('admin:components.bot.location')}</label>
          <Paper component="div" className={state.locationError.length > 0 ? classes.redBorder : classes.createInput}>
            <FormControl fullWidth>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                value={state.location}
                fullWidth
                displayEmpty
                onChange={handleChange}
                className={classes.select}
                name="location"
                MenuProps={{ classes: { paper: classes.selectPaper } }}
              >
                <MenuItem value="" disabled>
                  <em>{t('admin:components.bot.selectLocation')}</em>
                </MenuItem>
                {adminLocations.value.map((el, i) => (
                  <MenuItem value={el.id} key={i}>
                    {el.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
          <DialogActions>
            <Button className={classes.saveBtn} onClick={handleSubmit}>
              {t('admin:components.setting.save')}
            </Button>
            <Button onClick={handleClose(false)} className={classes.saveBtn}>
              {t('admin:components.setting.cancel')}
            </Button>
          </DialogActions>
        </Container>
      </Drawer>
    </React.Fragment>
  )
}

export default PatchGameserver
