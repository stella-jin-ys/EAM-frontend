import React, { useEffect, useState } from "react";
import AssetDetails from "./AssetDetails";
import PartDetails from "./PartDetails";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { TextField, Typography } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import WSPicktickets from "../../../tools/WSPicktickets";
import { Barcode } from "mdi-material-ui";
import BinToBinBarcode from "./BinToBinBarcode";
import BarcodeInput from './BarcodeInput'

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

function BinToBin(props) {
  console.log(props);
  const classes = useStyles();
  const [input, setInput] = useState("");
  const [storeInput, setStoreInput] = useState("");
  const [binInput, setBinInput] = useState("");
  const [showAsset, setShowAsset] = useState(false);
  const [showPart, setShowPart] = useState(false);
  const [stores, setStores] = useState([]);
  const [parts, setParts] = useState([]);
  const [assets, setAssets] = useState([]);
  const [bins, setBins] = useState([]);

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleStoreInput = (event) => {
    setStoreInput(event.target.value);
  };

  const handleBinInput = (event) => {
    setBinInput(event.target.value);
  };

  useEffect(() => {
    input === "asset" ? setShowAsset(true) : setShowAsset(false);
    input === "part" ? setShowPart(true) : setShowPart(false);
  }, [input]);

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
      const res = await WSPicktickets.autocompletePartClass();
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
        <BarcodeInput /> 
        <TextField variant='standard' type='input' />
      </FormControl>

      <FormControl className={classes.formControl}>
      <Typography component="div">Quantity Available</Typography>
        <TextField variant='standard' type='input' disabled/>
      </FormControl>

      <FormControl className={classes.formControl}>
      <Typography component="div">Quantity to Transfer *</Typography>
        <TextField variant='standard' type='number' />
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
      {/* <div>
          {showAsset && <AssetDetails />}
          {showPart && <PartDetails />}
        </div> */}
    </div>
  );
}

export default BinToBin;















/* import React, { Component } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import { Barcode } from "mdi-material-ui";
import WSPicktickets from "../../../tools/WSPicktickets";
import { Typography } from "@material-ui/core";

class BinToBinBarcode extends Component {
  iconStyle = {
    width: 40,
      height: 40,
      float:'right'
  };

  printBarcode() {
    let { code } =
      this.props.part;
    // expand custom fields
    // expand user defined fields
    let barcodeInput = {
      type: "P", // Set print for PARTS
      variables: [
        {
          code: this.props.part.code, // Send info for main code to print
          // Send all fields of part so labels may be created out of any available field
        },
      ],
    };
    WSPicktickets.printBarcode
      .bind(WSPicktickets)(barcodeInput)
      .then((response) => {
        this.props.showNotification(response.body.data);
      })
      .catch((error) => {
        if (error && error.response && error.response.body) {
          this.props.showError(error.response.body.data);
        }
        this.props.handleError(error);
      });
  }

  render() {
    return (
        <div >
            <Typography component="div">Scan Barcode *
            <Barcode style={this.iconStyle} onClick={this.printBarcode.bind(this)} /> </Typography>
         </div>
    );
  }
}

export default BinToBinBarcode; */













/* 
import React, { Component } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import IconButton from '@material-ui/core/IconButton';
import { BarcodeScan } from 'mdi-material-ui';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

class BarcodeInput extends Component {
    codeReader = null;

    state = {
        open: false,
        showBarcodeButton: false,
        result: ''
    };

    async componentDidMount() {
        const deviceCount = await navigator.mediaDevices.enumerateDevices();
        if (deviceCount.length > 0 && navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            this.setState({ showBarcodeButton: true });
        }
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
        this.codeReader.reset();
    };

    startScanner() {
        this.codeReader = new BrowserMultiFormatReader();
        this.codeReader
            .listVideoInputDevices()
            .then((videoInputDevices) => this.startDecoding(videoInputDevices[0].deviceId))
            .catch((err) => console.error(err));
    }

    startDecoding = () => {
        this.codeReader
            .decodeFromInputVideoDevice(undefined, 'video')
            .then((result) => {
                this.onDetectedCallback(result.text);
                this.codeReader.reset();
                this.handleClose();
            })
            .catch((err) => console.error(err));
    };


    onChangeHandler = (e) => {
        this.props.updateProperty(e.target.value);
        console.log(e.target.value);
        if (this.props.onChangeValue) {
            this.props.onChangeValue(e.target.value);
        }
    };

    onDetectedCallback() {
        this.props.updateProperty();
        this.setState({ open: false });
    }

    render() {
        let iconButtonStyle = {
            float: 'right',
            top: this.props.top || 30,
            right: this.props.right || -2,
            backgroundColor: 'white',
            width: 32,
            height: 32,
            zIndex: 100,
            padding: 0,
        };

        // Display just the children when no support for user media
        if (!this.state.showBarcodeButton) {
            return <div >{this.props.children}</div>;
        }

        // Active quagga when support for user media
        return (
            <div >
                {this.props.children}
            <label htmlFor="Scan part id">Scan Barcode here *</label>
                <IconButton style={iconButtonStyle} onClick={this.handleClickOpen.bind(this)}>
                    <BarcodeScan />
                </IconButton>

                <Dialog
                    TransitionProps={{
                        onEntered: () =>
                            this.startScanner(this.onDetectedCallback.bind(this), this.handleClose.bind(this)),
                    }}
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent style={{ maxWidth: 320, maxHeight: 320 }}>
                        <video id="video" width="200" height="200"></video>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default BarcodeInput;

 */

