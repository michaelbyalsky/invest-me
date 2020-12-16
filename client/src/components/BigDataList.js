import { DataGrid } from "@material-ui/data-grid";
import React, { useState, useCallback, useEffect } from "react";
import network from "../network/index";
import _ from "lodash";

export default function BigDataList() {
  const [bigData, setBigData] = useState();
  const [columns, setColumns] = useState(null);
  const fetchBigDataList = useCallback(async () => {
    try {
      const { data } = await network.get("/stocks/all");
      const oneStock = data[0];
      const oneStockValues = Object.values(oneStock);
      const resColumns = Object.keys(oneStock).map((key, i) => {
        return {
          field: key,
          headerName: _.startCase(key),
          width: 130
        };
      });
      setColumns(resColumns);
      setBigData(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchBigDataList();
  }, []);

  return (
    <div style={{ height: 600, width: "100%" }}>
    {bigData && columns &&
      <DataGrid
        rows={bigData}
        columns={columns}
        pageSize={20}
        checkboxSelection
      />
    }
    </div>
  );
}
