import React from "react";
import ReactLoading from "react-loading";
import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "4rem",  
    display: "flex",
    justifyContent: "center",
  },
}));

export default function Loading({ type, color}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ReactLoading type={type} color={color} height={667} width={375} />
    </div>
  );
}
