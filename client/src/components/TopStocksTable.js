import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

export default function TopStocksTable({ rows, classes, headers }) {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {headers.map((header, i) => (
                <TableCell key={i} align="left">{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length !== 0 &&
              rows.map((row) => (
                <TableRow key={row.title}>
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.currentRate}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.period}%
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
