import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "./partUsageTable.css";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@material-ui/core";
import BinData from "./BinData";
import WSPicktickets from "../../../../tools/WSPicktickets";
import WSWorkorders from "../../../../tools/WSWorkorders";

export default function PartUsageTable(props) {
  const headers = [
    "Part",
    "Description",
    "Available Qty",
    "Issued Qty",
    "Required Qty",
    "Selected Qty",
  ];
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [state, setState] = useState(data);
  const [selectedValues, setSelectedValues] = useState([]);
  const [open, setOpen] = useState(false);
  const [largeScreen, setLargeScreen] = useState(window.innerWidth);
  window.addEventListener("resize", () => {
    setLargeScreen(window.innerWidth);
  });

  const history = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (props.pickNumber) {
        await WSPicktickets.getPartUsagePickTicketList(props.pickNumber)
          .then((res) => {
            console.log(res.body.data);
            setData(res.body.data);
            setSelectedValues(
              res.body.data.map((item, index) => {
                if (item.trackbyAsset === "true") {
                  return { index: index, partCode: "", binId: "", assetId: "" };
                } else {
                  return {
                    index: index,
                    partCode: "",
                    binId: "",
                    partQtyInput: "",
                  };
                }
              })
            );
            setLoading(false);
          })
          .catch((error) => {
            props.handleError(error);
            setLoading(false);
          });
      }
    };
    fetchData();
  }, []);
  const colorChange = (e, c) => {
    setState((prev) => {
      return {
        ...prev,
        selectedQty: e,
        color: c,
      };
    });
  };

  let partUsage = {};
  const handleClick = () => {
    if (!props.validateFields()) {
      this.props.showError("Please fill all the required fields");
      return;
    }
    setLoading(true);
    setOpen(true);
    partUsage["storeCode"] = props.pickticket.store;
    partUsage["departmentCode"] = props.departmentCode;
    partUsage["transactionType"] = "ISSUE";
    partUsage["workOrderNumber"] = props.pickticket.workorder;
    partUsage["activityCode"] = props.pickticket.activity;
    partUsage["equipmentCode"] = props.pickticket.equipmentCode;
    partUsage["pickticket"] = props.pickticket.picklist;
    selectedValues.map((item) => {
      if (item.assetId !== "" && item.assetId !== undefined) {
        if (partUsage.transactionlines === undefined) {
          partUsage.transactionlines = [
            {
              bin: item.binId,
              assetIDCode: item.assetId,
              partCode: item.partCode,
            },
          ];
        } else {
          partUsage.transactionlines.push({
            bin: item.binId,
            assetIDCode: item.assetId,
            partCode: item.partCode,
          });
        }
      } else if (item.partQtyInput !== "" && item.partQtyInput !== undefined) {
        if (partUsage.transactionlines === undefined) {
          partUsage.transactionlines = [
            {
              bin: item.binId,
              transactionQty: item.partQtyInput,
              partCode: item.partCode,
            },
          ];
        } else {
          partUsage.transactionlines.push({
            bin: item.binId,
            transactionQty: item.partQtyInput,
            partCode: item.partCode,
          });
        }
      } else {
        return;
      }
      console.log(partUsage);
    });
    if (props.pickticket.equipmentCode != "") {
      partUsage["transactionOn"] = "EQUIPMENT";
    }

    WSWorkorders.createPartUsage(partUsage)
      .then((response) => {
        props.showNotification("Transaction completed successfully");
        setTimeout(() => {
          history.push("/pickticketissuereturn");
        }, 4000);

        setLoading(false);
      })
      .catch((error) => {
        props.handleError(error);
        setLoading(false);
      });
    setLoading(false);
    setOpen(false);
  };

  if (loading) {
    return <div>Loading Part Info...</div>;
  } else {
    if (largeScreen > 400) {
      return (
        <div style={{ width: "100%" }}>
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              justifyContent: "space-between",
            }}
          >
            {headers.map((header, i) => (
              <li key={i}>{header}</li>
            ))}
          </ul>
          {data.map((partInfo, i) => (
            <Accordion key={i} style={{ overflow: "hidden" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{
                  backgroundColor:
                    parseInt(partInfo.issuedQty) >=
                    parseInt(partInfo.requiredQty)
                      ? "#DDF7E7"
                      : partInfo.color,
                }}
                key={i}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell key={i} align="left" width="17%">
                        {partInfo.partCode}
                      </TableCell>
                      <TableCell align="left" width="20%">
                        {partInfo.partDesc}
                      </TableCell>
                      <TableCell align="left" width="17%">
                        {partInfo.storeQty}
                      </TableCell>
                      <TableCell align="left" width="17%">
                        {partInfo.issuedQty === "" ||
                        partInfo.issuedQty === null
                          ? "0"
                          : partInfo.issuedQty}
                      </TableCell>
                      <TableCell align="left" width="17%">
                        {partInfo.requiredQty}
                      </TableCell>
                      <TableCell align="left" width="17%">
                        {partInfo.selectedQty}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionSummary>
              <AccordionDetails className="MuiAccordionDetails-root">
                <BinData
                  parentIndex={i}
                  partInfo={partInfo}
                  partCode={partInfo.partCode}
                  store={props.pickticket.store}
                  colorChange={colorChange}
                  barcode={barcode}
                  selectedValues={selectedValues}
                  setSelectedValues={setSelectedValues}
                />
              </AccordionDetails>
            </Accordion>
          ))}
          <Button
            variant="contained"
            size="small"
            color="primary"
            style={{ float: "right", marginTop: "20px" }}
            onClick={handleClick}
          >
            Done
          </Button>
        </div>
      );
    } else {
      return (
        <div style={{ width: "100%" }}>
          {data.map((partInfo, i) => (
            <Accordion key={i} style={{ overflow: "hidden" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                style={{
                  backgroundColor:
                    parseInt(partInfo.issuedQty) >=
                    parseInt(partInfo.requiredQty)
                      ? "#DDF7E7"
                      : partInfo.color,
                }}
                key={i}
              >
                <Table>
                  <TableBody>
                    <TableRow
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <TableCell>Part: {partInfo.partCode}</TableCell>
                      <TableCell>Description: {partInfo.partDesc}</TableCell>
                      <TableCell>
                        Available Quantity: {partInfo.storeQty}
                      </TableCell>
                      <TableCell>
                        Issued Quantity: {partInfo.issuedQty}
                      </TableCell>
                      <TableCell>
                        Required Quantity: {partInfo.requiredQty}
                      </TableCell>
                      <TableCell>
                        Selected Quantity: {partInfo.selectedQty}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionSummary>
              <AccordionDetails className="MuiAccordionDetails-root">
                <BinData
                  parentIndex={i}
                  partInfo={partInfo}
                  partCode={partInfo.partCode}
                  store={props.pickticket.store}
                  colorChange={colorChange}
                  barcode={barcode}
                  selectedValues={selectedValues}
                  setSelectedValues={setSelectedValues}
                />
              </AccordionDetails>
            </Accordion>
          ))}
          <Button
            variant="contained"
            size="small"
            color="primary"
            style={{ float: "right", marginTop: "20px" }}
            onClick={handleClick}
          >
            Done
          </Button>
        </div>
      );
    }
  }
}
