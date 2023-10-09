import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Button,
  Input,
  TextField,
  Paper,
  FormControl,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";

const testplans = [
  "ESS-4869064 rev 1",
  "ESS-3269839 rev 2",
  "ESS-3747671 rev 3",
  "ESS-4869064 rev 4",
  "ESS-3269839 rev 5",
  "ESS-3747671 rev 6",
  "ESS-4869064 rev 7",
  "ESS-3269839 rev 8",
  "ESS-3747671 rev 9",
];

const testreports = [
  "ESS-4869064 rev 1",
  "ESS-3269839 rev 2",
  "ESS-3747671 rev 3",
];

const useStyles = makeStyles((theme) => ({
  main: {
    textAlign: "center",
    width: "80%",
    margin: "auto",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  tableCell: {
    width: "25%",
  },
  btn: {
    textAlign: "left",
    marginBottom: "15px",
  },
  searchicon: {
    padding: "8px",
    cursor: "pointer",
  },
}));

const MenuProps = {
  PaperProps: {
    style: {
      height: 300,
      width: 250,
      overflowY: "auto",
    },
  },
};

function Review(props) {
  const { review } = useParams();
  const classes = useStyles();
  const [testplan, setTestplan] = useState([]);
  const [testreport, setTestreport] = useState([]);
  const [selectedTestplans, setSelectedTestplans] = useState([]);
  const [selectedTestReports, setSelectedTestreports] = useState([]);
  const handleTestplan = (e) => {
    setTestplan(e.target.value);
    setSelectedTestplans(e.target.value);
    console.log(e.target.value);
  };
  const handleTestreport = (e) => {
    setTestreport(e.target.value);
    setSelectedTestreports(e.target.value);
  };

  useEffect(() => {
    setSelectedTestplans(testplan);
  }, [testplan]);

  const renderValues = (selected, type) => {
    if (type === "testplan") {
      return selectedTestplans.join(", ");
    } else if (type === "testreport") {
      return selectedTestReports.join(", ");
    }
  };

  return (
    <div className={classes.main}>
      <h2>Review page for {review}</h2>
      <div className={classes.btn}>
        <Link to="/">
          <Button color="primary" variant="contained">
            Home
          </Button>
        </Link>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>FBS</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Test Plan</TableCell>
              <TableCell>Test Report</TableCell>
            </TableRow>
          </TableBody>

          <TableBody>
            <TableRow>
              <TableCell>
                <div>
                  <TextField
                    variant="outlined"
                    placeholder="Add FBS Here"
                    size="small"
                  ></TextField>
                  <SearchIcon className={classes.searchicon} />
                </div>
              </TableCell>
              <TableCell>Description of FBS</TableCell>
              <TableCell>
                <div>
                  {testplan.length > 0 &&
                    testplan.map((item, i) => <div key={i}>{item}</div>)}
                </div>
                <FormControl className={classes.formControl}>
                  <Select
                    multiple
                    value={testplan}
                    onChange={handleTestplan}
                    renderValue={renderValues}
                    MenuProps={MenuProps}
                  >
                    {testplans.map((item, i) => (
                      <MenuItem key={i} value={item}>
                        <Checkbox checked={selectedTestplans.includes(item)} />
                        <ListItemText primary={item} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <div>
                  {testreport.length > 0 &&
                    testreport.map((item, i) => <div key={i}>{item}</div>)}
                </div>
                <FormControl className={classes.formControl}>
                  <Select
                    multiple
                    value={testreport}
                    input={<Input />}
                    onChange={handleTestreport}
                    renderValue={renderValues}
                    MenuProps={MenuProps}
                  >
                    {testreports.map((item) => (
                      <MenuItem key={item} value={item}>
                        <Checkbox
                          checked={selectedTestReports.includes(item)}
                        />
                        <ListItemText primary={item} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Review;
