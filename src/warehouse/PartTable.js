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

const headers = [
  "Part",
  "Description",
  "Selected Qty",
  "Available Qty",
  "Required Qty",
];
const pickticket = [
  {
    partCode: "10000",
    partDesc: "part 10000",
    issuedQty: 0,
    storeQty: 100,
    requiredQty: 5,
    store: "store1",
  },
  {
    partCode: "10001",
    partDesc: "part 10001",
    issuedQty: 0,
    storeQty: 200,
    requiredQty: 6,
    store: "store1",
  },
  {
    partCode: "10002",
    partDesc: "part 10002",
    issuedQty: 0,
    storeQty: 300,
    requiredQty: 7,
    store: "store1",
  },
  {
    partCode: "10003",
    partDesc: "part 10003",
    issuedQty: 0,
    storeQty: 400,
    requiredQty: 8,
    store: "store1",
  },
  {
    partCode: "10004",
    partDesc: "part 10004",
    issuedQty: 0,
    storeQty: 500,
    requiredQty: 9,
    store: "store1",
  },
];

const useStyles = makeStyles((theme) => ({
  main: {
    margin: "auto",
  },
  details: {
    width: "80%",
    margin: "20px auto",
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
  console.log({ number });
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
    <div className={classes.main}>
      <Header />
      <Paper className={classes.details}>
        <Typography>Pickticket number {number}</Typography>
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
        {pickticket.map((partInfo, i) => (
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
      </Paper>
    </div>
  );
}
