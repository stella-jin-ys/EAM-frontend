import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "./PartTable.css";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Typography,
} from "@material-ui/core";
import BinData from "./BinData";

export default function PartTable(props) {
  const headers = [
    "Part",
    "Description",
    "Selected Qty",
    "Available Qty",
    "Required Qty",
  ];
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [state, setState] = useState(data);
  const [selectedValues, setSelectedValues] = useState([]);
  const [successCount, setSuccessCount] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (props.pickNumber) {
        fetch(`http://localhost:3001/picktickets/${props.pickNumber}`)
          .then((res) => {
            setData(res.body.data);
            setSelectedValues(
              res.body.data.map((item, index) => {
                if (item.trackbyAsset == "true") {
                  return { binId: "", assetId: "" };
                } else {
                  return {
                    index: index,
                    partCode: "",
                    binPartQty: [{ index: 0, binId: "", partQtyInput: "" }],
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

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((newProgress) => (newProgress >= 100 ? 0 : newProgress + 10));
    }, 500);
    return clearInterval(timer);
  }, []);

  const selectedQtyChange = (e, c) => {
    setState((prev) => {
      return {
        ...prev,
        issuedQty: e,
        color: c,
      };
    });
  };

  return (
    <div width="100%">
      <Typography>Pickticket number {props.item}</Typography>
      <div>
        <ul
          style={{
            display: "flex",
            justifyContent: "space-around",
            listStyle: "none",
            alignItems: "flex-start",
          }}
        >
          {headers.map((header, i) => (
            <li key={i} align="left" width="10px" fontWeight="bold">
              {header}
            </li>
          ))}
        </ul>
        {data.map((partInfo, i) => (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              style={{ backgroundColor: partInfo.color }}
              key={i}
            >
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell key={i} align="left" width="10px">
                      {partInfo.partCode}
                    </TableCell>
                    <TableCell align="left" width="10px">
                      {partInfo.partDesc}
                    </TableCell>
                    <TableCell align="left" width="10px">
                      {partInfo.issuedQty}
                    </TableCell>
                    <TableCell align="left" width="10px">
                      {partInfo.storeQty}
                    </TableCell>
                    <TableCell align="left" width="10px">
                      {partInfo.requiredQty}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </AccordionSummary>
            <AccordionDetails
              style={{
                maxWidth: "800px",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              <BinData
                parentIndex={i}
                partInfo={partInfo}
                partCode={partInfo.partCode}
                store={props.pickticket.store}
                selectedQtyChange={selectedQtyChange}
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
          onClick={props.handleFinalSave}
        >
          Done
        </Button>
      </div>
    </div>
  );
}
