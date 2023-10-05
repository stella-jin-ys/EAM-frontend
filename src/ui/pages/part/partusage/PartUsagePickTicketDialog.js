import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import BlockUi from "react-block-ui";
import WSPicktickets from "../../../../tools/WSPicktickets";
import EAMRadio from "eam-components/dist/ui/components/muiinputs/EAMRadio";
import EAMSelect from "eam-components/dist/ui/components/muiinputs/EAMSelect";
import EAMAutocomplete from "eam-components/dist/ui/components/muiinputs/EAMAutocomplete";
import EAMInput from "eam-components/dist/ui/components/muiinputs/EAMInput";
import EAMBarcodeInput from "eam-components/dist/ui/components/muiinputs/EAMBarcodeInput";
import PartUsage from "../../work/partusage/PartUsage";

class PartUsagePickTicketDialog extends Component {
  state = {
    partUsage: {},
    partUsageLine: {},
    result: [],
    binList: [],
    storeList: [],
    activityList: [],
    loadingDialog: true,
    partCode: "",
    trackbyAsset: "",
    binSelect: "",
    storeCode: "",
    binCode: "",
    myArray: [],
  };

  componentWillMount() {
    this.loadBinList(this.props.partCode);
  }

  componentWillReceiveProps(nextProps) {
    let arr = [];
    let element = { code: "21227", desc: "21227", field1: null };
    arr.push(element);

    this.setState({ myArray: arr });
    console.log("next props data:", nextProps);
    this.setState({
      partCode: nextProps.partCode,
      storeCode: nextProps.pickticket.store,
      trackbyAsset: nextProps.trackbyAsset,
    });
    this.loadBinList(nextProps.partCode, nextProps.pickticket.store);
    //Set the values to blank when part dialog is open
    this.setState({
      partUsageLine: {
        partCode: nextProps.partCode,
        trackbyAsset: nextProps.trackbyAsset,
        storeQty: nextProps.storeQty,
        partDesc: nextProps.partDesc,
        requiredQty: nextProps.requiredQty,
        issuedQty: nextProps.issuedQty,
        //transactionQty:nextProps.transactionQty,
      },
    });
  }

  loadLists = (pickticket) => {
    //Set loading
    this.setLoading(true);
    Promise.all([
      WSPicktickets.getPartUsageStores(),
      WSPicktickets.getWorkOrderActivities(pickticket.number),
    ])
      .then((responses) => {
        this.setState(() => ({
          storeList: this.transformStores(responses[0].body.data),
        }));
        this.setState(() => ({
          activityList: this.transformActivities(responses[1].body.data),
        }));
        this.setLoading(false);
      })
      .catch((error) => {
        this.props.handleError(error);
        this.setLoading(false);
      });
    //Bin list

    this.setState((prevState) => ({ ...prevState, binList: [] }));
  };

  updatePartUsageProperty = (key, value) => {
    this.setState((prevState) => ({
      partUsage: {
        ...prevState.partUsage,
        [key]: value,
      },
    }));
  };

  availQty = (binSelect) => {
    let c = 0;
    this.state.binList.map((bin) => {
      if (binSelect === bin.code) c = bin.field2;
    });
    return c;
  };

  updatePartUsageLineProperty = (key, value) => {
    if (key === "bin") {
      this.setState({ binSelect: value });
    }

    this.setState((prevState) => ({
      partUsageLine: {
        ...prevState.partUsageLine,
        availableqty: this.availQty(this.state.binSelect),
        bin: this.state.binSelect,
        [key]: value,
      },
    }));
  };

  handleAssetChange = (value) => {
    //Only if value really change
    if (value && value !== this.state.partUsageLine.assetIDCode) {
      //Clear part and bin selection
      this.updatePartUsageLineProperty("partCode", "");
      this.updatePartUsageLineProperty("partDesc", "");
      this.updatePartUsageLineProperty("bin", "");
      //Complete data for change Asset
      WSPicktickets.getPartUsageSelectedAsset(
        this.props.pickticket.number,
        this.state.partUsage.transactionType,
        this.state.partUsage.storeCode,
        value
      )
        .then((response) => {
          const completeData = response.body.data;
          //console.log("complete asset data: " , completeData);
          //Bin code
          this.updatePartUsageLineProperty("bin", completeData.binCode);
          //Part Code
          this.updatePartUsageLineProperty("partCode", completeData.partCode);
          //Load the list of bins
          this.loadBinList(completeData.binCode, completeData.partCode);
        })
        .catch((error) => {
          this.props.handleError(error);
        });
    }
  };

  ttt = () => {
    let arr = [];
    arr.push("21670");
    arr.push("string 2");
    //this.setState({ myArray: myArray});
    //console.log("my array: ", arr);
    return arr;
    //return myArray;
  };

  handleBinChange = () => {
    //Set loading
    console.log("bin data", this.state.partUsageLine.bin);
    if (
      this.state.partUsageLine.bin != null &&
      this.state.partUsageLine.bin != ""
    ) {
      console.log("yesssss");
      WSPicktickets.getPartUsageSelectedAsset(
        this.state.partCode,
        this.state.storeCode,
        this.state.partUsageLine.bin
      )
        .then((response) => {
          const completeData = response.body.data;
          console.log("bin change asset value: ", completeData);
          this.setState(() => ({
            assetList: this.transformAsset(completeData),
          }));
        })
        .catch((error) => {
          this.props.handleError(error);
        });
    }
  };

