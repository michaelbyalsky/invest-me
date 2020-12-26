import React, { useState, useCallback, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import network from "../network/index";
import AsyncSelect from "react-select/async";
import Typography from "@material-ui/core/Typography";
import StocksTable from "./StocksTable";
import { financial } from "../functions/helpers";
import { useStyles } from "./PortfolioStyles";
import GenericTable from "./GenericTable";

const usersHeaders = [
  "username",
  "BuyingPrice",
  "Current value",
  "Total profit",
  "Yield",
];

export default function Portfolio() {
  const classes = useStyles();
  const [cash, setCash] = useState(0);
  const [investments, setInvestments] = useState(0);
  const [open, setOpen] = useState(false);
  const [openSell, setOpenSell] = useState(false);
  const [query, setQuery] = useState("");
  const [stockToUpdate, setStockToUpdate] = useState(null);
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [value, setValue] = useState("");
  const [rows, setRows] = useState([]);
  const [stockSellAmount, setStockSellAmount] = useState(0);
  const [stockForSell, setStockForSell] = useState("");
  const [ifNegative, setIfNegative] = useState(false);
  const [sellPrice, setSellPrice] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [error, setError] = useState(""); // TODO: error
  const [buyError, setBuyError] = useState("");
  const [sellError, setSellError] = useState("");
  const [userProfit, setUserProfit] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseSell = useCallback(() => {
    setOpenSell(false);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const fetchAllStocks = async () => {
    try {
      const { data } = await network.get("/stocks/stocks-array");
      // setStocksArray(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllStocks();
    fetchUserProfit();
  }, []);

  // useEffect(() => {
  //   searchStocks();
  // }, [query]);

  const fetchUserMoney = useCallback(async () => {
    try {
      const {
        data: { cash },
      } = await network.get("/transactions/money");
      const { data } = await network.get("/transactions/investments");
      setCash(cash);
      setInvestments(financial(data[0].currentPrice / 100));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getUserPortfolio = useCallback(async () => {
    try {
      const { data } = await network.get("/transactions");
      setRows(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchUserProfit = useCallback(async () => {
    try {
      const { data } = await network.get("transactions/user-profit");
      setUserProfit(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const onAddStock = useCallback(async () => {
    if (Number(amount) <= 0) {
      setBuyError("amount error");
      setTimeout(() => {
        setBuyError("");
      }, 3000);
      return;
    }
    try {
      const obj = {
        symbol: stockToUpdate,
        buyPrice: price,
        buyAmount: Number(amount),
      };
      const { data } = await network.post("/transactions", obj);
      getUserPortfolio();
      setStockToUpdate("");
      setPrice("");
      setAmount(0);
    } catch (err) {
      console.error(err);
    }
  }, [stockToUpdate, price, amount]);

  const loadingOption = useCallback(async () => {
    try {
      const { data } = await network.get(`/stocks/search?q=${query}`);
      const mapped = data.map((stock) => ({
        label: stock.title,
        symbol: stock.symbol,
        price: stock.lastRate,
      }));
      return mapped;
    } catch (err) {
      console.error(err);
    }
  }, [query]);

  //remove stock
  const onSellStock = useCallback(async () => {
    if (currentAmount - Number(stockSellAmount) < 0) {
      setSellError("Amount error");
      setTimeout(() => {
        setSellError("");
      }, 3000);
      return;
    }
    try {
      const obj = {
        symbol: parseFloat(stockForSell),
        sellAmount: Number(stockSellAmount),
        negative: ifNegative,
        sellPrice: sellPrice,
      };
      const { data } = await network.patch("/transactions", obj);
      setStockForSell("");
      setStockSellAmount(0);
      getUserPortfolio();
    } catch (err) {
      console.error(err);
    }
  }, [sellPrice, ifNegative, stockForSell, stockSellAmount, currentAmount]);

  const onPressSell = useCallback((value) => {
    setCurrentAmount(value.currentAmount);
    setStockForSell(value.symbol);
    if (value.yield < 0) {
      setIfNegative(true);
    } else {
      setIfNegative(false);
    }
    setOpenSell(true);
  }, []);

  const handleInputChange = useCallback((value) => {
    setQuery(value);
  }, []);

  const handleSelectChange = useCallback((value) => {
    setStockToUpdate(value.symbol);
    setPrice(value.price);
    setValue(value.lable);
  }, []);

  useEffect(() => {
    fetchUserMoney();
    getUserPortfolio();
  }, []);
  return (
    <div className={classes.root}>
      <div className={classes.moneyBar}>
        <div>
          <TextField
            label="Cash"
            id="outlined-margin-dense"
            value={cash}
            className={classes.textField}
            margin="dense"
            variant="outlined"
            type="number"
          />
        </div>
        <div>
          <TextField
            label="Investments"
            id="outlined-margin-dense"
            value={investments}
            className={classes.textField}
            margin="dense"
            variant="outlined"
            type="number"
          />
        </div>
      </div>
      <div>
        <div className={classes.button}>
          <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            new stock
          </Button>
        </div>
        <Dialog
          fullWidth="true"
          open={openSell}
          onClose={handleCloseSell}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            sell stock
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{sellError}</DialogContentText>
            <TextField
              label="price"
              id="outlined-margin-dense"
              value={sellPrice}
              className={classes.textField}
              helperText="stock sell amount"
              margin="dense"
              variant="outlined"
              type="number"
              onChange={(e) => setSellPrice(e.target.value)}
            />
            <TextField
              label="amount"
              id="outlined-margin-dense"
              value={stockSellAmount}
              className={classes.textField}
              helperText="stock sell amount"
              margin="amount"
              variant="outlined"
              type="number"
              onChange={(e) => setStockSellAmount(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCloseSell} color="primary">
              Cancel
            </Button>
            <Button onClick={onSellStock} color="primary">
              sell stock
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          fullWidth="true"
          open={open}
          onClose={handleClose}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            Add stock
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Add new stock to your stock portfolio
            </DialogContentText>
            <AsyncSelect
              cacheOptions
              defaultOptions
              hideSelectedOptions={false}
              cacheOptions
              // value={stockToUpdate}
              onChange={handleSelectChange}
              placeholder={"slect stock"}
              onInputChange={handleInputChange}
              loadOptions={loadingOption}
            />
            <TextField
              label="Dense"
              id="outlined-margin-dense"
              value={amount}
              className={classes.textField}
              helperText="stock amount"
              margin="dense"
              variant="outlined"
              type="number"
              onChange={(e) => setAmount(e.target.value)}
            />
            <TextField
              label="price"
              id="outlined-margin-dense"
              value={price}
              className={classes.textField}
              helperText="stock buying price"
              margin="dense"
              variant="outlined"
              type="number"
              onChange={(e) => setPrice(e.target.value)}
            />
          </DialogContent>
          <Typography variant="outlined">{buyError}</Typography>
          <DialogActions>
            <Button autoFocus onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={onAddStock} color="primary">
              Add stock
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div className={classes.tableWrapper}>
        <div className={classes.stocksTable}>
          <StocksTable tableRows={rows} onPressSell={onPressSell} />
        </div>
      <div className={classes.profitTable}>
        <GenericTable
          headers={usersHeaders}
          rows={userProfit}
          classes={classes}
        />
      </div>
      </div>
    </div>
  );
}
