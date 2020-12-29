import React, { useCallback, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import network from "../network/index";
import SmallLoading from "./SmallLoading";

export default function UpdateMoneyModal({ open, setOpen, getUserInfo }) {
  const [cashToUpdate, setCashToUpdate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const updateCash = useCallback(async () => {
    try {
      if (cashToUpdate < 1) {
        setError("amount error");
        setTimeout(() => {
          setError(null);
        }, 3000);
        return;
      }
      setLoading(true);
      await network.post("/users/update-cash", { cash: cashToUpdate });
      getUserInfo()
      setLoading(false);
      setOpen(false);
    } catch (err) {
      console.error(err);
      setError("system error");
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [cashToUpdate]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
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
            value={cashToUpdate}
            onChange={(e) => setCashToUpdate(e.target.value)}
          />
          {loading && <SmallLoading />}
          {error && <span style={{color: "red", margin: "auto"}}>{error}</span>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={updateCash} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
