import React, { useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import network from '../network/index'

export default function UpdateMoneyModal({open, setOpen}) {
const [cashToUpdate, setCashToUpdate] = useState(0)
  
const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateCash = useCallback(async() => {
     try {
        network.post('/stocks/update-cash', cashToUpdate)
     } catch(err){
       console.error(err)
     }
  }, [])



  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Update your cash</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please add cash for start your investing 
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="cash"
            type="number"
            fullWidth
            onChange={(e) => setCashToUpdate(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}