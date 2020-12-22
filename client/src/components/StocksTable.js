import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
}));

const financial = (x) => {
  return Number.parseFloat(x).toFixed(2);
};

export default function StocksTable({ tableRows, onPressSell }) {
  const classes = useStyles();
  console.log("as", tableRows);
  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Stock</TableCell>
              <TableCell align="right">Symbol</TableCell>
              <TableCell align="right">Last rate</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">AVG b.price</TableCell>
              <TableCell align="right">
                Total value{" "}
                <img
                  height="15px"
                  width="15px"
                  src="https://img.icons8.com/material-outlined/24/000000/shekel.png"
                />
              </TableCell>
              <TableCell align="right">
                Profit{" "}
                <img
                  height="15px"
                  width="15px"
                  src="https://img.icons8.com/material-outlined/24/000000/shekel.png"
                />
              </TableCell>
              <TableCell align="right">Yield</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.length !== 0 &&
              tableRows.map((row) => (
                <TableRow key={row.title}>
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="right">{row.symbol}</TableCell>
                  <TableCell align="right">{row.lastRate}</TableCell>
                  <TableCell align="right">{row.currentAmount}</TableCell>

                  <TableCell align="right">{financial(row.avgPrice)}</TableCell>
                  <TableCell align="right">
                    {financial(row.currentPrice / 100)}
                  </TableCell>
                  <TableCell align="right">
                    {financial(row.profitInShekels)}
                  </TableCell>
                  <TableCell align="right">{financial(row.change)}%</TableCell>
                  {onPressSell && (
                    <button onClick={() => onPressSell(row)}>delete</button>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
