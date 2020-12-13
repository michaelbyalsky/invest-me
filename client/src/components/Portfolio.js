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
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import network from "../network/index";
import { useRecoilState } from "recoil";
import { stocksArrayState } from "../recoil/Atom";
import { useForm } from "react-hook-form";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import AsyncSelect from "react-select/async";

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

// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
//   createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
//   createData("Eclair", 262, 16.0, 24, 6.0),
//   createData("Cupcake", 305, 3.7, 67, 4.3),
//   createData("Gingerbread", 356, 16.0, 49, 3.9),
// ];

const financial = (x) => {
  return Number.parseFloat(x).toFixed(2);
};

export default function Portfolio() {
  const classes = useStyles();
  const [cash, setCash] = useState(0);
  const [investments, setInvestments] = useState(0);
  const [open, setOpen] = useState(false);
  const [openSell, setOpenSell] = useState(false);
  const [stocksArray, setStocksArray] = useRecoilState(stocksArrayState);
  const [query, setQuery] = useState("");
  const [stockToUpdate, setStockToUpdate] = useState(null);
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [value, setValue] = useState("");
  const [rows, setRows] = useState([]);
  const [stockSellAmount, setStockSellAmount] = useState(0);
  const [stockForSell, setStockForSell] = useState("");
  const [ifNegetive, setIfNegetive] = useState(false);
  const [sellPrice, setSellPrice] = useState(0);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseSell = () => {
    setOpenSell(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
  }, []);

  // useEffect(() => {
  //   searchStocks();
  // }, [query]);

  const fetchUserMoney = useCallback(async () => {
    try {
      const {
        data: { cash },
      } = await network.get("/users/money");
      const { data } = await network.get("/users/investments");
      setCash(cash);
      setInvestments(financial(data[0].totalCost / 1000));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getUserPortfolio = useCallback(async () => {
    try {
      const { data } = await network.get("/users/stocks");
      setRows(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const onAddStock = async () => {
    if (Number(amount) <= 0) {
      return;
    }
    try {
      const obj = {
        symbol: stockToUpdate,
        price: price,
        amount: Number(amount),
      };
      const { data } = await network.post("/users/stocks", obj);
      getUserPortfolio();
      setStockToUpdate("");
      setPrice("");
      setAmount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const loadingOption = async () => {
    try {
      const { data } = await network.get(`/stocks/search?q=${query}`);
      const maped = data.map((stock) => ({
        label: stock.title,
        symbol: stock.symbol,
        price: stock.lastRate,
      }));
      return maped;
    } catch (err) {
      console.error(err);
    }
  };

  //remove stock
  const onSellStock = useCallback(async () => {
    try {
      const obj = {
        symbol: parseFloat(stockForSell),
        amount: -Number(stockSellAmount),
        negetive: ifNegetive,
        price: sellPrice,
      };
      console.log(obj);
      const { data } = await network.patch("/users/stocks", obj);
      setStockForSell("");
      setStockSellAmount(0);
    } catch (err) {
      console.error(err);
    }
  }, [sellPrice, ifNegetive, stockForSell, stockSellAmount]);

  const onPressSell = useCallback((value) => {
    console.log(value);
    setStockForSell(value.symbol);
    if (value.yield < 0) {
      setIfNegetive(true);
    } else {
      setIfNegetive(false);
    }
    setSellPrice(value["Stock.lastRate"]);
    setOpenSell(true);
  }, []);

  const handleInputChange = useCallback((value) => {
    setQuery(value);
  }, []);

  const handleSelectChange = (value) => {
    setStockToUpdate(value.symbol);
    setPrice(value.price);
    setValue(value.lable);
  };

  useEffect(() => {
    fetchUserMoney();
    getUserPortfolio();
  }, []);
  console.log(query);
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
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          new stock
        </Button>
        <Dialog
          fullWidth="true"
          open={openSell}
          onClose={handleCloseSell}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            Add stock
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Add new stock to your stock portfolio
            </DialogContentText>

            <TextField
              label="amount"
              id="outlined-margin-dense"
              value={stockSellAmount}
              className={classes.textField}
              helperText="stock sell amount"
              margin="dense"
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
          <DialogActions>
            <Button autoFocus onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={onAddStock} color="primary">
              Add stock
            </Button>
          </DialogActions>
        </Dialog>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Stock</TableCell>
                <TableCell align="right">Symbol</TableCell>
                <TableCell align="right">Last rate</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">AVG b.price</TableCell>
                <TableCell align="right">Total value shekel</TableCell>
                <TableCell align="right">Yield</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length !== 0 &&
                rows.map((row) => (
                  <TableRow key={row.title}>
                    <TableCell component="th" scope="row">
                      {row["Stock.title"]}
                    </TableCell>
                    <TableCell align="right">{row.symbol}</TableCell>
                    <TableCell align="right">{row["Stock.lastRate"]}</TableCell>
                    <TableCell align="right">{row.totalAmount}</TableCell>
                    <TableCell align="right">
                      {financial(row.avgPrice)}
                    </TableCell>
                    <TableCell align="right">
                      {financial(row.totalCost / 100)}
                    </TableCell>
                    <TableCell align="right">
                      {financial(row.change)}%
                    </TableCell>
                    <button onClick={() => onPressSell(row)}>delete</button>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
