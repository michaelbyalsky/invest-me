import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import moment from "moment";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridAutoRows: "100px",
    justifyContent: "center",
  },
  title: {
    margin: "auto",
    justifyContent: "center",
  },
}));

const StockByPeriod = ({ stock1, stock2, stockMeta }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <h1 className={classes.title}>{stockMeta.title}</h1>

      <div>
        <BarChart width={1200} height={250} data={stock1}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="yield" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

export default StockByPeriod;
