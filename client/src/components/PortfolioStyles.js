import { makeStyles, useTheme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridTemplateRows: "100px 100px auto auto",
    justifyContent: "center",
  },
  moneyBar: {
    display: "flex",
    justifyContent: "center",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch",
  },
  table: {
    minWidth: 650,
  },
  tableWrapper: {
    display: "grid",
    gridAutoRows: "auto 100px",
    marginTop: "2px",
  },
  profitTable: {
    marginTop: "20px",
  },
  button: {
    display: "flex",
    justifyContent: "center",
  },
  stocksTable: {
    marginBottom: "2fr",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    margin: "auto",
    marginTop: "20px",
  },
}));
