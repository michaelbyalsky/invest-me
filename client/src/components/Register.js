import React, { useState } from "react";
import {
  Typography,
  Paper,
  Avatar,
  Button,
  FormControl,
  Input,
  InputLabel,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Link, useHistory } from "react-router-dom";
import network from "../network/index";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import GenericDialog from "./GenericDialog";

const useStyles = makeStyles((theme) => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${
      theme.spacing.unit * 3
    }px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
}));

export default function Register(props) {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const history = useHistory();
  const [dialogOpen, setDialogOpen] = useState("");

  const onRegister = (data) => {
    network
      .post("/auth/register", data)
      .then((res) => {
        setDialogOpen(true)
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register Account
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(onRegister)}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="firstName">First name</InputLabel>
            <Input
              id="firstName"
              name="firstName"
              autoComplete="off"
              autoFocus
              error={errors.firstName ? true : false}
              value={firstName}
              inputRef={register({ required: true })}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.firstName && errors.firstName.type === "required" && (
              <span style={{ color: "red" }}>firstName is required</span>
            )}
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="lastName">Last name</InputLabel>
            <Input
              id="lastName"
              name="lastName"
              autoComplete="off"
              inputRef={register({ required: true })}
              autoFocus
              error={errors.lastName ? true : false}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && errors.lastName.type === "required" && (
              <span style={{ color: "red" }}>lastName is required</span>
            )}
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="name">username</InputLabel>
            <Input
              id="username"
              name="username"
              autoComplete="off"
              inputRef={register({ required: true })}
              autoFocus
              error={errors.username ? true : false}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && errors.username.type === "required" && (
              <span style={{ color: "red" }}>username is required</span>
            )}
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input
              id="email"
              name="email"
              inputRef={register({ required: true })}
              autoComplete="off"
              value={email}
              error={errors.email ? true : false}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && errors.email.type === "required" && (
              <span style={{ color: "red" }}>email is required</span>
            )}
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              name="password"
              type="password"
              id="password"
              autoComplete="off"
              inputRef={register({ required: true, minLength: 6 })}
              error={errors.password ? true : false}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && errors.password.type === "minLength" && (
              <span style={{ color: "red" }}>
                password must be at least 6 characters length
              </span>
            )}
            {errors.password && errors.password.type === "required" && (
              <span style={{ color: "red" }}>password is required</span>
            )}
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel shrink htmlFor="birthDate">
              Birth Date
            </InputLabel>
            <Input
              error={errors.birthDate ? true : false}
              inputRef={register({ required: true })}
              name="birthDate"
              type="date"
              id="birthDate"
              autoComplete="off"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={onRegister}
            className={classes.submit}
          >
            Register
          </Button>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            component={Link}
            to="/login"
            className={classes.submit}
          >
            Go back to Login
          </Button>
        </form>
      </Paper>
      {dialogOpen && (
        <GenericDialog open={dialogOpen} setOpen={setDialogOpen} />
      )}
    </main>
  );
}
