import React, { useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Grid,
  Typography,
  Input,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import WSWorkorders from "../../../tools/WSWorkorders";
import IssuePart from "./IssuePart";
import BarcodeInput from "../part/BarcodeInput";
import { Alert } from "mdi-material-ui";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: "5%",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: "100%",
    backgroundColor: "white",
    marginLeft: "5%",
  },
  button: {
    width: "100%",
    height: "70px",
  },
  screen: {
    backgroundColor: "white",
    color: "#078ff7",
    fontStyle: "bold",
    borderRadius: "6px",
    width: "100%",
  },
  screenInfo: {
    display: "flex",
    gap: "10px",
    color: "black",
    alignItems: "center",
  },
  inputGroup: {
    display: "flex",
    height: "40px",
    gap: "2px",
    marginTop: "10px",
    marginBottom: "10px",
  },
  input: {
    border: "2px solid #078ff7",
    borderRadius: "8px",
    padding: "0 5px",
  },
  searchIcon: {
    color: "white",
    backgroundColor: "#078ff7",
    padding: "7px",
    borderRadius: "8px",
  },
  select: {
    width: "30%",
  },
  bottom: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
}));

function Issue(props) {
  const classes = useStyles();
  const [activeButton, setActiveButton] = useState("WorkOrderActivity");
  const [activity, setActivity] = useState([]);
  const [workorder, setWorkorder] = useState({});
  const [woInput, setWoInput] = useState("");
  const [issueInputs, setIssueInputs] = useState({
    activity: "",
    department: "",
    project: "",
    equipment: "",
    employee: "",
  });
  const [currentPage, setCurrentPage] = useState(false);
  const { state } = props.location;
  console.log(state);
  const clickSearch = () => {
    if (issueInputs.workorder === "") {
      alert("Please input work order number");
    } else {
      Promise.all([
        WSWorkorders.getWorkOrder(woInput),
        WSWorkorders.getWorkOrderActivities(woInput),
      ]).then((res) => {
        setWorkorder(res[0].body.data);
        console.log(res[0].body.data);
        setActivity(res[1].body.data);
        setIssueInputs((prev) => ({
          ...prev,
          department: res[0].body.data.departmentCode,
          project: res[0].body.data.projectCode,
          equipment: res[0].body.data.equipmentCode,
        }));
      });
    }
  };
  console.log(issueInputs);
  const handleNext = () => {
    if (state && state.storeInput !== "") {
      setCurrentPage(true);
    } else {
      alert("Select a store in Home page first");
      setCurrentPage(false);
    }
  };
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };
  const handleWorkorder = (e) => {
    setWoInput(e.target.value);
  };
  const handleActivity = (e) => {
    setIssueInputs((prev) => ({
      ...prev,
      activity: e.target.value,
    }));
  };
  const handleProject = (e) => {
    setIssueInputs((prev) => ({
      ...prev,
      project: e.target.value,
    }));
  };
  const handleEquipment = (e) => {
    setIssueInputs((prev) => ({
      ...prev,
      equipment: e.target.value,
    }));
  };
  const handleEmployee = (e) => {
    setIssueInputs((prev) => ({
      ...prev,
      employee: e.target.value,
    }));
  };

  const renderScreenContent = () => {
    switch (activeButton) {
      case "WorkOrderActivity":
        return (
          <div>
            <div>Work Order </div>
            <div className={classes.screenInfo}>
              <div className={classes.inputGroup}>
                <Input
                  fullWidth
                  variant="outlined"
                  type="input"
                  disableUnderline={true}
                  className={classes.input}
                  onChange={handleWorkorder}
                  value={issueInputs.workorder}
                />
                <SearchIcon
                  type="button"
                  cursor="pointer"
                  className={classes.searchIcon}
                  onClick={clickSearch}
                />
              </div>
              <div>{workorder.description}</div>
            </div>
            <div>Activity </div>

            <Select
              className={classes.select}
              onChange={handleActivity}
              value={issueInputs.activity}
            >
              {activity.map((item, i) => (
                <MenuItem key={i} value={item.activityCode}>
                  {item.activityCode}
                </MenuItem>
              ))}
            </Select>
          </div>
        );
      case "ProjectBudget":
        return (
          <div>
            <div>Project </div>
            <div className={classes.screenInfo}>
              <div className={classes.inputGroup}>
                <Input
                  fullWidth
                  variant="outlined"
                  type="input"
                  disableUnderline={true}
                  className={classes.input}
                  onChange={handleProject}
                  value={issueInputs.project}
                />
                <SearchIcon
                  type="button"
                  cursor="pointer"
                  className={classes.searchIcon}
                  onClick={clickSearch}
                />
              </div>
              <div>Project description</div>
            </div>
          </div>
        );
      case "Equipment":
        return (
          <div>
            <div>Equipment </div>
            <div className={classes.screenInfo}>
              <div className={classes.inputGroup}>
                <Input
                  fullWidth
                  variant="outlined"
                  type="input"
                  disableUnderline={true}
                  className={classes.input}
                  onChange={handleEquipment}
                  value={issueInputs.equipment}
                />
                <SearchIcon
                  type="button"
                  cursor="pointer"
                  className={classes.searchIcon}
                  onClick={clickSearch}
                />
              </div>
              <div>Equipment description</div>
            </div>
          </div>
        );
      case "Employee":
        return (
          <div>
            <div>Employee </div>
            <div className={classes.screenInfo}>
              <div className={classes.inputGroup}>
                <Input
                  fullWidth
                  variant="outlined"
                  type="input"
                  disableUnderline={true}
                  className={classes.input}
                  onChange={handleEmployee}
                  value={issueInputs.employee}
                />
                <SearchIcon
                  type="button"
                  cursor="pointer"
                  className={classes.searchIcon}
                  onClick={clickSearch}
                />
              </div>
              <div>Employee description</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div>
      {currentPage ? (
        <IssuePart
          store={state.storeInput}
          workorder={woInput}
          issueInputs={issueInputs}
        />
      ) : (
        <div className={classes.root}>
          <Typography variant="h6">Issue part(s) for:</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color={
                  activeButton === "WorkOrderActivity" ? "primary" : "default"
                }
                className={classes.button}
                onClick={() => handleButtonClick("WorkOrderActivity")}
              >
                Work Order / Activity
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color={activeButton === "ProjectBudget" ? "primary" : "default"}
                className={classes.button}
                onClick={() => handleButtonClick("ProjectBudget")}
              >
                Project / Budget
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color={activeButton === "Equipment" ? "primary" : "default"}
                className={classes.button}
                onClick={() => handleButtonClick("Equipment")}
              >
                Equipment
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color={activeButton === "Employee" ? "primary" : "default"}
                className={classes.button}
                onClick={() => handleButtonClick("Employee")}
              >
                Employee
              </Button>
            </Grid>
            <Grid item s={8} className={classes.screen}>
              {renderScreenContent()}
            </Grid>
          </Grid>
          <div className={classes.bottom}>
            <Link to="/">
              <Button variant="contained" color="primary">
                Home
              </Button>
            </Link>
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Issue;
