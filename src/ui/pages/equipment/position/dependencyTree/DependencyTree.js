import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { tree as d3tree, hierarchy, HierarchyPointNode } from "d3-hierarchy";
import dependencies from "./dependencies.json";
import "./dependencyTree.css";
import {
  TextField,
  Box,
  Button,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import WSWorkorders from "../../../../../tools/WSWorkorders";

const Node = ({ nodeDatum }) => {
  const [showChild, setShowChild] = useState(false);
  const mouseHover = () => setShowChild(!showChild);
  const rootChange = (e) => {
    console.log("onClick: ", e.target.innerText);
  };
  return (
    <div>
      <h3
        onMouseEnter={mouseHover}
        onMouseLeave={mouseHover}
        onClick={rootChange}
        id={nodeDatum.__rd3t.id}
        values={nodeDatum.values}
      >
        {nodeDatum.name}
      </h3>
      <div>
        <div className="data-values">
          {nodeDatum.values &&
            showChild &&
            Object.entries(nodeDatum.values)
              .slice(1, 2)
              .map(([k, v], i) => <li key={i}>{`${k}: ${v}`}</li>)}
        </div>
      </div>
    </div>
  );
};

export default function DependencyTree(props) {
  const containerStyles = {
    width: "100vw",
    height: "100vh",
  };

  const nodeSize = { x: 300, y: 100 };
  const foreignObjectProps = {
    width: nodeSize.x,
    height: nodeSize.y,
    x: 15,
    y: -35,
  };
  // root.children returns an array of Node, values returns an array of values
  const root = hierarchy(dependencies, function (d) {
    return d.children;
  });
  // nodeDatum {name: ..., children: ..., values: ..., __rd3t:{id:...}}

  const [treeDepth, SetTreeDepth] = useState(2);
  const [types, setTypes] = useState([]);
  const [type, setType] = useState("");
  useEffect(() => {
    WSWorkorders.getEqpDependType().then((res) => setTypes(res.body.data));
  }, []);
  const typeChange = (e) => {
    setType(e.target.value);
  };
  const depthInput = (e) => SetTreeDepth(e.target.value);
  //console.log(treeDepth);
  const clickNode = (e) => {
    console.log("on click" + e.data.name);
  };

  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    foreignObjectProps,
  }) => (
    <g>
      <circle r={15} onClick={toggleNode}></circle>
      <foreignObject {...foreignObjectProps} style={{ height: "100%" }}>
        <Node nodeDatum={nodeDatum} />
      </foreignObject>
    </g>
  );

  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    <div id="treeWrapper" style={{ width: "100%", height: "100vh" }}>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "20ch" },
        }}
        noValidate
        autoComplete="off"
        marginLeft="20px"
        marginTop="20px"
      >
        <FormControl style={{ margin: "0 10px 0 0", width: "300px" }}>
          <InputLabel>Select Type</InputLabel>
          <Select
            id="types"
            value={type}
            label="type"
            onChange={typeChange}
            autoWidth
          >
            {types.map((type, i) => (
              <MenuItem key={i} value={type}>
                {type.description}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          type="number"
          id="outlined-basic"
          label="Search Level"
          variant="standard"
          onChange={depthInput}
          InputProps={{ inputProps: { min: -2, max: 2 } }}
        />
        <Button
          type="submit"
          variant="outlined"
          style={{
            width: "60px",
            marginTop: "10px",
            marginLeft: "10px",
          }}
          //onClick={handleClick}
        >
          Search
        </Button>
      </Box>

      {
        <Tree
          data={dependencies}
          translate={{ x: 20, y: 300 }}
          nodeSize={nodeSize}
          initialDepth={treeDepth}
          onNodeClick={clickNode}
          renderCustomNodeElement={(rd3tProps) =>
            renderForeignObjectNode({
              ...rd3tProps,
              foreignObjectProps,
            })
          }
          rootNodeClassName="node__root"
          branchNodeClassName="node__branch"
          leafNodeClassName="node__leaf"
        />
      }
    </div>
  );
}
