import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Button,
  Typography,
  Input,
  MenuItem,
  Select,
  FormControl,
  TextField,
  Paper,
  Snackbar,
  SnackbarContent,
  IconButton,
} from "@material-ui/core";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
} from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/core/styles";
import BarcodeInput from "../barcode/BarcodeInput";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "5%",
    gap: "20px",
    width: "100%",
    height: "100vh",
    backgroundColor: "white",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1517323197145-72f28d311d51?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQyNHx8d2hpdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60')", // Add your image path here
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  inputGroup: {
    display: "flex",
    gap: "10px",
    color: "black",
    alignItems: "center",
    marginBottom: "30px",
  },
  input: {
    height: "40px",
    border: "2px solid #078ff7",
    borderRadius: "8px",
    padding: "0 5px",
  },
  searchIcon: {
    color: "white",
    backgroundColor: "#078ff7",
    padding: "7px",
    borderRadius: "8px",
    marginLeft: "-8px",
  },
  select: {
    width: "300px",
    marginBottom: "40px",
  },
  bottom: {
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    marginTop: "20px",
  },
  success: {
    backgroundColor: theme.palette.success.main,
    height: "50px",
  },
  error: {
    backgroundColor: theme.palette.error.main,
    height: "50px",
  },
  content: {
    display: "flex",
  },
  icon: {
    fontSize: 20,
    marginRight: theme.spacing(1),
  },
  barcode: {
    display: "flex",
    alignItems: "center",
  },
}));

function IssuePart(props) {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [partInput, setPartInput] = useState("");
  const [part, setPart] = useState({});
  const [bin, setBin] = useState("");
  const [bins, setBins] = useState([]);
  const [asset, setAsset] = useState("");
  const [assets, setAssets] = useState([]);
  const [partQty, setPartQty] = useState("");

  const searchPart = () => {
    fetch(`http://localhost:3001/parts/${partInput}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching parts:", error);
      });
  };
  useEffect(() => {
    fetch(`http://localhost:3001/bins/${part.code}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching bins:", error);
      });
  }, [part]);

  useEffect(() => {
    fetch(`http://localhost:3001/assets/${bin}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching bins:", error);
      });
  }, [bin]);
  const handleBin = (e) => {
    setBin(e.target.value);
  };
  const handleBinBarcode = (e) => {
    console.log("scan bin barcode");
    setBin(e);
  };
  const handlePartInput = (e) => {
    setPartInput(e.target.value);
  };
  const handlePartBarcode = (e) => {
    console.log("scan part barcode");
    setPartInput(e);
  };
  const handlePartQty = (e) => {
    setPartQty(e.target.value);
  };
  const handleAsset = (e) => {
    setAsset(e.target.value);
  };
  const handleAssetBarcode = (e) => {
    console.log("scan asset barcode");
    setAsset(e);
  };
  console.log(bins, assets, bin, asset);
  console.log(props.store, props.issueInputs);
  let partUsage = {};
  const handleDone = () => {
    setLoading(true);
    partUsage["storeCode"] = props.store;
    partUsage["departmentCode"] = props.issueInputs.department;
    partUsage["transactionType"] = "ISSUE";
    partUsage["workOrderNumber"] = props.workorder;
    partUsage["activityCode"] = props.issueInputs.activity;
    partUsage["equipmentCode"] = props.issueInputs.equipment;
    if (partUsage.transactionlines === undefined) {
      if (part.trackByAsset === "true") {
        console.log("transactionlines asset");
        partUsage.transactionlines = [
          {
            bin: bin,
            assetIDCode: asset,
            partCode: part.code,
          },
        ];
      } else {
        partUsage.transactionlines = [
          {
            bin: bin,
            transactionQty: partQty,
            partCode: part.code,
          },
        ];
      }
    }
    if (props.issueInputs.equipment != "") {
      partUsage["transactionOn"] = "EQUIPMENT";
    }
    console.log(props.store, props.issueInputs);
    fetch("http://localhost:3001/partUsages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        partUsage,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("transaction done", response);
          setOpenSuccess(true);
          setTimeout(() => {
            history.push("/");
          }, 6000);
        } else {
          console.log("Transaction failed", response);
          setOpenError(true);
        }
      })
      .catch((error) => {
        console.log("Error", error);
        setOpenError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };
  const handleCloseError = () => {
    setOpenError(false);
  };
  return (
    <Paper className={classes.root}>
      <Typography variant="h4" className={classes.header}>
        Issue Part
      </Typography>
      <div>
        <div className={classes.barcode}>
          <Typography>Scan Part Barcode</Typography>
          <BarcodeInput updateProperty={handlePartBarcode} />
        </div>
        <div className={classes.inputGroup}>
          <Typography>Part Number: </Typography>
          <Input
            variant="outlined"
            disableUnderline={true}
            className={classes.input}
            onChange={handlePartInput}
            value={partInput}
            placeholder="Enter Part Number"
          />
          <SearchIcon
            type="button"
            cursor="pointer"
            className={classes.searchIcon}
            onClick={searchPart}
          />
          <Typography>{part.description}</Typography>
        </div>
      </div>
      <div>
        <div className={classes.barcode}>
          <Typography>Scan Bin Barcode</Typography>
          <BarcodeInput updateProperty={handleBinBarcode} />
        </div>

        <Typography>Select Bin </Typography>
        <Select className={classes.select} onChange={handleBin} value={bin}>
          {bins.map((item) => (
            <MenuItem key={item.bincode} value={item.bincode}>
              {item.bincode}: {item.binqty}
            </MenuItem>
          ))}
        </Select>
      </div>
      {part.trackByAsset === "true" ? (
        <FormControl>
          <div className={classes.barcode}>
            <Typography>Scan Asset Barcode</Typography>
            <BarcodeInput updateProperty={handleAssetBarcode} />
          </div>

          <Typography>Select Asset</Typography>
          <Select
            className={classes.select}
            onChange={handleAsset}
            value={asset}
            name="selectedAsset"
          >
            {assets.map((asset, i) => (
              <MenuItem key={i} value={asset.code}>
                {asset.code}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <FormControl>
          <Typography>Select Part Quantity</Typography>

          <TextField
            type="number"
            value={partQty}
            onChange={handlePartQty}
            className={classes.select}
          />
        </FormControl>
      )}
      <div className={classes.bottom}>
        <Link to="/">
          <Button variant="contained" color="primary">
            Home
          </Button>
        </Link>
        <Button variant="contained" color="primary" onClick={handleDone}>
          Done
        </Button>
      </div>
      <div>
        <Snackbar
          open={openSuccess}
          autoHideDuration={4000}
          onClose={handleCloseSuccess}
        >
          <SnackbarContent
            className={classes.success}
            message={
              <span className={classes.content}>
                <CheckCircleIcon className={classes.icon} />
                Transaction completed successfully
              </span>
            }
          ></SnackbarContent>
        </Snackbar>
        <Snackbar
          open={openError}
          autoHideDuration={4000}
          onClose={handleCloseError}
        >
          <SnackbarContent
            className={classes.error}
            message={
              <span className={classes.content}>
                <ErrorIcon className={classes.icon} />
                Transaction failed. Please try again
              </span>
            }
          ></SnackbarContent>
        </Snackbar>
      </div>
    </Paper>
  );
}

export default IssuePart;
