/* import React, { useEffect, useState, useRef } from "react";
import Tree from "react-d3-tree";
import { tree as d3tree, hierarchy, HierarchyPointNode } from 'd3-hierarchy';
import dependencies from './dependencies.json'
import { TextField, Box, Button, SearchBar } from "@material-ui/core"; 

export default function Test(props) {
  const [data, setData] = useState()
  const [treeDepth, SetTreeDepth] = useState(1);
  const [searchType, setSearchType] = useState("");
  const [position, setPosition] = useState()
  const [expanded, setExpanded] = useState(["root"])
  const [selected, setSelected] = useState([])
  const [subjectData, setSubjectData] = useState()
  const [selectedSingleItem, setSelectedSingleItem] = useState('')

  console.log(props.workorder.equipmentCode);
 

  useEffect(() => {
    const fetchData = () => {
      //fetch(`./dependencies/${searchType}/${treeDepth}`)
      fetch('./dependencies.json')
        .then((res) => res.json())
        .then((data) => setData(data))
      console.log(data.data);
    }
  }, [])


  console.log(dependencies);

  const searchInput = (e) => setSearchType(e.target.value)
  console.log(searchType);
  const depthInput = (e) => SetTreeDepth(e.target.value)
  console.log(treeDepth);
    
  const nameFilter = data.children.filter(function (d) { return d.eqpTree == 'ACC.B01.B04.B01.B01.B01' }) 

  const searchTree = (d) => {
    if (d.children)
      d.children.forEach(searchTree)
    else if (d._children)
      d._children.forEach(searchTree)
    var searchFieldValue = eval(searchType)
    if (searchFieldValue && searchFieldValue.toLowerCase().match(searchType.toLowerCase())) {
      var ancestors = []
      var parent = d
      while (typeof (parent) !== 'undefined' && parent !== null) {
        ancestors.push(parent)
        parent = parent.parent
      }
      console.log(ancestors);
    }
  }
  useEffect(() => {
    setSubjectData(() => data)
  }, [data])
  
  const handleClick = (e) => {
    e.preventDefault()
   
     const filter = searchType
    console.log(filter);
  // const filter = value.trim()
    let expandedTemp = expanded
    if (!filter) {
      setSubjectData(() => data)
      setExpanded("root")
      return
    }
  let filtered = filterTree(data, filter)
  filtered = expandFilteredNodes(filtered, filter)
  if (filtered && filtered.children) {
    //filtered.children.map((item)=>{expandedTemp.push(item.id)})
    expandedTemp = []
    expandedTemp.push(...getIDsExpandFilter(filtered))
  }
  setExpanded(expandedTemp)
  setSubjectData(filtered)
  }
  
  const handleToggle = (event, nodeIds) => {
    let expandedTemp = expanded
    expandedTemp = nodeIds
    setExpanded(expandedTemp)
  }
  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds)
    // When false (default) is a string this takes single string
    if (!Array.isArray(nodeIds)) {
      setSelectedSingleItem(nodeIds)
    } 
    // TODO: When multiSelect' is true this takes an array of strings
  }


    return (
      // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
      <div id="treeWrapper" style={{ width: "100%", height: "100%" }}>
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
          <TextField
            type="text"
            id="outlined-basic"
            label='Search Type'
            variant="outlined"
            onChange={searchInput}
            marginRight='10px'
          />
          <TextField
            type="number"
            id="outlined-basic"
            label='Search Level'
            variant="outlined"
            onChange={depthInput}
            InputProps={{ inputProps: { min: -2, max: 2 } }}
          />
          <Button
            type='submit'
            variant="primary"
            style={{ width: "20px", marginTop: "10px", marginLeft: '10px' }}
          //onClick={handleClick}
          >
            Search
          </Button>
        </Box>

        {<Tree
          data={dependencies}
          expanded={expanded}
          selected={selected} 
          handleToggle={handleToggle}
          handleSelect={handleSelect}
          translate={{ x: 100, y: 100 }}
          nodeSize={{ x: 200, y: 50 }}
          initialDepth={treeDepth}
          rootNodeClassName="node__root"
          branchNodeClassName="node__branch"
          leafNodeClassName="node__leaf"
        />}
      </div>
    );
  }
} */