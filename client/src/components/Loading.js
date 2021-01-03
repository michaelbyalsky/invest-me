import React from "react";
import ReactLoading from "react-loading";
import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  fullPage: {
    marginTop: "4rem",  
    display: "grid",
    justifyContent: "center",
  },
}));

export default function Loading({ type, color, height, width}) {
  const classes = useStyles();

  return (
    <div testId="reactLoading" className={classes.fullPage}>
      <ReactLoading type={type} color={color} height={height} width={width} />
    </div>
  );
}
