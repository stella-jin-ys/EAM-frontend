import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { TextField, Typography } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import WSPicktickets from "../../../tools/WSPicktickets";
import BarcodeInput from "./BarcodeInput";
import WSParts from "../../../tools/WSParts";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
    marginTop: theme.spacing(3),
    width: "90%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
}));

function BinToBin() {
  const classes = useStyles();
  const [input, setInput] = useState("");
  const [storeInput, setStoreInput] = useState("");
  const [binInput, setBinInput] = useState("");
  const [stores, setStores] = useState([]);
  const [parts, setParts] = useState([]);
  const [assets, setAssets] = useState([]);
  const [bins, setBins] = useState([]);
  const [barcode, setBarcode] = useState("");

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleStoreInput = (event) => {
    setStoreInput(event.target.value);
  };

  const handleBinInput = (event) => {
    setBinInput(event.target.value);
  };

  const updateProperty = (event) => {
    console.log(event);
    setBarcode(event);
  };
  // Fetch Stores data from WSPicktickets
  useEffect(() => {
    async function fetchStores() {
      const res = await WSPicktickets.getStores();
      const dataArray = await res.body.data;
      setStores(dataArray);
    }
    fetchStores();
  }, [storeInput]);

  // Fetch Parts data from WSPicktickets
  useEffect(() => {
    async function fetchParts() {
      const res = await WSParts.getPartStock("10009");
      const dataArray = await res.body.data;
      console.log(dataArray);
      setParts(dataArray);
    }
    fetchParts();
  }, []);

  // Fetch Bins data from WSPicktickets
  useEffect(() => {
    async function fetchBins() {
      const res = await WSPicktickets.getBins();
      const dataArray = await res.body.data;
      setBins(dataArray);
    }
    fetchBins();
  }, []);

  return (
    <div>
      <FormControl className={classes.formControl}>
        {" "}
        <Typography component="div">Select a Store *</Typography>
        <Select onChange={handleStoreInput} value={storeInput}>
          {stores.map((store) => (
            <MenuItem key={store.code} value={store.desc}>
              {store.desc}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        {" "}
        <BarcodeInput updateProperty={updateProperty} />
        <TextField variant="standard" type="input" value={barcode} />
      </FormControl>

      <FormControl className={classes.formControl}>
        <Typography component="div">Quantity Available</Typography>
        <TextField variant="standard" type="input" disabled />
      </FormControl>

      <FormControl className={classes.formControl}>
        <Typography component="div">Quantity to Transfer *</Typography>
        <TextField variant="standard" type="number" />
      </FormControl>

      <FormControl className={classes.formControl}>
        {" "}
        <Typography component="div">Bin From *</Typography>
        <Select onChange={handleBinInput} value={binInput}>
          {bins.map((bin) => (
            <MenuItem key={bin.code} value={bin}>
              {bin}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <Typography component="div">Bin To *</Typography>
        <Select onChange={handleBinInput} value={binInput}>
          {bins.map((bin) => (
            <MenuItem key={bin.code} value={bin}>
              {bin}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default BinToBin;
