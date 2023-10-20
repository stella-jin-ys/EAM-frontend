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
  Paper,
} from "@material-ui/core";
import BinData from "./BinData";
import { useParams } from "react-router-dom";
import Header from "../homepage/Header";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  main: {
    margin: "auto",
  },
  details: {
    width: "80%",
    margin: "20px auto",
  },
  ui: {
    display: "flex",
    justifyContent: "space-around",
    listStyle: "none",
    alignItems: "flex-start",
  },
  AccordionDetails: {
    maxWidth: "800px",
    display: "flex",
    flexWrap: "wrap",
  },
  tablerow: {
    display: "flex",
    flexDirection: "column",
  },
  btn: {
    float: "right",
    marginTop: "20px",
  },
}));

export default function PartTable(props) {
  const classes = useStyles();
  const { number } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [state, setState] = useState(data);
  const [selectedValues, setSelectedValues] = useState([]);
  const [screen, setScreen] = useState(window.innerWidth);
  window.addEventListener("resize", () => {
    setScreen(window.innerWidth);
  });

  const headers = [
    "Part",
    "Description",
    "Selected Qty",
    "Available Qty",
    "Required Qty",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if ({ number }) {
        fetch(`http://localhost:3001/pickticket`)
          .then((res) => {
            if (res.status === 200) {
              return res.json();
            }
          })
          .then((data) => {
            console.log(data);
            setData(data);
            setSelectedValues(
              data.map((item, index) => {
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
            console.log(error);
          });
      }
    };
    fetchData();
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

  if (loading) {
    return <div>Loading the part information...</div>;
  } else {
    if (screen > 400) {
      return (
        <div className={classes.main}>
          <Header />
          <Paper className={classes.details}>
            <h3>Pickticket number: {number}</h3>

            <ul className={classes.ui}>
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
                <AccordionDetails className={classes.AccordionDetails}>
                  <BinData
                    parentIndex={i}
                    partInfo={partInfo}
                    partCode={partInfo.partCode}
                    store={props.store}
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
              onClick={props.handleFinalSave}
              className={classes.btn}
            >
              Done
            </Button>
          </Paper>
        </div>
      );
    } else {
      return (
        <div className={classes.main}>
          <Header />
          <Paper className={classes.details}>
            <h3>Pickticket number: {number}</h3>
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
                    store={props.store}
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
              onClick={props.handleFinalSave}
              className={classes.btn}
            >
              Done
            </Button>
          </Paper>
        </div>
      );
    }
  }
}
