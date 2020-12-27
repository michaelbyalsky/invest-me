import React, { useState, useCallback, useEffect } from "react";
import network from "../network/index";
import useStyles from "./CompetitionStyles";
import StocksTable from "./StocksTable";
import GenericTable from "./GenericTable";
import Loading from './Loading'

const usersHeaders = [
  "username",
  "BuyingPrice",
  "Current value",
  "Total profit",
  "Yield",
];

export default function Competition() {
  const classes = useStyles();
  const [usersData, setUsersData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPortfolios = useCallback(async () => {
    try {
      const { data } = await network.get("/transactions/all-portfolios");
      const array = Object.entries(data);
      return array;
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchAllUsersProfit = useCallback(async () => {
    try {
      const { data } = await network.get("/transactions/all-users-profit");
      return data;
    } catch (err) {
      console.error(err);
    }
  }, []);

  const joinedData = useCallback(async () => {
    Promise.all([fetchPortfolios(), fetchAllUsersProfit()]).then((ans) => {
      const newArr = [];
      for (let i = 0; i < ans[0].length; i++) {
        for (let j = 0; j < ans[1].length; j++) {
          if (ans[0][i][0] === ans[1][j]["username"]) {
            newArr.push([ans[0][i], [ans[1][j]]]);
          }
        }
      }
      setUsersData(newArr);
      setLoading(false)
    });
  }, []);
  
  useEffect(() => {
    joinedData();
  }, []);

  if(loading){
    return <Loading type={"spin"} color={"blue"} height={667} width={375} />
  }
  
  return (
    <div className={classes.root}>
      {usersData &&
        usersData.map((portfolio, i) => (
          <div className={classes.tableWrapper}>
            <h3 className={classes.username}>{portfolio[0][0]}</h3>
            <div className={classes.table}>
              <StocksTable key={i} tableRows={portfolio[0][1]} />
            </div>
            <div className={classes.table}>
              <GenericTable
                key={i}
                headers={usersHeaders}
                rows={portfolio[1]}
                classes={classes}
              />
            </div>
          </div>
        ))}
    </div>
  );
}
