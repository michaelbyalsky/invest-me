import { DataGrid } from "@material-ui/data-grid";
import React, { useState, useCallback, useEffect } from "react";
import network from "../network/index";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import Select from "react-select";
import { useHistory } from "react-router-dom";
import Loading from "./Loading";
import { startCase, camelCase } from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {},
  control: {
    padding: "2px",
    marginBottom: "1fr",
  },
  dataGrid: { cursor: "pointer", height: 600, width: "100%" },
}));

export default function BigDataList() {
  const history = useHistory();
  const [bigData, setBigData] = useState();
  const [columns, setColumns] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectValues, setSelectValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  const handleCellClick = useCallback((cell) => {
    history.push(`/one-stock/${cell.row.symbol}`);
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
      const mapped = data.map((option) => ({
        label: startCase(option.label),
        value: option.value,
      }));
      setOptions(mapped);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchBigDataList = useCallback(async () => {
    try {
      const { data } = await network.post("/stocks/all", selectValues);
      const oneStock = data[0];
      const resColumns = Object.keys(oneStock).map((key, i) => {
        return {
          field: key,
          headerName: _.startCase(key),
          width: 130,
        };
      });
      setLoading(false);
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

  if (loading) {
    return <Loading type={"spin"} color={"blue"} height={333} width={185} />;
  }

  return (
    <div className={classes.root}>
      <div className={classes.control}>
        <Select
          isMulti
          testId="bigDataSelect"
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
