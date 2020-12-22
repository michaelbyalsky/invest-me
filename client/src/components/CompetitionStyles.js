import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridAutoRows: "auto",
  },
  tableWrapper: {
    display: "grid",
    justifyContent: "center",
    marginTop: "2rem",
  },
  username: {
    margin: "auto",
  },
  moneyBar: {
    display: "flex",
    justifyContent: "space-around",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch",
  },
  table: {
    minWidth: 650,
    marginTop: "1rem",
  },
}));

export default useStyles;
