import React, { useState, useCallback, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import network from "../network/index";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridTemplateRows: "100px 400px",
    justifyContent: "center",
  },
  moneyBar: {
    display: "flex",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch",
  },
  table: {
    minWidth: 650,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function Portfolio() {
  const classes = useStyles();
  const [cash, setCash] = useState(0);
  const [investments, setInvestments] = useState(0);
  
  const fetchUserMoney = useCallback(async () => {
      try {
          const { data } = network.get('/users/money')
          const { cash: userCash, investments: userInvestments } = data
          setCash(userCash)
          setInvestments(userInvestments)
      } catch(err){
          console.error(err)
      }
  }, []);

  useEffect(() => {
      fetchUserMoney()
  }, [])


  return (
    <div className={classes.root}>
      <div className={classes.moneyBar}>
        <div>
          <TextField
            label="Dense"
            id="outlined-margin-dense"
            defaultValue={cash}
            className={classes.textField}
            helperText="Some important text"
            margin="dense"
            variant="outlined"
            type="number"
          />
        </div>
        <div>
          <TextField
            label="Dense"
            id="outlined-margin-dense"
            defaultValue={investments}
            className={classes.textField}
            helperText="Some important text"
            margin="dense"
            variant="outlined"
            type="number"
          />
        </div>
      </div>
      <div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Stock</TableCell>
                <TableCell align="right">Symbol</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell align="right">AVG b.price</TableCell>
                <TableCell align="right">Yield</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
