/* eslint-disable no-nested-ternary */
import React, { useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

function createData(PartID, Description, Track, ReqQty, IssueQty) {
  return { PartID, Description, Track, ReqQty, IssueQty };
}

const rows = [
  createData(10005, "desc 1", 1, 10, 0),
  createData(10006, "desc 2", 3, 20, 0),
  createData(10007, "desc 3", 4, 30, 0),
  createData(10008, "desc 4", 4, 30, 0),
  createData(10009, "desc 5", 4, 30, 0),
  createData(100010, "desc 6", 4, 30, 0),
];

const headCells = [
  { id: "PartID", label: "Part ID" },
  {
    id: "Description",
    disablePadding: true,
    label: "Description",
  },
  { id: "Track", label: "Track" },
  { id: "ReqQty", label: "Req Qty" },
  { id: "IssueQty", label: "IssueQty" },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "98%",
    margin: theme.spacing(3),
  },
  table: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  list: {
    display: "flex",
    flexDirection: "column",
    width: "99%",
    paddingLeft: theme.spacing(4),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function PartDetails() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);

  const handleClick = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <div className={classes.root}>
      <Paper>
        <TableContainer className={classes.table}>
          <List className={classes.list}>
            <ListItem button onClick={handleClick}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="PART USAGE" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List>
                <ListItem button className={classes.nested}></ListItem>
                <Table className={classes.table} component='table'>
                  <TableBody component='tbody'>
                    {rows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        return (
                          <TableRow component='tr' hover key={row.PartID}>
                            <TableCell component='td' align="center">{row?.PartID}</TableCell>
                            <TableCell align="center">
                              {row?.Description}
                            </TableCell>
                            <TableCell align="center">{row?.Track}</TableCell>
                            <TableCell align="center">{row?.ReqQty}</TableCell>
                            <TableCell align="center">
                              {row?.IssueQty}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </List>
            </Collapse>
          </List>
        </TableContainer>
      </Paper>
    </div>
  );
}
