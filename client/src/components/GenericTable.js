import React, { useState, useCallback, useEffect } from "react";
import _ from "lodash";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const financial = (x) => {
  return Number.parseFloat(x).toFixed(2);
};

export default function GenericTable({ classes, rows, headers }) {
  
  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {headers &&
                headers.map((header, i) => (
                  <TableCell key={i} align="left">{header}</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length !== 0 &&
              rows.map((row) => (
                <TableRow key={row.title}>
                  <TableCell component="th" scope="row">
                    {row.username}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {financial(row.totalBuyingPrice)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {financial(row.totalCurrentPrice)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {financial(row.totalProfit)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {financial(row.change)}%
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