  loadBinList = (partCode, storeCode) => {
    if (!partCode) return;
    WSPicktickets.getBins(partCode, storeCode)
      .then((response) => {
        this.setState(() => ({
          binList: this.transformBinList(response.body.data),
        }));
      })
      .catch((error) => {
        this.props.handleError(error);
      });
  };

  handleSave = () => {
    console.log("selected bin data: ", this.state.partUsageLine.bin);
    //Call the handle save from the parent
    this.state.partUsageLine.transactionQty >
    this.state.partUsageLine.availableqty
      ? alert("Trans Qty should be less to available qty")
      : this.props.handleSave(this.state.partUsage, this.state.partUsageLine);
    this.setState({ open: true });
  };

  transformAsset = (assets) => {
    return assets.map((asset) => ({
      code: asset.code,
      desc: `${asset.code} - ${asset.desc}`,
    }));
  };

  transformStores = (stores) => {
    return stores.map((store) => ({
      code: store.code,
      desc: `${store.code} - ${store.desc}`,
    }));
  };

  forCheck = () => {
    console.log("yyeeeee");
  };

  transformBinList = (bins) => {
    return bins.map(
      (bin) => ({
        code: bin.code,
        desc: `${bin.code} - ${bin.desc} ` + `${bin.qtyOnHand}`,
        field2: 20,
      }) //bin.qtyOnHand})
    );
  };

  setLoading = (loadingDialog) => {
    this.setState(() => ({ loadingDialog }));
  };

  render() {
    /*console.log("trackbyAsset-",this.state.trackbyAsset);
        console.log("this.state.loadingDialog--",this.state.loadingDialog);
        console.log("this.state.binList-", this.state.binList);
        console.log("this.state.partCode-111", this.state.partCode);
        console.log("this.state.partCode-11-",this.state.trackbyAsset);
        console.log("this.props.tabLayout['transactionquantity']-111", this.props.tabLayout['transactionquantity']);
        // we need to make the logic to set the partUsuage type if WO is selected or equipment
        console.log("pickticket msg:",this.props.pickticket.equipmentCode);
        //this.setState({bin: });*/

    //console.log("ttt value: ", this.state.myArray)
    if (this.state.trackbyAsset === "true") {
      console.log("props value in if: ", this.props);

      //console.log("bin code: ", this.props.tabLayout['bincode']);

      console.log("asset id: ", this.props.tabLayout["assetid"]);

      console.log("...................................................");

      this.props.tabLayout["transactionquantity"].readonly = true;
      //this.props.tabLayout['bincode'].readonly = false;
      this.props.tabLayout["assetid"].readonly = false;
      this.props.tabLayout["availableqty"].readonly = false;
    } else {
      this.props.tabLayout["transactionquantity"].readonly = false;
      this.props.tabLayout["assetid"].readonly = true;
      //this.props.tabLayout['bincode'].readonly = true;
      this.props.tabLayout["availableqty"].readonly = true;
    }

    //console.log("this.props.tabLayout['transactionquantity']-222", this.props.tabLayout['transactionquantity'].readonly);
    return (
      <div>
        <Dialog
          fullwidth
          id="addPartUsageDialog"
          open={this.props.isDialogOpen}
          onClose={this.handleCancel}
          aria-labelledby="form-dialog-title"
          disableBackdropClick={true}
        >
          <DialogTitle id="form-dialog-title">Issue Part</DialogTitle>

          <DialogContent id="content">
            <div>
              <BlockUi tag="div">
                <EAMSelect
                  elementInfo={this.props.tabLayout["bincode"]}
                  valueKey="bin"
                  values={this.state.binList}
                  value={this.state.partUsageLine.bin}
                  updateProperty={this.updatePartUsageLineProperty}
                  onChangeValue={this.handleBinChange}
                  children={this.props.children}
                />
                <EAMBarcodeInput
                  updateProperty={(value) => {
                    this.handleAssetChange(value);
                    this.updatePartUsageLineProperty("assetIDCode", value);
                  }}
                  right={0}
                  top={20}
                >
                  <EAMSelect
                    elementInfo={this.props.tabLayout["assetid"]}
                    valueKey="assetIDCode"
                    values={this.state.assetList}
                    value={this.state.partUsageLine.assetIDCode}
                    onChangeValue={this.handleBinChange}
                    updateProperty={this.updatePartUsageLineProperty}
                    children={this.props.children}
                  />
                </EAMBarcodeInput>

                <EAMInput
                  elementInfo={this.props.tabLayout["availableqty"]}
                  valueKey="availableqty"
                  value={this.state.partUsageLine.availableqty}
                  updateProperty={this.updatePartUsageLineProperty}
                  children={this.props.children}
                />

                <EAMSelect
                  elementInfo={this.props.tabLayout["assetid"]}
                  //valueKey="assetIDCode"
                  //values={this.state.assetList}
                  values={this.state.myArray}
                  onChange={this.forCheck}
                  value={this.state.myArray.code}
                  //value={this.state.partUsageLine.assetIDCode}
                  updateProperty={this.updatePartUsageLineProperty}
                  children={this.props.children}
                />

                <EAMInput
                  elementInfo={this.props.tabLayout["transactionquantity"]}
                  valueKey="transactionQty"
                  value={this.state.partUsageLine.qty}
                  updateProperty={this.updatePartUsageLineProperty}
                  children={this.props.children}
                />
              </BlockUi>
            </div>
          </DialogContent>

          <DialogActions>
            <div>
              <Button onClick={this.props.handleCancel} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleSave.bind(this)} color="primary">
                Save
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default PartUsagePickTicketDialog;
