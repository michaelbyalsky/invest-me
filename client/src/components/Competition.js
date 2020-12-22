import React, { useState, useCallback, useEffect } from "react";
import network from "../network/index";
import useStyles from './CompetitionStyles'
import StocksTable from "./StocksTable";

export default function Competition() {
  const classes = useStyles();
  const [allPortfolios, setAllPortfolios] = useState(null);

  const fetchPortfolios = useCallback(async () => {
    try {
      const { data } = await network.get("/transactions/all-portfolios");
      const Array = Object.entries(data);

      setAllPortfolios(Array);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  return (
    <div className={classes.root}>
      {allPortfolios &&
        allPortfolios.map((portfolio, i) => (
          <div className={classes.tableWrapper}>
            <h3 className={classes.username}>{portfolio[0]}</h3>
            <div className={classes.table}>
              <StocksTable key={i} tableRows={portfolio[1]} />
            </div>
          </div>
        ))}
    </div>
  );
}
