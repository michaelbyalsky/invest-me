import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    root: {
      display: "grid",
      gridAutoRows: "200px",
    },
    section: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
    },
    table: {},
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: "25ch",
    },
    table: {
      width: "400px",
    },
    header: {
        display: "grid",
        gridTemplateRows: "70px 70px",
        justifyContent: "center",    
    },
    headerTitle: {
       margin: "auto" 
    },
    topInvestors: {
      display: "grid",
      gridTemplateRows: "70px auto",
    }
  }));