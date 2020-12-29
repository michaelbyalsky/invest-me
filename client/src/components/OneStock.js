import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import network from "../network/index";
import StockByPeriod from "./StockByPeriod";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { startCase } from "lodash";
import Loading from './Loading'

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    justifyContent: "center",
  },
}));


export default function OneStock() {
  const params = useParams();
  const [stock1, setStock1] = useState();
  const [stockMeta1, setStockMeta1] = useState();
  const [loading, setLoading] = useState(true)
  const classes = useStyles();
  const fetchOneStock = useCallback(async () => {
    try {
      const { data: period } = await network.get(
        `/stocks/one-stock-data/${params.symbol}`
      );
      const array = Object.entries(period).map((arr) => ({
        period: startCase(arr[0]),
        yield: arr[1],
      }));
      setStock1(array);
      setLoading(false)
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchStockMeta = useCallback(async () => {
    try {
      const { data: meta } = await network.get(
        `/stocks/by-symbol/${params.symbol}`
      );
      setStockMeta1(meta);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchOneStock();
    fetchStockMeta();
  }, []);

if (loading) {
  return <Loading type={"spin"} color={"blue"} height={333} width={185} />
}

  return (
    <div className={classes.root}>
      {stockMeta1 && stock1 && (
        <div>
          <StockByPeriod stockMeta={stockMeta1} stock1={stock1} />
        </div>
      )}
    </div>
  );
}
