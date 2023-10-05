import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import BlockUi from "react-block-ui";
import WSWorkorders from "../../../../tools/WSWorkorders";
import EAMRadio from "eam-components/dist/ui/components/muiinputs/EAMRadio";
import EAMSelect from "eam-components/dist/ui/components/muiinputs/EAMSelect";
import EAMAutocomplete from "eam-components/dist/ui/components/muiinputs/EAMAutocomplete";
import EAMInput from "eam-components/dist/ui/components/muiinputs/EAMInput";
import EAMBarcodeInput from "eam-components/dist/ui/components/muiinputs/EAMBarcodeInput";

const transactionTypes = [
  { code: "ISSUE", desc: "Issue" },
  { code: "RETURN", desc: "Return" },
];

class ContaminationMeasurementDialog extends Component {
  state = {
    partUsage: {},
    partUsageLine: {},
    contaminationMeasurement: {},
    binList: [],
    storeList: [],
    activityList: [],
    loadingDialog: true,
  };

  componentWillMount() {
    this.initNewPartUsage(this.props.workorder);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.workorder.number &&
      nextProps.workorder.number !== this.props.workorder.number
    )
      this.initNewPartUsage(nextProps.workorder);
    else if (
      this.props.isDialogOpen &&
      this.props.isDialogOpen !== nextProps.isDialogOpen
    )
      this.initNewPartUsage(nextProps.workorder);
    else if (!this.props.isDialogOpen && nextProps.isDialogOpen) {
      //If no store and no activity, we init complete
      if (
        !this.state.partUsage.storeCode &&
        !this.state.partUsage.activityCode
      ) {
        this.initNewPartUsage(nextProps.workorder);
      } else {
        /*Just the lists*/
        this.loadLists(nextProps.workorder);
      }
    }
  }

  initNewPartUsage = (workorder) => {
    //Fetch the new part usage object
    WSWorkorders.getInitContaminationMeasurement(workorder)
      .then((response) => {
        this.setState(() => ({
          contaminationMeasurement: response.body.data,
        }));
      })
      .catch((error) => {
        this.props.handleError(error);
      });
    this.setTypeOfMeasurement();
    this.setPredeterminedUnits();
    this.setMeasurementOptions();
    //Load lists
    this.loadLists(workorder);

    //console.log("contaminationMeasurement- response.body.data-", this.state.contaminationMeasurement);
  };

  loadLists = (workorder) => {
    //Set loading
    this.setLoading(true);
    Promise.all([
      WSWorkorders.getPartUsageStores(),
      WSWorkorders.getWorkOrderActivities(workorder.number),
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

  updatePartUsageLineProperty = (key, value) => {
    //console.log("updatePartUsageLineProperty contaminationMeasurement--",this.state.contaminationMeasurement);
    this.setState((prevState) => ({
      contaminationMeasurement: {
        ...prevState.contaminationMeasurement,
        [key]: value,
      },
    }));
    //console.log("After updatePartUsageLineProperty contaminationMeasurement--",this.state.contaminationMeasurement);
  };

  handleTransactionChange = (value) => {
    //Init all properties
    this.updatePartUsageLineProperty("partCode", "");
    this.updatePartUsageLineProperty("partDesc", "");
    this.updatePartUsageLineProperty("assetIDCode", "");
    this.updatePartUsageLineProperty("assetIDDesc", "");
    //Bin list
    this.setState((prevState) => ({ ...prevState, binList: [] }));
    this.updatePartUsageLineProperty("bin", "");
  };

  handleStoreChange = (value) => {
    this.updatePartUsageLineProperty("partCode", "");
    this.updatePartUsageLineProperty("partDesc", "");
    this.updatePartUsageLineProperty("assetIDCode", "");
    this.updatePartUsageLineProperty("assetIDDesc", "");
    //Bin list
    this.setState((prevState) => ({ ...prevState, binList: [] }));
    this.updatePartUsageLineProperty("bin", "");
  };

  handleAssetChange = (value) => {
    //Only if value really change
    if (value && value !== this.state.partUsageLine.assetIDCode) {
      //Clear part and bin selection
      this.updatePartUsageLineProperty("partCode", "");
      this.updatePartUsageLineProperty("partDesc", "");
      this.updatePartUsageLineProperty("bin", "");
      //Complete data for change Asset
      WSWorkorders.getPartUsageSelectedAsset(
        this.props.workorder.number,
        this.state.partUsage.transactionType,
        this.state.partUsage.storeCode,
        value
      )
        .then((response) => {
          const completeData = response.body.data;
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

  handlePartChange = (value) => {
    //Only if value really change
    if (value && value !== this.state.partUsageLine.partCode) {
      //Clear asset and bin selection
      this.updatePartUsageLineProperty("assetIDCode", "");
      this.updatePartUsageLineProperty("assetIDDesc", "");
      this.updatePartUsageLineProperty("bin", "");
      //Load the bin list
      this.loadBinList("", value);
    }
  };

  loadBinList = (binCode, partCode) => {
    if (!partCode) return;
    WSWorkorders.getPartUsageBin(
      this.state.partUsage.transactionType,
      binCode,
      partCode,
      this.state.partUsage.storeCode
    )
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
    //Call the handle save from the parent
    //this.props.handleSave(this.state.partUsage, this.state.partUsageLine);
    //console.log("this.state.contaminationMeasurement--",this.state.contaminationMeasurement);
    this.props.handleSave(this.state.contaminationMeasurement);
  };

  transformActivities = (activities) => {
    return activities.map((activity) => ({
      code: activity.activityCode,
      desc: `${activity.activityCode} - ${activity.tradeCode}`,
    }));
  };

  transformStores = (stores) => {
    return stores.map((store) => ({
      code: store.code,
      desc: `${store.code} - ${store.desc}`,
    }));
  };

  transformBinList = (bins) => {
    return bins.map((bin) => ({
      code: bin.code,
      desc: `${bin.code} - ${bin.desc}`,
    }));
  };

  setLoading = (loadingDialog) => {
    this.setState(() => ({ loadingDialog }));
  };

  setPredeterminedUnits() {
    WSWorkorders.getPredeterminedUnits("PDUC").then((response) => {
      this.setState({ predeterminedunits: response.body.data });
    });
  }
  setMeasurementOptions() {
    WSWorkorders.getMeasurementOptions().then((response) => {
      this.setState({ measurementOptions: response.body.data });
    });
  }

  setTypeOfMeasurement() {
    WSWorkorders.getTypeOfMeasurement().then((response) => {
      this.setState({ typeOfMeasurement: response.body.data });
    });
  }

  render() {
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
          <DialogTitle id="form-dialog-title">
            Add Contamination Measurement
          </DialogTitle>

          <DialogContent id="content">
            <div>
              <BlockUi
                tag="div"
                blocking={this.props.isLoading || this.state.loadingDialog}
              >
                {/*<EAMInput elementInfo={this.props.tabLayout['transactionquantity']}
                                          valueKey="transactionQty"
                                          value={this.state.partUsageLine.transactionQty}
                                         updateProperty={this.updatePartUsageLineProperty}
                                children={this.props.children}/>*/}

                <EAMSelect
                  elementInfo={{
                    ...this.props.tabLayout["typeofmeasurment"],
                    attribute: "R",
                  }}
                  valueKey="typeOfMeasurement"
                  values={this.state.typeOfMeasurement}
                  value={this.state.contaminationMeasurement.typeOfMeasurement}
                  updateProperty={this.updatePartUsageLineProperty}
                  children={this.props.children}
                />

                <EAMSelect
                  elementInfo={{
                    ...this.props.tabLayout["msoption"],
                    attribute: "R",
                  }}
                  valueKey="measurementOptions"
                  values={this.state.measurementOptions}
                  value={this.state.contaminationMeasurement.measurementOptions}
                  updateProperty={this.updatePartUsageLineProperty}
                  children={this.props.children}
                />
                <EAMInput
                  children={this.props.children}
                  elementInfo={{
                    ...this.props.tabLayout["msvalue"],
                    attribute: "R",
                  }}
                  value={this.state.contaminationMeasurement.measurementValue}
                  updateProperty={this.updatePartUsageLineProperty}
                  valueKey="measurementValue"
                />
                <EAMSelect
                  elementInfo={{
                    ...this.props.tabLayout["prdunitscont"],
                    attribute: "R",
                  }}
                  valueKey="preDeterminedUnits"
                  values={this.state.predeterminedunits}
                  value={this.state.contaminationMeasurement.preDeterminedUnits}
                  updateProperty={this.updatePartUsageLineProperty}
                  children={this.props.children}
                />

                <EAMInput
                  children={this.props.children}
                  elementInfo={this.props.tabLayout["contcomment"]}
                  value={this.state.contaminationMeasurement.comment}
                  updateProperty={this.updatePartUsageLineProperty}
                  valueKey="comment"
                />
              </BlockUi>
            </div>
          </DialogContent>

          <DialogActions>
            <div>
              <Button
                onClick={this.props.handleCancel}
                color="primary"
                disabled={this.props.isLoading || this.state.loadingDialog}
              >
                Cancel
              </Button>
              <Button
                onClick={this.handleSave}
                color="primary"
                disabled={this.props.isLoading || this.state.loadingDialog}
              >
                Save
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ContaminationMeasurementDialog;
