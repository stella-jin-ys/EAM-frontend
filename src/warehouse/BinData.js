import React, { useState, useEffect } from "react";
import { Button, TextField } from "@material-ui/core";
import PartQuantity from "./PartQuantity";
import AssetData from "./AssetData";
import BarcodeInput from "../../src/barcode/BarcodeInput";

function BinData({
  parentIndex,
  partInfo,
  partCode,
  store,
  selectedQtyChange,
  selectedValues,
  setSelectedValues,
}) {
  const [bins, setBins] = useState([]);
  const [bin, setBin] = useState("");
  const [barcode, setBarcode] = useState("");

  useEffect(() => {
    const fetchBins = async (part, store) => {
      const res = fetch(`http://localhost:3001/bins/${bin}`).then((res) => {
        setBins(res.body.data);
      });
      fetchBins(partCode, store);
    };
  }, []);

  const updateProperty = (event) => {
    console.log(event);
    setBarcode(event);
  };
  // find selected index/row, and push to bins array for specific row
  const handleAdd = () => {
    const newBinQty = selectedValues.map((item) => {
      if (item.index === parentIndex) {
        return {
          ...item,
          binPartQty: [...item.binPartQty, { binId: "", partQtyInput: "" }],
        };
      } else {
        return item;
      }
    });
    setSelectedValues(newBinQty);
  };

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      {partInfo.trackbyAsset == "true" ? (
        <>
          <AssetData
            parentIndex={parentIndex}
            partInfo={partInfo}
            partCode={partCode}
            store={store}
            barcode={barcode}
            bins={bins}
            bin={bin}
            setBin={setBin}
            selectedQtyChange={selectedQtyChange}
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
          />
          <div>
            {/*  <BarcodeInput updateProperty={updateProperty} /> */}
            <TextField variant="standard" type="input" value={barcode} />
          </div>
        </>
      ) : (
        <>
          <PartQuantity
            parentIndex={parentIndex}
            selectedQtyChange={selectedQtyChange}
            partInfo={partInfo}
            partCode={partCode}
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
            bins={bins}
            bin={bin}
            setBin={setBin}
          />

          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={handleAdd}
            style={{ marginTop: "20px" }}
          >
            Add Bin
          </Button>
        </>
      )}
    </div>
  );
}

export default BinData;
