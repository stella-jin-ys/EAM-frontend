import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Input,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import Autocomplete from "@material-ui/lab/Autocomplete";
import BarcodeInput from "../../../barcode/BarcodeInput";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function RapidRequest(props) {
  const [activeStep, setActiveStep] = useState(0);
  const [comment, setComment] = useState("");
  const [typeValues, setTypeValues] = useState([]);
  const [typeValue, setTypeValue] = useState("");
  const [woDesc, setWoDesc] = useState("");
  const [equipments, setEquipments] = useState([]);
  const [equipInput, setEquipInput] = useState("");
  const [selectedEquip, setSelectedEquip] = useState("");
  const [location, setLocation] = useState("");
  const [workorder, setWorkorder] = useState({});
  const [snackbar, setSnackbar] = useState(false);
  const [error, setError] = useState("");
  const handleDesc = (e) => {
    setWoDesc(e.target.value);
  };
  /* useEffect(() => {
    if (equipInput?.trim() !== "") {
      WS.autocompleteEquipment(equipInput.toUpperCase()).then((res) => {
        const equipOptions = res.body.data.map(
          (item) => `${item.code} - ${item.desc}`
        );
        setEquipments(equipOptions);
      });
    } else {
      setEquipments([]);
    }
  }, [equipInput]); */
  const defaultProps = {
    options: equipments,
    getOptionLabel: (option) => option,
  };
  const handleEquipInput = (e, newInputValue) => {
    setEquipInput(newInputValue);
  };
  const handleSelectedEquip = (e, newValue) => {
    setSelectedEquip(newValue);
  };
  useEffect(() => {
    if (selectedEquip) {
      const equipCode = selectedEquip.split(" - ")[0];
      fetch(`http://localhost:3001/equipment/${equipCode}`)
        .then((res) => res.json())
        .then((data) => {
          const parentlocation = data.parentlocation;
          if (parentlocation !== undefined && parentlocation !== "") {
            setLocation(parentlocation);
          } else {
            setLocation("");
          }
        });
    }
  }, [selectedEquip]);
  useEffect(() => {
    const fetchData = async () => {
      fetch(`http://localhost:3001/workOrderTypes/${typeValue}`)
        .then((res) => res.json())
        .then((data) => {
          setTypeValues(data);
        });
    };
  }, []);
  const handleLocation = () => {
    setLocation(location);
  };
  const handleType = (e) => {
    setTypeValue(e.target.value);
  };
  const handleComment = (e) => {
    setComment(e.target.value);
  };
  const handleNext = () => {
    setSnackbar(false);
    setError("");
    if (activeStep === 0) {
      fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: woDesc,
          equipmentCode: selectedEquip.split(" - ")[0],
          equipmentOrganization: "ESS",
          departmentCode: "*",
          typeCode: typeValue,
          statusCode: "UFIN",
        }),
      })
        .then((res) => {
          console.log(res);
          setWorkorder(res.body.data);
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        })
        .catch((err) => {
          console.log(err);
          setSnackbar(true);
          setError(err.response.body.errors[0].message);
        });
    } else {
      const postData = {
        entityCode: "EVNT",
        entityKeyCode: workorder.number,
        text: comment,
        user: "",
      };
      fetch(`http://localhost:3001/comments/${postData}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setComment("");
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        })
        .catch((err) => {
          setSnackbar(err.message);
        });
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleNewRequest = () => {
    setActiveStep(0);
    setWoDesc("");
    setEquipInput("");
    setSelectedEquip("");
    setTypeValue("");
    setComment("");
    setSnackbar(false);
    //setIsMediaOpen(true); // Resetting the media upload area visibility
  };
  const handleFinish = () => {
    props.handleClose();
    setActiveStep(0);
    setWoDesc("");
    setEquipInput("");
    setSelectedEquip("");
    setLocation("");
    setTypeValue("");
    setComment("");
    setSnackbar(false);
  };
  const commonProps = {
    workorder,
    workOrderLayout: props.workOrderLayout,
    userData: props.userData,
  };

  const updateProperty = (e) => {
    setEquipInput(e);
  };

  if (!props.open) {
    return null;
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      maxWidth="md"
      fullWidth
      style={{ width: "100%" }}
    >
      <DialogContent>
        <div>
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step>
              <StepLabel>Rapid Request</StepLabel>
            </Step>
            <Step>
              <StepLabel>Details</StepLabel>
            </Step>
            <Step>
              <StepLabel>Finish</StepLabel>
            </Step>
          </Stepper>

          {activeStep === 0 && (
            <Card variant="outlined">
              <CardContent>
                <Typography style={{ color: "#38688f" }}>
                  Description of the problem *
                </Typography>
                <Input fullWidth value={woDesc} onChange={handleDesc} />

                <BarcodeInput
                  updateProperty={updateProperty}
                  right={30}
                  top={20}
                >
                  <Typography style={{ paddingTop: "10px", color: "#38688f" }}>
                    Equipment *
                  </Typography>
                  <Autocomplete
                    {...defaultProps}
                    noOptionsText=""
                    value={selectedEquip}
                    inputValue={equipInput}
                    onInputChange={handleEquipInput}
                    onChange={handleSelectedEquip}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </BarcodeInput>

                <Typography style={{ paddingTop: "10px", color: "#38688f" }}>
                  Location
                </Typography>
                <Input fullWidth value={location} onChange={handleLocation} />
                <Typography style={{ paddingTop: "10px", color: "#38688f" }}>
                  Type *
                </Typography>
                <Select fullWidth value={typeValue} onChange={handleType}>
                  {typeValues.map((item, i) => (
                    <MenuItem key={i} value={item.code}>
                      {item.code}: {item.desc}
                    </MenuItem>
                  ))}
                </Select>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeStep === 1 && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Details</Typography>
                <TextField
                  label="COMMENTS"
                  value={comment}
                  onChange={handleComment}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "20px",
                  }}
                >
                  <Button variant="contained" onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
              <Snackbar open={snackbar} autoHideDuration={4000}>
                <Alert severity="error">{error}</Alert>
              </Snackbar>
            </Card>
          )}
          {activeStep === 2 && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">All steps completed</Typography>
                <Typography>
                  You have created a Work Order {workorder.number}.
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      marginRight: "10px",
                    }}
                    onClick={handleFinish}
                  >
                    FINISH
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNewRequest}
                  >
                    NEW
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RapidRequest;
