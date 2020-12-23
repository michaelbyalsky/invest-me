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

const StockByPeriod = ({ stock1, stock2 }) => {




  return (
    <div>
      <h1 className="header">Pastes by ner analysies</h1>

      <div className="chartWrapper">
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
