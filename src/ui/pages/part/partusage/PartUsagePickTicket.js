import React, { Component } from "react";
import EISPanel from "eam-components/dist/ui/components/panel";
import WSPicktickets from "../../../../tools/WSPicktickets";
import EISTable from "eam-components/dist/ui/components/table";
import WSWorkorders from "../../../../tools/WSWorkorders";
import PartUsagePickTicketDialog from "./PartUsagePickTicketDialog";
import BlockUi from "react-block-ui";
import PartUsageTable from "./PartUsageTable";

const buttonStyle = {
  position: "relative",
  float: "left",
  bottom: "-13px",
  left: "5px",
};

class PartUsagePickTicket extends Component {
  headers = [
    "",
    "Part",
    "Asset",
    "Description",
    "Available Qty",
    "Required Qty",
    "Issued Qty",
    // "Bin",
    "Bin-Data",
    //"Unit Price",
    "AddPartUsagesButton",
  ];
  propCodes = [
    "seqNo",
    "partCode",
    "assetId",
    "partDesc",
    "Available Qty", //"partStockList",
    "Required Qty",
    "Issued Qty",
    "binData",
    //"unitPrice",
    "addPartUsage",
  ];
  linksMap = new Map([
    ["partCode", { linkType: "fixed", linkValue: "part/", linkPrefix: "/" }],
    [
      "addPartUsage",
      {
        linkType: "nonabsolute",
        linkValue: "{this.openPartUsageDialog}",
        linkPrefix: "",
      },
    ],
  ]);

  state = {
    data: [],
    isDialogOpen: false,
    isLoading: false,
    partCode: "",
    trackbyAsset: "",
    selectedRowsPartUsageLine: [],
    seqNum: "",
    check: [],
    sample: {},
    totTransQty: 0,
    colorEnable: false,
  };

  children = {};
  partUsageLines = [];

  componentWillMount() {
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    //console.log("nextProps.pickticket.picklist", nextProps.pickticket.picklist);
    if (
      nextProps.pickticket.picklist &&
      nextProps.pickticket.picklist !== this.props.pickticket.picklist
    ) {
      //this.fetchData(nextProps);
    } else if (!nextProps.pickticket.picklist) {
      this.setState(() => ({
        data: [],
      }));
    }
  }

  fetchData = (props) => {
    this.setState(() => ({ isLoading: true }));
    let pickNumber = props.pickticket.picklist;
    if (pickNumber) {
      WSPicktickets.getPartUsagePickTicketList(pickNumber)
        .then((response) => {
          this.setState(() => ({
            data: response.body.data,
            isLoading: false,
          }));
        })
        .catch((error) => {
          this.props.handleError(error);
          this.setState(() => ({ isLoading: false }));
        });
    }
  };

  openPartUsageDialog = (rowData) => {
    console.log("dialog row data: ", rowData);
    this.state.data.map((row) => {
      if (row.partCode === rowData.partCode) {
        this.setState(() => ({
          //sample: row,
          isDialogOpen: true,
          partCode: rowData.partCode,
          partDesc: rowData.partDesc,
          requiredQty: rowData.requiredQty,
          issuedQty: rowData.issuedQty,
          // qty:rowData.transactionQty,
          seqNum: rowData.seqNo,
          partStockList: rowData.partStockList,
        }));
      }
    });
  };

  closePartUsageDialog = () => {
    this.setState(() => ({ isDialogOpen: false }));
  };

  setAssetIdAndQty = (partUsageLine) => {
    this.state.data.map((row) => {
      if (row.seqNo === this.state.seqNum) {
        row.assetId = partUsageLine.assetIDCode;
        row.availableQuantity = partUsageLine.availableqty;
        row.binData = partUsageLine.bin;
      }
    });
  };

  handleAddPartUsage = (partUsage, partUsageLine) => {
    partUsageLine["partCode"] = this.state.partCode;
    //let check = partUsageLine.bin;
    this.partUsageLines.push(partUsageLine);

    this.setState(() => ({ selectedRowsPartUsageLine: this.partUsageLines }));
    this.setState(() => ({ partUsage: partUsage }));
    let check = this.state.data.length - 1;
    partUsageLine.seqNo = check + 1;

    let ch = +this.state.totTransQty + +partUsageLine.transactionQty;
    this.setState({ totTransQty: ch });
    console.log("total transaction qty using ch: ", ch);

    //this.closePartUsageDialog();
    //this.setState(() => ({isLoading: false}));
    //Validate fields first
    //this.handleAddPartUsageSave(partUsage, this.state.partUsageLines);
    this.setAssetIdAndQty(partUsageLine);
    var rows = this.state.data;

    if (ch <= partUsageLine.availableqty) {
      console.log(
        "less tot: ",
        ch + ", " + " availqty: ",
        partUsageLine.availableqty
      );
      //rows.push(partUsageLine);
      this.state.data.push(partUsageLine);
    } else {
      alert("Available Qty limit exceeded");
      console.log("part usage Line in else:" + partUsageLine);
      partUsageLine.bin = "";
      this.setState({ colorEnable: true });
      //this.state.data.push(partUsageLine);

      //rows.push(partUsageLine);
    }
    let chk = "0";
    let s = rows.map((data) => {
      chk = data.bin;
      return chk;
    });
    this.closePartUsageDialog();
  };

