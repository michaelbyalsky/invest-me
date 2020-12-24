import { DataGrid } from "@material-ui/data-grid";
import React, { useState, useCallback, useEffect } from "react";
import network from "../network/index";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import Select from "react-select";
import { Link, useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {},
  control: {
    padding: "2px",
    marginBottom: "1fr",
  },
  dataGrid: { cursor: "pointer", height: 600, width: "100%" },
}));

export default function BigDataList() {
  const history = useHistory()
  const [bigData, setBigData] = useState();
  const [columns, setColumns] = useState(null);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectValues, setSelectValues] = useState(null);
  const classes = useStyles();

  const handleCellClick = useCallback((cell) => {
    history.push(`/one-stock/${cell.row.symbol}`)
  }, []);

  // const handleClickOpen = useCallback(() => {
  //   setOpen(true);
  // }, []);

  // const handleClose = useCallback(() => {
  //   setOpen(false);
  // }, []);

  const handleSelectChange = useCallback((e) => {
    setSelectValues(Array.isArray(e) ? e.map((x) => x.value) : []);
  }, []);

  const fetchOptions = useCallback(async () => {
    try {
      const { data } = await network.get("/stocks/periods");
      setOptions(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchBigDataList = useCallback(async () => {
    try {
      const { data } = await network.post("/stocks/all", selectValues);
      const oneStock = data[0];
      const oneStockValues = Object.values(oneStock);
      const resColumns = Object.keys(oneStock).map((key, i) => {
        return {
          field: key,
          headerName: _.startCase(key),
          width: 130,
        };
      });
      setColumns(resColumns);
      setBigData(data);
    } catch (err) {
      console.error(err);
    }
  }, [selectValues]);

  useEffect(() => {
    fetchOptions();
    fetchBigDataList();
  }, []);

  useEffect(() => {
    fetchBigDataList();
  }, [selectValues]);

  return (
    <div className={classes.root}>
      <div className={classes.control}>
        <Select
          isMulti
          name="colors"
          options={options}
          onChange={handleSelectChange}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </div>
      <div className={classes.dataGrid}>
        {bigData && columns && (
          <DataGrid
            onCellClick={handleCellClick}
            rows={bigData}
            columns={columns}
            pageSize={20}
          />
        )}
      </div>
    </div>
  );
}
