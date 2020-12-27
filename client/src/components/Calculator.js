import React, { useState, useCallback, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import AsyncSelect from "react-select/async";
import network from "../network/index";
import Select from "react-select";
import { startCase } from "lodash";
import { financial } from "../functions/helpers";
import Button from "@material-ui/core/Button";

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
  cash: {
    margin: "auto",
    marginBottom: "40px",
  },
}));

const Calculator = () => {
  const classes = useStyles();
  const [cash, setCash] = useState(0);
  const [query, setQuery] = useState("");
  const [stockLink, setStockLink] = useState(null);
  const [periodYield, setPeriodYield] = useState("");
  const [estimateYield, setEstimateYield] = useState("");
  const [options, setOptions] = useState();
  const [stockOption, setStockOptions] = useState();
  const [error, setError] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  // const [stockTitle, setStockTitle] = useState('')

  const onClear = useCallback(() => {
    setCash(0);
    setStockLink(null);
    setPeriodYield("");
    setEstimateYield("");
    setOptions("");
    setStockOptions("");
    setQuery("");
    setDefaultValue("");
    loadingStockOptions();
    // setStockTitle('')
  }, []);

  const handleSelectStockChange = useCallback(async (value) => {
    setStockLink(value.symbol);
    // setStockTitle(value.label)
  }, []);

  useEffect(() => {
    setEstimateYield(financial((cash * periodYield) / 100));
  }, [cash, periodYield]);

  useEffect(() => {
    loadingPeriodOptions();
  }, [stockLink]);

  useEffect(() => {
    loadingStockOptions();
  }, [query]);

  useEffect(() => {
    loadingStockOptions();
  }, [query]);

  const handleSelectPeriodChange = useCallback(
    (value) => {
      setPeriodYield(value.value);
    },
    [stockLink]
  );

  const handleInputStockChange = useCallback((value) => {
    setQuery(value);
  }, []);

  const onChangeCash = useCallback((e) => {
    setCash(e.target.value);
  }, []);

  const loadingStockOptions = useCallback(async () => {
    try {
      const { data } = await network.get(`/stocks/search?q=${query}`);
      const mapped = data.map((stock) => ({
        label: stock.title,
        symbol: stock.symbol,
      }));
      setStockOptions(mapped);
    } catch (err) {
      console.error(err);
    }
  }, [query]);

  const loadingPeriodOptions = useCallback(async () => {
    if (!stockLink) {
      return setError("first choose link");
    }
    try {
      const { data } = await network.get(`stocks/one-stock-data/${stockLink}`);
      const list = Object.entries(data);
      const mapped = list.map((item) => ({
        label: startCase(item[0]),
        value: item[1],
      }));
      setOptions(mapped);
      return mapped;
      //   return mapped;
    } catch (err) {
      console.error(err);
    }
  }, [stockLink]);

  return (
    <div className={classes.root}>
      <div className={classes.cash}>
        <TextField
          // isClearable={true}
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
          <Select
            // isClearable={true}
            className={classes.textField}
            cacheOptions
            defaultOptions
            hideSelectedOptions={false}
            defaultValue={defaultValue}
            onChange={handleSelectStockChange}
            placeholder={"select stock"}
            onInputChange={handleInputStockChange}
            options={stockOption}
          />
        </div>
        <div>
          <Select
            className={classes.textField}
            cacheOptions
            // defaultOptions
            defaultValue={defaultValue}
            onChange={handleSelectPeriodChange}
            placeholder={"select period"}
            options={options}
          />
        </div>
      </div>
      <div className={classes.moneyBar}>
        <div>
          <TextField
            helperText="Period yield %"
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
            helperText="Estimate yield"
            id="outlined-margin-dense"
            value={estimateYield}
            className={classes.textField}
            margin="dense"
            variant="outlined"
            type="number"
          />
        </div>
      </div>
      <div className={classes.cash}>
        <Button onClick={onClear} variant="contained" color="primary">
          clear
        </Button>
      </div>
    </div>
  );
};

export default Calculator;
