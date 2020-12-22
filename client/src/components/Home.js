import React, { useState, useCallback, useEffect } from "react";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import Select from "react-select";
import network from "../network/index";
import { startCase } from "lodash";
import GenericTable from './GenericTable' 
import TopStocksTable from './TopStocksTable'

const useStyles = makeStyles((theme) => ({
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
}));

const stockHeaders = ["Stock", "Last Rate", "Yield"] 
const usersHeaders = ["username", "BuyingPrice", "Current value", "Total profit", "Yield"] 

export default function Home() {
  const [options, setOptions] = useState([]);
  const [selectValues, setSelectValues] = useState("lastThirtyDays");
  const [stockRows, setStocksRows] = useState([]);
  const [usersRows, setUsersRows] = useState([]);

  const classes = useStyles();

  const handleSelectChange = useCallback((e) => {
    setSelectValues(e.value);
  }, []);

  const fetchOptions = useCallback(async () => {
    try {
      const { data } = await network.get("/stocks/periods");
      console.log(data);
      data.forEach(
        (period) => (period.label = startCase(period.label))
      );

      setOptions(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchAllUsersProfit = useCallback(async () => {
    try {
      const { data } = await network.get("/transactions/all-users-profit");
      setUsersRows(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchTopStocks = useCallback(async () => {
    try {
      console.log(selectValues);
      const { data } = await network.post("/stocks/top-stocks", {
        atr: selectValues,
      });
      console.log(data);
      setStocksRows(data);
    } catch (err) {
      console.error(err);
    }
  }, [selectValues]);

  useEffect(() => {
    fetchOptions();
    fetchTopStocks();
    fetchAllUsersProfit();
  }, []);

  useEffect(() => {
    fetchTopStocks();
  }, [selectValues]);

  return (
    <div className={classes.root}>
      <div className={classes.section}>
        <div>
          <h3>top stocks</h3>
          <Select
            name="colors"
            defaultValue={selectValues}
            options={options}
            onChange={handleSelectChange}
            className={classes.textField}
            classNamePrefix="select"
            placeholder="select period"
          />
          <div>
           <TopStocksTable classes={classes} headers={stockHeaders} rows={stockRows}/>
          </div>
        </div>
        <div>
          <h3>Top investors</h3>
          <div>
          <GenericTable headers={usersHeaders} rows={usersRows} classes={classes}/>
          </div>
        </div>
      </div>
    </div>
  );
}