  handleAddPartUsageFinalSave = () => {
    //let partUsage = this.state.partUsage;
    //let partUsageLine = this.state.selectedRowsPartUsageLine;
    if (!this.validateFields()) {
      this.props.showError("Please fill all the required fields");
      return;
    }
    this.setState(() => ({ isLoading: true }));
    //if (partUsageLine.length > 0) {
    //partUsage.transactionlines = this.state.partUsageLine;
    let partUsage = {};
    partUsage["storeCode"] = "F03";
    partUsage["departmentCode"] = "TD-EM-AMM";
    partUsage["transactionType"] = "ISSUE";
    partUsage["workOrderNumber"] = "";
    partUsage["activityCode"] = "";
    partUsage["equipmentCode"] = "+A12";
    partUsage["pickticket"] = "10745";

    partUsage.transactionlines = [
      {
        bin: "100101",
        transactionQty: "3",
        partCode: "10006",
      },
    ];
    /* partUsage.transactionlines = partUsageLine;
      partUsage["storeCode"] = this.props.pickticket.store;
      partUsage["departmentCode"] = this.props.userData.eamAccount.department;
      partUsage["transactionType"] = "ISSUE";
      partUsage["workOrderNumber"] = this.props.pickticket.workorder;
      partUsage["activityCode"] = this.props.pickticket.activity;
      partUsage["equipmentCode"] = this.props.pickticket.equipmentCode;
      partUsage["pickticket"] = this.props.pickticket.picklist; */

    //by default WORKORDER is transaction type, if equipment is selected make it EQUIPMENT
    if (this.props.pickticket.equipmentCode != "") {
      partUsage["transactionOn"] = "EQUIPMENT";
    }

    //Remove transaction info prop
    delete partUsage.transactionInfo;
    this.setState(() => ({ isLoading: true }));
    //Save the record
    WSWorkorders.createPartUsage(partUsage)
      .then((response) => {
        //Notification
        this.props.showNotification("Part usage created successfully");
        //Close dialog
        this.closePartUsageDialog();
        //Init the list of part usage again
        this.fetchData(this.props);

        this.setState(() => ({ isLoading: false }));
      })
      .catch((error) => {
        this.props.handleError(error);
        this.setState(() => ({ isLoading: false }));
        //this.fetchData(this.props);
      });
    /* } else {
      this.fetchData(this.props);
    } */
  };

  validateFields = () => {
    let validationPassed = true;
    Object.keys(this.children).forEach((key) => {
      if (!this.children[key].validate()) {
        validationPassed = false;
      }
    });
    return validationPassed;
  };

  render() {
    if (this.state.partCode) {
    }
    //console.log("total transaction qty in render: " , this.state.totTransQty);

    if (this.state.isLoading) {
      return (
        <BlockUi tag="div" blocking={true}>
          <div>Loading Part usage ...</div>
        </BlockUi>
      );
    } else {
      return (
        <BlockUi className="first check" tag="div" blocking={false}>
          <div
            className="check"
            style={{
              width: "100%",
              height: "100%",
              overflowX: "auto",
              minWidth: "700",
            }}
          >
            <PartUsageTable
              pickNumber={this.props.pickticket.picklist}
              data={this.state.data}
              headers={this.headers}
              handleFinalSave={this.handleAddPartUsageFinalSave}
              propCodes={this.propCodes}
              linksMap={this.linksMap}
              onClickCall={this.openPartUsageDialog.bind(this)}
              colorEnable={this.state.colorEnable}
              handleSave={this.handleAddPartUsage}
              showNotification={this.props.showNotification}
              handleError={this.props.handleError}
              handleCancel={this.closePartUsageDialog}
              tabLayout={this.props.tabLayout}
              isDialogOpen={this.state.isDialogOpen}
              pickticket={this.props.pickticket}
              isLoading={this.state.isLoading}
              partDesc={this.state.partDesc}
              partCode={this.state.partCode}
              requiredQty={this.state.requiredQty}
              issuedQty={this.state.issuedQty}
              //transactionQty={this.state.qty}
              storeQty={this.state.storeQty}
              trackbyAsset={this.state.trackbyAsset}
              children={this.children}
            />
          </div>
          <PartUsagePickTicketDialog
            handleSave={this.handleAddPartUsage}
            showNotification={this.props.showNotification}
            handleError={this.props.handleError}
            handleCancel={this.closePartUsageDialog}
            tabLayout={this.props.tabLayout}
            isDialogOpen={this.state.isDialogOpen}
            pickticket={this.props.pickticket}
            isLoading={this.state.isLoading}
            partDesc={this.state.partDesc}
            partCode={this.state.partCode}
            requiredQty={this.state.requiredQty}
            issuedQty={this.state.issuedQty}
            //transactionQty={this.state.qty}
            storeQty={this.state.storeQty}
            trackbyAsset={this.state.trackbyAsset}
            children={this.children}
          />
        </BlockUi>
      );
    }
  }
}

export default PartUsagePickTicket;
