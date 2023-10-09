import React, { useState } from "react";
import PartTable from "./PartTable";
import {
  Paper,
  Select,
  MenuItem,
  Input,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";

const stores = ["store1", "store2", "store3", "store4"];
const picktickets = ["with pickticket", "without pickticket"];
const pickticketList = ["1000", "1001", "1002"];

function Warehouse(props) {
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedPickticket, setSelectedPickticket] = useState("");
  return (
    <Paper>
      <Table>
        <TableBody>
          <TableRow>
            <Typography>Select a store *</Typography>
          </TableRow>
          <TableRow>
            <TableCell>
              <Select value={selectedStore}>
                {stores.map((item, i) => (
                  <MenuItem key={i}>{item}</MenuItem>
                ))}
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <Typography>Select pickticket</Typography>
          </TableRow>
          <TableRow>
            <TableCell>
              <Select value={selectedPickticket}>
                {picktickets.map((item, i) => (
                  <MenuItem key={i}>{item}</MenuItem>
                ))}
              </Select>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}

export default Warehouse;
