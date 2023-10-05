import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Component } from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import IconButton from "@material-ui/core/IconButton";

import { Link } from "react-router-dom";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import MenuItem from "@material-ui/core/MenuItem";

import "./partUsage.css";
import { TablePagination, TableSortLabel } from "@material-ui/core";

const pages = [5, 10, 25];
class PartUsageTable extends Component {
  state = {
    quantityOnHand: 0,
    page: 0,
    //rowsPerPage: pages[5],
    rowsPerPage: 5,
    order: "",
    orderBy: "",
  };
  handleClick = (row) => {
    this.props.onClickCall(row);
  };
  //
  // VISIBILITY MENU HANDLERS
  //
  handleVisibilityMenuClose() {
    if (this.state.visibilityMenu) {
      this.setState({ visibilityMenu: null });
    }
  }

  handleVisibilityMenuClick(e) {
    this.setState({ visibilityMenu: e.currentTarget });
  }

  getStockBins(stock) {
    this.setState({ visibilityMenu: stock.bin });
    this.setState({ quantityOnHand: stock.qtyOnHand });
  }

  componentWillMount() {
    //this.loadBinList(this.props.partCode);
  }

  getProps = (state, rowInfo) => ({
    style: {
      backgroundColor: state !== "" ? "green" : null,
    },
  });

  getHeaders = (headers) => {
    if (headers === "AddPartUsagesButton") {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={this.props.handleFinalSave}
        >
          Save
        </Button>
      );
    }
    return headers;
  };

  getCellValue = (row, propCodes) => {
    if (propCodes === "addPartUsage") {
      return (
        <Button
          variant="outlined"
          color="inherit"
          onClick={this.handleClick.bind(this, row)}
        >
          Add
        </Button>
      );
    } else if (propCodes === "partCode") {
      return (
        <Link to={{ pathname: `/part/${row[propCodes]}` }}>
          {row[propCodes]}
        </Link>
      );
    } else if (propCodes === "binData") {
      //console.log("color enable data: ", this.props.colorEnable);
      return this.props.colorEnable ? (
        <div style={{ backgroundColor: "red" }}>{row.binData}</div>
      ) : (
        row.binData
      );
    } else if (propCodes === "availableQuantity") {
      return propCodes.availableQuantity > propCodes.requiredQty
        ? alert("Available qty should not exceed the required qty")
        : row.availableQuantity;
    } else if (propCodes === "assetId") {
      return row.trackbyAsset == "false" ? "" : row.assetId;
    }
    console.log(this.props.data);
    return row[propCodes];
  };

  render() {
    const rows = this.props.data;
    const headers = this.props.headers;
    const propCodes = this.props.propCodes;

    const handleChangePage = (event, newPage) => {
      this.setState({ page: newPage });
    };

    const handleChangeRowsPerPage = (event) => {
      this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
      this.setState({ page: 0 });
    };

    function stableSort(array, comparator) {
      const stabilizedThis = array.map((el, index) => [el, index]);
      stabilizedThis.sort((a, b) => {
        const check = comparator(a[0], b[0]);
        if (check !== 0) return check;
        return a[1] - b[1];
      });

      return stabilizedThis.map((el) => el[0]);
    }

    function getComparator(order, orderBy) {
      return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function descendingComparator(a, b, orderBy) {
      orderBy = "partCode";
      // orderBy = 'seqNo';
      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
    }

    const recordsAfterPagingAndSorting = () => {
      // return rows.slice(this.state.page* this.state.rowsPerPage, (this.state.page + 1) * this.state.rowsPerPage)
      return stableSort(
        rows,
        getComparator(this.state.order, this.state.orderBy)
      ).slice(
        this.state.page * this.state.rowsPerPage,
        (this.state.page + 1) * this.state.rowsPerPage
      );
    };
    // Zebra TC52 screensize 1280* 720
    return (
      <div className="container">
        <Table aria-label="simple table" style={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              {headers.map((headers) => (
                <TableCell
                  key={headers}
                  align="right"
                  style={{ width: 20 }}
                  sortDirection={
                    this.state.orderBy === headers ? this.state.order : false
                  }
                >
                  {/*  <TableSortLabel
                    active = { this.state.orderBy === headers}
                    direction = {this.state.orderBy === headers ? this.state.order : 'asc'}
                    onClick = {() => {handleSortRequest(headers)}}
                  > */}
                  {this.getHeaders(headers)}
                  {/* </TableSortLabel> */}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {rows.sort((a, b) => a.partCode - b.partCode).map((row) => ( */}
            {recordsAfterPagingAndSorting().map((row) => (
              <TableRow key={row.seqNo}>
                {propCodes.map((propCodes) => (
                  <TableCell
                    align="right"
                    component="th"
                    scope="row"
                    style={{ width: 90 }}
                  >
                    {this.getCellValue(row, propCodes)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={pages}
          component="div"
          page={this.state.page}
          rowsPerPage={this.state.rowsPerPage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          count={rows.length}
        />
      </div>
    );
  }
}

export default PartUsageTable;
