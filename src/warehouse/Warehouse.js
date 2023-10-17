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
import Header from "../homepage/Header";
import { makeStyles } from "@material-ui/core/styles";

const stores = ["store1", "store2", "store3", "store4"];
const picktickets = ["with pickticket", "without pickticket"];
const pickticketList = ["1000", "1001", "1002"];

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "80%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px auto",
    padding: "20px",
  },
  select: {
    width: "60%",
    margin: "10px",
  },
}));

function Warehouse(props) {
  const classes = useStyles();
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedPickticket, setSelectedPickticket] = useState("");
  const [issueValue, setIssueValue] = useState("");
  return (
    <div>
      <Header />
      <Paper className={classes.paper}>
        <Typography>Issue or Return pickticket</Typography>
        <Select value={issueValue} className={classes.select}>
          <MenuItem>Issue pickticket</MenuItem>
          <MenuItem>Return picktikcet</MenuItem>
        </Select>
        <Typography>Select a store *</Typography>

        <Select value={selectedStore} className={classes.select}>
          {stores.map((item, i) => (
            <MenuItem key={i}>{item}</MenuItem>
          ))}
        </Select>

        <Typography>Select pickticket</Typography>

        <Select value={selectedPickticket} className={classes.select}>
          {picktickets.map((item, i) => (
            <MenuItem key={i}>{item}</MenuItem>
          ))}
        </Select>
      </Paper>
    </div>
  );
}

export default Warehouse;
