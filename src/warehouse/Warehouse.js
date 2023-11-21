import React, { useState } from "react";
import PartTable from "./PartTable";
import {
  Paper,
  Box,
  Select,
  MenuItem,
  Typography,
  Button,
} from "@material-ui/core";
import Header from "../homepage/Header";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const stores = ["store1", "store2", "store3", "store4"];
const pickticketList = [
  "PickTicket001",
  "PickTicket002",
  "PickTicket003",
  "PickTicket004",
];

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "80%",
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    justifyContent: "center",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid grey",
  },
  select: {
    width: "60%",
    margin: "10px",
  },
  link: {
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    gap: "5px",
    textDecoration: "none",
  },
  btn: {
    float: "right",
    marginRight: "8.5%",
  },
}));

function Warehouse(props) {
  const classes = useStyles();
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedPickticket, setSelectedPickticket] = useState("");
  const [type, setType] = useState("");

  const handleType = (e) => {
    setType(e.target.value);
  };
  const handleStore = (e) => {
    setSelectedStore(e.target.value);
  };
  const handleWithPicket = (e) => {
    setSelectedPickticket(e.target.value);
  };
  return (
    <div>
      <Header />
      <Box className={classes.paper}>
        <Typography>Issue/ Return pickticket</Typography>
        <Select value={type} className={classes.select} onChange={handleType}>
          <MenuItem>Issue pickticket</MenuItem>
          <MenuItem>Return picktikcet</MenuItem>
        </Select>
        <Typography>Select a store *</Typography>
        <Select
          value={selectedStore}
          className={classes.select}
          onChange={handleStore}
        >
          {stores.map((item, i) => (
            <MenuItem key={i}>{item}</MenuItem>
          ))}
        </Select>
        <Typography>With/ Without pickticket</Typography>
        <Select
          value={selectedPickticket}
          className={classes.select}
          onChange={handleWithPicket}
        >
          <MenuItem>With pickticket</MenuItem>
          <MenuItem>Without pickticket</MenuItem>
        </Select>
        <div>
          <Typography>Pick Tickets</Typography>
          {pickticketList.map((item) => (
            <Link
              to={{
                pathname: `/warehouse/pickticket/${encodeURIComponent(item)}`,
                item: item,
                store: selectedStore,
              }}
            >
              <Button className={classes.link}>{item}</Button>
            </Link>
          ))}
        </div>
      </Box>
      <Link to="/">
        <Button variant="contained" color="primary" className={classes.btn}>
          Home
        </Button>
      </Link>
    </div>
  );
}
export default Warehouse;
