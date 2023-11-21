import React, { useEffect, useState } from "react";
import { Select, MenuItem, FormControl, Typography } from "@material-ui/core";

function AssetData({
  parentIndex,
  partInfo,
  partCode,
  store,
  bins,
  bin,
  setBin,
  barcode,
  selectedQtyChange,
  selectedValues,
  setSelectedValues,
}) {
  const [assets, setAssets] = useState([]);
  const [color, setColor] = useState({
    completed: "#DDF7E7",
    incompleted: "#FFEBEB",
  });
  /*  const filteredAssets = assetChecked.filter(
    (item) => item.partCode === partCode && item.bin === bin
  ); */
  const handleBin = (e) => {
    setBin(e.target.value);
  };

  useEffect(() => {
    const fetchAssets = async () => {
      if (bin) {
        fetch(`http://localhost:3001/assets}`)
          .then((res) => {
            if (res.status === 200) {
              return res.json();
            }
          })
          .then((data) => {
            setAssets(data);
          });
      }
    };
    fetchAssets();
  }, [bin]);
  useEffect(() => {
    if (
      // Object.keys(selectedValues[0]).length == 2 ||
      selectedValues[parentIndex]?.assetId
    ) {
      selectedQtyChange(1, partInfo.color);
      partInfo.issuedQty = 1;
    } else {
      selectedQtyChange(0, partInfo.color);
      partInfo.issuedQty = 0;
    }
    partInfo.issuedQty == partInfo.requiredQty
      ? (partInfo.color = color.completed)
      : (partInfo.color = color.incompleted);
  }, [selectedValues]);

  const handleAssetChange = (parentIndex) => (e) => {
    if (selectedValues[parentIndex]?.assetId == "") {
      setSelectedValues([
        {
          index: parentIndex,
          partCode: partCode,
          binId: bin,
          assetId: e.target.value,
        },
      ]);
    } else {
      if (selectedValues[parentIndex]?.index == parentIndex) {
        setSelectedValues((prev) => {
          const newAssetId = prev.map((data, index) => {
            if (index === parentIndex) {
              return { ...data, assetId: e.target.value };
            } else {
              return data;
            }
          });
          return newAssetId;
        });
      } else {
        setSelectedValues((prev) => [
          ...prev,
          {
            index: parentIndex,
            partCode: partCode,
            binId: bin,
            assetId: e.target.value,
          },
        ]);
      }
    }
  };
  const selectedAssetIds = selectedValues.map((i) => i.assetId);
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
        <Select
          key={parentIndex}
          onChange={handleBin}
          value={bin}
          name="bin"
          style={{ marginBottom: "20px", width: "150px", display: "flex" }}
        >
          {bins.map((singleBin, i) => (
            <MenuItem key={i} value={singleBin.bincode}>
              {singleBin.bincode}: {singleBin.binqty}pcs
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        style={{
          minWidth: "150px",
          maxWidth: "200px",
          marginRight: "120px",
        }}
      >
        <Typography>Select Asset</Typography>
        <Select
          onChange={handleAssetChange(parentIndex)}
          value={selectedValues[parentIndex]?.assetId || ""}
          name="selectedAsset"
        >
          {assets
            .filter(
              (item) =>
                !selectedAssetIds
                  .filter((id, idx) => idx !== parentIndex)
                  .includes(item.code)
            )
            .map((asset, i) => (
              <MenuItem key={i} value={asset.code}>
                {asset.code}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </>
  );
}

export default AssetData;

/* [
  { index: 0, binId: '123', assetId: '10000' },
  {index:1, binId:'123', assetId:'10001'}
] */

/* if (barcode) {
      const newChecked = [...assetChecked, { binId, assetId: barcode }];
      setAssetChecked(newChecked);
    } else {
      const foundAssetChecked = assetChecked.find(
        (item) => item.binId === bin
      );
      let newChecked = [];
      if (foundAssetChecked) {
        newChecked = assetChecked.map((item) => {
          if (
            item.partCode === foundAssetChecked.partcode &&
            item.bin === foundAssetChecked.bin
          ) {
            return { ...foundAssetChecked, assetId: e.target.value };
          } else {
            return item;
          }
        });
      } else {
        (assetChecked || []).push({ partCode, bin, assetId: e.target.value });
        newChecked = [...assetChecked];
      }
      setAssetChecked(newChecked);
    } */

/*  const selectValue = filteredAssets.map((item) => item.assetId).flat();
  console.log(selectValue); */
