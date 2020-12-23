import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import network from "../network/index";
import StockByPeriod from './StockByPeriod'

export default function OneStock() {
  const params = useParams();
  const [stock1, setStock1] = useState();
  
  const fetchOneStock = useCallback(async () => {
    try {
      const { data: period } = await network.get(
        `/stocks/one-stock-data/${params.symbol}`
      );
      const { data: meta } = await network.get(
        `/stocks/one-stock-data/${params.symbol}`
      )
      const array = Object.entries(period).map(arr => ({period: arr[0], yield: arr[1]}));
      setStock1(array);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchOneStock();
  }, []);

  return (
    <div>
      <StockByPeriod stock1={stock1}/>
    </div>
  );
}
