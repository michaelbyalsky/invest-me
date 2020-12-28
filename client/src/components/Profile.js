import React, { useState, useEffect, useCallback } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import network from "../network/index";
import moment from "moment";
import { Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import Loading from './Loading'

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridAutoRows: "100px",
    justifyContent: "center",
  },
  dualBox: {
    display: "flex",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch",
  },
}));

export default function Profile() {
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true)

  const { register: updateProfile, handleSubmit: submitProfile } = useForm({
    mode: "onBlur",
  });

  const getUserInfo = useCallback(async () => {
    try {
      const { data } = await network.get("/users/info");
      setUserInfo(data);
      setLoading(false)
    } catch (err) {
      console.error(err);
    }
  }, []);
  const onChangeProfile = useCallback(async (data) => {
    getUserInfo();
    try {
      await network.post("/users/info", data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getUserInfo();
  }, []);

  if (loading){
    return <Loading type={"spin"} color={"blue"} height={333} width={185}  />
  }

  return (
    <div className={classes.root}>
      <form
        className={classes.root}
        onSubmit={submitProfile(onChangeProfile)}
        noValidate
        autoComplete="off"
      >
        <div className={classes.dualBox}>
          <div>
            <TextField
              helperText="First Name"
              name="firstName"
              inputRef={updateProfile()}
              id="outlined-margin-dense"
              defaultValue={userInfo.firstName}
              className={classes.textField}
              margin="dense"
              variant="outlined"
              type="text"
            />
          </div>
          <div>
            <TextField
              helperText="Last Name"
              name="lastName"
              inputRef={updateProfile()}
              id="outlined-margin-dense"
              defaultValue={userInfo.lastName}
              className={classes.textField}
              margin="dense"
              variant="outlined"
              type="text"
            />
          </div>
        </div>
        <div className={classes.dualBox}>
          <div>
            <TextField
              helperText="username"
              name="username"
              inputRef={updateProfile()}
              id="outlined-margin-dense"
              defaultValue={userInfo.username}
              className={classes.textField}
              margin="dense"
              variant="outlined"
              type="text"
            />
          </div>
          <div>
            <TextField
              helperText="Birth Date"
              name="birthDate"
              inputRef={updateProfile()}
              id="outlined-margin-dense"
              defaultValue={moment(userInfo.birthDate).format("YYYY-MM-DD")}
              className={classes.textField}
              margin="dense"
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </div>
        </div>
        <div className={classes.dualBox}>
          <div>
            <TextField
              helperText="Cash"
              name="cash"
              inputRef={updateProfile()}
              defaultValue={userInfo["UserMoney.cash"]}
              className={classes.textField}
              margin="dense"
              variant="outlined"
              type="text"
            />
          </div>
        </div>
        <div>
          <Button
            type="submit"
            className={classes.button}
            variant="contained"
            color="primary"
          >
            update
          </Button>
        </div>
      </form>
    </div>
  );
}
