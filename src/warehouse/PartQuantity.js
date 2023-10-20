import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Input,
  FormControl,
  Select,
  MenuItem,
  TextField,
} from "@material-ui/core";

function PartQuantity({
  parentIndex,
  partInfo,
  partCode,
  selectedQtyChange,
  selectedValues,
  setSelectedValues,
  bins,
}) {
  const [color, setColor] = useState({
    completed: "#DDF7E7",
    incompleted: "#FFEBEB",
  });
  const handleBin = (e, i) => {
    const newSelectedValues = [...selectedValues];
    if (selectedValues[parentIndex]?.binPartQty[i]) {
      newSelectedValues[parentIndex].binPartQty[i].binId = e.target.value;
      setSelectedValues(newSelectedValues);
    }
  };
  const handlePartQty = (e, i) => {
    const newSelectedQtys = [...selectedValues];
    console.log(selectedValues[parentIndex].binPartQty[i].partQtyInput);

    const matchingBin = bins.find(
      (item, index) =>
        item.bincode === selectedValues[parentIndex].binPartQty[i].binId
    );
    if (
      parseInt(selectedValues[parentIndex].binPartQty[i].partQtyInput) <=
      matchingBin.binqty
    ) {
      console.log(
        parseInt(selectedValues[parentIndex].binPartQty[i].partQtyInput)
      );
      newSelectedQtys[parentIndex].binPartQty[i].partQtyInput = parseInt(
        e.target.value
      );
    } else {
      console.log("partQty is more  binqty");
      newSelectedQtys[parentIndex].binPartQty[i].partQtyInput =
        matchingBin.binqty;
    }

    setSelectedValues(newSelectedQtys);
    console.log(selectedValues);
  };

  const increment = (index) => {
    const newSelectedValues = [...selectedValues];
    if (
      selectedValues[parentIndex].binPartQty[index].partQtyInput !== undefined
    ) {
      const matchingBin = bins.find(
        (item) =>
          item.bincode === selectedValues[parentIndex].binPartQty[index].binId
      );
      if (
        selectedValues[parentIndex].binPartQty[index].partQtyInput <
        matchingBin.binqty
      ) {
        console.log("partQty is less available");
        newSelectedValues[parentIndex].binPartQty[index].partQtyInput =
          parseInt(
            newSelectedValues[parentIndex].binPartQty[index].partQtyInput
          ) + 1;
      } else {
        console.log("partQty is more available");
        newSelectedValues[parentIndex].binPartQty[index].partQtyInput =
          matchingBin.binqty;
      }
    }
    setSelectedValues(newSelectedValues);
  };

  const decrement = (index) => {
    const newSelectedValues = [...selectedValues];
    if (
      selectedValues[parentIndex].binPartQty[index].partQtyInput !== undefined
    ) {
      if (selectedValues[parentIndex].binPartQty[index].partQtyInput <= 0) {
        newSelectedValues[parentIndex].binPartQty[index].partQtyInput = 0;
      } else {
        newSelectedValues[parentIndex].binPartQty[index].partQtyInput =
          parseInt(
            newSelectedValues[parentIndex].binPartQty[index].partQtyInput
          ) - 1;
      }

      setSelectedValues(newSelectedValues);
    }
  };
  useEffect(() => {
    const sum =
      selectedValues[parentIndex]?.binPartQty.reduce(
        (acc, curr) => acc + parseInt(curr.partQtyInput),
        0
      ) || 0;
    /*   selectedValues[parentIndex].binPartQty.map((item, i) => {
      selectedQtyChange(item.partQtyInput);
      partInfo.issuedQty = sum ? sum : " ";
      partInfo.issuedQty.toString() == partInfo.requiredQty
        ? (partInfo.color = color.completed)
        : (partInfo.color = color.incompleted);
    }); */
  }, [selectedValues[parentIndex]?.binPartQty]);

  /*  let inputData= selectedValues.map((item, i) => {
    if (index === i) {
      return {
        ...item,
        index: parentIndex,
        binId: e.target.value,
        partQtyInput: partQtyInput,
      };
    } else {
      return item;
    }
 });
  setSelectedValues(inputData) */
  return (
    <>
      <FormControl
        style={{
          minWidth: "150px",
          maxWidth: "200px",
          marginRight: "40px",
        }}
      >
        <Typography>Select a Bin</Typography>
        {selectedValues[parentIndex]?.binPartQty.map((data, index) => {
          const selectedBinIds = selectedValues.map((i) => i.binId);
          return (
            <Select
              key={index}
              onChange={(e) => handleBin(e, index)}
              value={data.binId}
              name="bin"
              style={{ marginBottom: "20px", width: "150px", display: "flex" }}
            >
              {bins
                /* .filter(
                   (item) =>
                    !selectedBinIds
                      .filter((id, idx) => idx !== index)
                      .includes(item.bincode)
                ) */
                .map((singleBin, i) => (
                  <MenuItem key={i} value={singleBin.bincode}>
                    {singleBin.bincode}: {singleBin.binqty}pcs
                  </MenuItem>
                ))}
            </Select>
          );
        })}
      </FormControl>
      <FormControl
        style={{
          minWidth: "150px",
          maxWidth: "200px",
          marginRight: "15px",
        }}
      >
        <Typography>Select Part Quantity</Typography>
        {selectedValues[parentIndex]?.binPartQty.map((data, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => decrement(index)}
            >
              -
            </Button>

            <TextField
              type="number"
              value={data?.partQtyInput !== undefined ? data.partQtyInput : ""}
              onChange={(e) => handlePartQty(e, index)}
              style={{
                width: "40px",
                textAlign: "center",
              }}
            />

            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => increment(index)}
            >
              +
            </Button>
          </div>
        ))}
      </FormControl>
    </>
  );
}

export default PartQuantity;
