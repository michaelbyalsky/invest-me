import React, { useState, useCallback, useEffect } from "react";
import Select from "react-select";
import network from "../network/index";
import { startCase } from "lodash";
import GenericTable from "./GenericTable";
import TopStocksTable from "./TopStocksTable";
import { useStyles } from "./HomeStyles";
import Loading from "./Loading";

const stockHeaders = ["Stock", "Last Rate", "Yield"];

const usersHeaders = [
  "username",
  "BuyingPrice",
  "Current value",
  "Total profit",
  "Yield",
];

export default function Home() {
  const [options, setOptions] = useState([]);
  const [selectValues, setSelectValues] = useState("lastThirtyDays");
  const [stockRows, setStocksRows] = useState([]);
  const [usersRows, setUsersRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  const handleSelectChange = useCallback((e) => {
    setSelectValues(e.value);
  }, []);

  const fetchOptions = useCallback(async () => {
    try {
      const { data } = await network.get("/stocks/periods");
      data.forEach((period) => (period.label = startCase(period.label)));
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
      const { data } = await network.post("/stocks/top-stocks", {
        atr: selectValues,
      });
      setStocksRows(data);
      setLoading(false);
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

  if (loading) {
    return <Loading type={"spin"} color={"blue"} height={333} width={185} />;
  }

  return (
    <div className={classes.root}>
      <div className={classes.section}>
        <div className={classes.topStocks}>
          <div className={classes.header}>
            <h3 testId="topStocks" className={classes.headerTitle}>top stocks</h3>
            <Select
            testId="select"
              name="colors"
              defaultValue={selectValues}
              options={options}
              onChange={handleSelectChange}
              className={classes.textField}
              classNamePrefix="select"
              placeholder="select period"
            />
          </div>
          <div>
            <TopStocksTable
              classes={classes}
              headers={stockHeaders}
              rows={stockRows}
            />
          </div>
        </div>
        <div>
          <div>
            <div className={classes.topInvestors}>
              <h3 testId="topInvestors" className={classes.headerTitle}>Top investors</h3>
              <GenericTable
                headers={usersHeaders}
                rows={usersRows}
                classes={classes}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
