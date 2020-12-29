import React, { useState, useEffect, useCallback } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import network from "../network/index";
import moment from "moment";
import { Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import Loading from "./Loading";
import AuthApi from "../contexts/Auth";
import CircularLoading from "./CircularLoading";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridAutoRows: "100px",
    justifyContent: "center",
  },
  dualBox: {
    display: "flex",
    justifyContent: "center",
  },
  button: {
    margin: "auto",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch",
  },
}));

export default function Profile() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const { userValue } = React.useContext(AuthApi);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [currentUser, setCurrentUser] = userValue;
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const { register: updateProfile, handleSubmit: submitProfile } = useForm({
    mode: "onBlur",
  });

  const getUserInfo = useCallback(async () => {
    try {
      const { data } = await network.get("/users/info");
      setCurrentUser(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("system error");
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, []);
  const onChangeProfile = useCallback(async (data) => {
    getUserInfo();
    try {
      setLoadingUpdate(true);
      await network.post("/users/info", data);
      getUserInfo();
      setLoadingUpdate(false);
      setSuccess("updated successfully");
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error(err);
      setError("system error");
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, []);
  useEffect(() => {
    getUserInfo();
  }, []);

  if (loading) {
    return <Loading type={"spin"} color={"blue"} height={333} width={185} />;
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
              defaultValue={currentUser.firstName}
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
              defaultValue={currentUser.lastName}
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
              defaultValue={currentUser.username}
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
              defaultValue={moment(currentUser.birthDate).format("YYYY-MM-DD")}
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
              defaultValue={currentUser.cash}
              className={classes.textField}
              margin="dense"
              variant="outlined"
              type="text"
            />
          </div>
        </div>
        <div className={classes.button}>
          <Button
            type="submit"
            className={classes.button}
            variant="contained"
            color="primary"
          >
            update
          </Button>
        </div>
        <div className={classes.button}>
          {loadingUpdate && <CircularLoading />}
          {success && <span style={{ color: "blue" }}>{success}</span>}
        </div>
      </form>
    </div>
  );
}
