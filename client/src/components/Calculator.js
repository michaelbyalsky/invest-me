import React, { useState, useCallback, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import AsyncSelect from "react-select/async";
import network from "../network/index";
import Select from "react-select";
import { startCase } from 'lodash'
import { financial } from '../functions/helpers'

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridAutoRows: "100px",
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

const Calculator = () => {
  const classes = useStyles();
  const [cash, setCash] = useState(0);
  const [query, setQuery] = useState(null);
  const [stockLink, setStockLink] = useState(null);
  const [periodYield, setPeriodYield] = useState("");
  const [estimateYield, setEstimateYield] = useState("");
  const [options, setOptions] = useState();

  const handleSelectStockChange = useCallback(async (value) => {
    setStockLink(value.symbol);
  }, []);

  useEffect(() => {
    setEstimateYield(financial((cash * periodYield) / 100));
  }, [cash, periodYield]);

  useEffect(() => {
    loadingPeriodOptions();
  }, [stockLink]);

  const handleSelectPeriodChange = useCallback((value) => {
    setPeriodYield(value.value);
  }, []);

  const handleInputStockChange = useCallback((value) => {
    setQuery(value);
  }, []);

  const onChangeCash = useCallback((e) => {
    setCash(e.target.value);
  }, []);

  const loadingStockOptions = useCallback(async () => {
    if (query === null) {
      return;
    }
    try {
      const { data } = await network.get(`/stocks/search?q=${query}`);
      const mapped = data.map((stock) => ({
        label: stock.title,
        symbol: stock.symbol,
      }));
      return mapped;
    } catch (err) {
      console.error(err);
    }
  }, [query]);

  const loadingPeriodOptions = useCallback(async () => {
    if (!stockLink) {
      return;
    }
    try {
      const { data } = await network.get(`stocks/one-stock-data/${stockLink}`);
      const list = Object.entries(data);
      const mapped = list.map((item) => ({ label: startCase(item[0]), value: item[1] }));
      setOptions(mapped);
      return mapped;
      //   return mapped;
    } catch (err) {
      console.error(err);
    }
  }, [stockLink]);

  return (
    <div className={classes.root}>
      <div>
        <TextField
          label="Cash"
          id="outlined-margin-dense"
          value={cash}
          className={classes.textField}
          margin="dense"
          variant="outlined"
          type="number"
          onChange={onChangeCash}
        />
      </div>
      <div className={classes.moneyBar}>
        <div>
          <AsyncSelect
            className={classes.textField}
            cacheOptions
            defaultOptions
            hideSelectedOptions={false}
            // value={stockToUpdate}
            onChange={handleSelectStockChange}
            placeholder={"select stock"}
            onInputChange={handleInputStockChange}
            loadOptions={loadingStockOptions}
          />
        </div>
        <div>
          <Select
            className={classes.textField}
            cacheOptions
            // defaultOptions

            onChange={handleSelectPeriodChange}
            placeholder={"select period"}
            options={options}
          />
        </div>
      </div>
      <div className={classes.moneyBar}>
        <div>
          <TextField
            label="Period yield %"
            id="outlined-margin-dense"
            value={`${periodYield}`}
            className={classes.textField}
            margin="dense"
            variant="outlined"
            type="number"
          />
        </div>
        <div>
          <TextField
            label="Estimate yield"
            id="outlined-margin-dense"
            value={estimateYield}
            className={classes.textField}
            margin="dense"
            variant="outlined"
            type="number"
          />
        </div>
      </div>
    </div>
  );
};

export default Calculator;
