var treeData = {
    name: "Top Level",
    children: [
      {
        name: "Level 2: A",
        children: [
          {
            name: "Son of A",
          },
          {
            name: "Daughter of A",
          },
        ],
      },
      {
        name: "Level 2: B",
      },
    ],
};
  // orientation
Array.from(dependencies).forEach(n => n.y = (n.y * 0.5) + 20)
Array.from(dependencies).forEach(n=>n.y=((n.y*0.5)*-1) +20) 
  
  var margin = { top: 20, right: 90, bottom: 20, left: 90 };
  var width = 960 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;
  
  var svg = d3
    .select(".container")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  var i = 0;
  var duration = 750;
  var root;
  
  var treemap = d3.tree().size([height, width]);
  root = d3.hierarchy(treeData, function (d) {
    return d.children;
  });
  root.x0 = height / 2;
  root.y0 = 0;
  console.log("root ", root);
  
  update(root);
  
  function update(source) {
    var treeData = treemap(root);
  
    // nodes
    var nodes = treeData.descendants();
    nodes.forEach(function (d) {
      d.y = d.depth * 180;
    });
    var node = svg.selectAll("g.node").data(nodes, function (d) {
      return d.id || (d.id = ++i);
    });
    var nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + source.y0 + ", " + source.x0 + ")";
      })
      .on("click", click);
  
    nodeEnter
      .append("circle")
      .attr("class", "node")
      .attr("r", 0)
      .style("fill", function (d) {
        return d._children ? "red" : "#fff";
      });
  
    nodeEnter
      .append("text")
      .attr("dy", ".35em")
      .attr("x", function (d) {
        return d.children || d._children ? -13 : 13;
      })
      .attr("text-anchor", function (d) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function (d) {
        return d.data.name;
      });
  
    var nodeUpdate = nodeEnter.merge(node);
  
    nodeUpdate
      .transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + d.y + ", " + d.x + ")";
      });
  
    nodeUpdate
      .select("circle.node")
      .attr("r", 10)
      .style("fill", function (d) {
        return d._children ? "red" : "#fff";
      })
      .attr("cursor", "pointer");
  
    nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();
  
    nodeExit.select("circle").attr("r", 0);
    nodeExit.select("text").style("fill-opacity", 0);
  
    // links
    function diagonal(s, d) {
      path = `M ${s.y} ${s.x}
        C ${(s.y + d.y) / 2} ${s.x}
          ${(s.y + d.y) / 2} ${d.x}
          ${d.y} ${d.x}`;
      return path;
    }
    var links = treeData.descendants().slice(1);
    var link = svg.selectAll("path.link").data(links, function (d) {
      return d.id;
    });
    var linkEnter = link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("d", function (d) {
        var o = { x: source.x0, y: source.y };
        return diagonal(o, o);
      });
    var linkUpdate = linkEnter.merge(link);
    linkUpdate
      .transition()
      .duration(duration)
      .attr("d", function (d) {
        return diagonal(d, d.parent);
      });
  
    var linkExit = link
      .exit()
      .transition()
      .duration(duration)
      .attr("d", function (d) {
        var o = { x: source.x0, y: source.y0 };
        return diagonal(o, o);
      })
      .remove();
  
    nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  
    function click(event, d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    }
}
// ------------------------------------------------------------------------------------------------------------------------------------------------------

var colourScale = d3.scaleOrdinal()
.domain(["Top Level", "A", "B"])
.range(["#abacab", "#53e28c", "#4b80fa"]);

function select2DataCollectName( d ) {
if ( d.children )
  d.children.forEach( select2DataCollectName );
else if ( d._children )
  d._children.forEach( select2DataCollectName );
if ( !d.children && d.data.type == 'unit' ) select2Data.push( d.data.name );
}

//===============================================
function searchTree( d ) {
if ( d.children )
  d.children.forEach( searchTree );
else if ( d._children )
  d._children.forEach( searchTree );
var searchFieldValue = eval( searchField );
if ( searchFieldValue && searchFieldValue.toLowerCase().match( searchText.toLowerCase() ) ) {
  // Walk parent chain
  var ancestors = [];
  var parent = d;
  while ( typeof ( parent ) !== "undefined" && parent !== null ) {
    ancestors.push( parent );
    //console.log(parent);
    parent.class = "found";
    parent = parent.parent;
  }
  console.log(ancestors);
}
}

//===============================================
function clearAll( d ) {
d.class = "";
if ( d.children )
  d.children.forEach( clearAll );
else if ( d._children )
  d._children.forEach( clearAll );
}
//===============================================
function collapse( d ) {

if ( d.children ) {
  d._children = d.children;
  //set the parent object in all the children
  d._children.forEach( function ( d1 ) {
    d1.parent = d;
    collapse( d1 );
  } );
  d.children = null;
}
}
//===============================================
function collapseAllNotFound( d ) {
if ( d.children ) {

  if ( d.class !== "found" ) {
    d._children = d.children;
    d._children.forEach( collapseAllNotFound );
    d.children = null;
  } else
    d.children.forEach( collapseAllNotFound );
}
}
//===============================================
function expandAll( d ) {
if ( d._children ) {
  d.children = d._children;
  d.children.forEach( expandAll );
  d._children = null;
} else if ( d.children )
  d.children.forEach( expandAll );
}

//===============================================
// Toggle children on click.
function toggle( d ) {
if ( d.children ) {
  d._children = d.children;
  d.children = null;
} else {
  d.children = d._children;
  d._children = null;
}
clearAll( root );
update( d );
$( "#search" ).select2( "val", "" );
}

//===============================================
$( "#search" ).on( "select2-selecting", function ( e ) {
clearAll( root );
expandAll( root );
update( root );
searchField = "d.data.name";
searchText = e.object.text;
searchTree( root );
root.children.forEach( collapseAllNotFound );
update( root );
} )

function findParent(datum) {
    if (datum.depth < 2) {
        return datum.data.name
    } else {
        return findParent(datum.parent)
    }
}

function findParentLinks(datum) {
    if (datum.depth < 2) {
        return datum.data.name
    } else {
        return findParent(datum.parent)
    }
}

// Set the dimensions and margins of the diagram
var margin = {top: 20, right: 90, bottom: 30, left: 90},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
.attr("width", width + margin.right + margin.left)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate("
  + margin.left + "," + margin.top + ")");

var i = 0,
duration = 750,
root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

// Assigns parent, children, height, depth
root = d3.hierarchy(treeData, function(d) { return d.children; });
root.x0 = height / 2;
root.y0 = 0;

// Collapse after the second level
root.children.forEach(collapse);

update(root);

select2Data = [];
select2DataCollectName( root );
select2DataObject = [];
select2Data.sort( function ( a, b ) {
    if ( a > b ) return 1; // sort
    if ( a < b ) return -1;
    return 0;
  } )
  .filter( function ( item, i, ar ) {
    return ar.indexOf( item ) === i;
  } ) // remove duplicate items
  .filter( function ( item, i, ar ) {
    select2DataObject.push( {
      "id": i,
      "text": item
    } );
  } );
$( "#search" ).select2( {
  placeholder: "Select a Leaf...",
  data: select2DataObject,
  containerCssClass: "search"
} );

// Collapse the node and all it's children
function collapse(d) {
if(d.children) {
d._children = d.children
d._children.forEach(collapse)
d.children = null
}
}

function update(source) {

// Assigns the x and y position for the nodes
var treeData = treemap(root);

// Compute the new tree layout.
var nodes = treeData.descendants(),
links = treeData.descendants().slice(1);

// Normalize for fixed-depth.
nodes.forEach(function(d){ d.y = d.depth * 180});

// ****************** Nodes section ***************************

// Update the nodes...
var node = svg.selectAll('g.node')
.data(nodes, function(d) {return d.id || (d.id = ++i); });

// Enter any new modes at the parent's previous position.
var nodeEnter = node.enter().append('g')
.attr('class', 'node')
.attr("transform", function(d) {
return "translate(" + source.y0 + "," + source.x0 + ")";
})
.on('click', click);

// Add Circle for the nodes
nodeEnter.append('circle')
.attr('class', 'node')
.attr('r', 1e-6)
.style("fill", function(d) {
  return d._children ? "lightsteelblue" : "#fff";
});

// Add labels for the nodes
nodeEnter.append('text')
.attr("dy", ".35em")
.attr("x", function(d) {
  return d.children || d._children ? -13 : 13;
})
.attr("text-anchor", function(d) {
  return d.children || d._children ? "end" : "start";
})
.text(function(d) { return d.data.name; });

// UPDATE
var nodeUpdate = nodeEnter.merge(node);

// Transition to the proper position for the node
nodeUpdate.transition()
.duration(duration)
.attr("transform", function(d) { 
return "translate(" + d.y + "," + d.x + ")";
});

// Update the node attributes and style
nodeUpdate.select('circle.node')
    .attr('r', 6)
    .attr("fill-opacity", "0.7")
    .attr("stroke-opacity", "1")
    .style("fill", function(d) {
        if (d.class === "found") {
            return "#ff4136"; //red
        } else {
            return (typeof d._children !== 'undefined') ? (colourScale(findParent(d))) : '#FFF';
        }
    })
    .style("stroke", function(d) {
        if (d.class === "found") {
            return "#ff4136"; //red
        } else {
            return colourScale(findParent(d));
        }
    });


// Remove any exiting nodes
var nodeExit = node.exit().transition()
.duration(duration)
.attr("transform", function(d) {
  return "translate(" + source.y + "," + source.x + ")";
})
.remove();

// On exit reduce the node circles size to 0
nodeExit.select('circle')
.attr('r', 1e-6);

// On exit reduce the opacity of text labels
nodeExit.select('text')
.style('fill-opacity', 1e-6);

// ****************** links section ***************************

// Update the links...
var link = svg.selectAll('path.link')
.data(links, function(d) { return d.id; });

// Enter any new links at the parent's previous position.
var linkEnter = link.enter().insert('path', "g")
.attr("class", "link")
.attr('d', function(d){
var o = {x: source.x0, y: source.y0}
return diagonal(o, o)
});

// UPDATE
var linkUpdate = linkEnter.merge(link);

// Transition back to the parent element position
linkUpdate.transition()
    .duration(duration)
    .attr('d', function(d) {
        return diagonal(d, d.parent)
    })
.style( "stroke", function ( d ) {
    if ( d.class === "found" ) {
      return "#ff4136";
    } else {
      return colourScale( findParentLinks( d ) );
    }
  } );

// Remove any exiting links
var linkExit = link.exit().transition()
.duration(duration)
.attr('d', function(d) {
var o = {x: source.x, y: source.y}
return diagonal(o, o)
})
.remove();

// Store the old positions for transition.
nodes.forEach(function(d){
d.x0 = d.x;
d.y0 = d.y;
});

// Creates a curved (diagonal) path from parent to the child nodes
function diagonal(s, d) {

path = `M ${s.y} ${s.x}
    C ${(s.y + d.y) / 2} ${s.x},
      ${(s.y + d.y) / 2} ${d.x},
      ${d.y} ${d.x}`

return path
}

// Toggle children on click.
function click(d) {
if (d.children) {
d._children = d.children;
d.children = null;
} else {
d.children = d._children;
d._children = null;
}
update(d);
}
}
//--------------------------------------------------------------------------
import node_count from "./count.js";
import node_each from "./each.js";
import node_eachBefore from "./eachBefore.js";
import node_eachAfter from "./eachAfter.js";
import node_sum from "./sum.js";
import node_sort from "./sort.js";
import node_path from "./path.js";
import node_ancestors from "./ancestors.js";
import node_descendants from "./descendants.js";
import node_leaves from "./leaves.js";
import node_links from "./links.js";
export default function hierarchy(data, children) {
  var root = new Node(data),
    valued = +data.value && (root.value = data.value),
    node,
    nodes = [root],
    child,
    childs,
    i,
    n;
  if (children == null) children = defaultChildren;
  while (node = nodes.pop()) {
    if (valued) node.value = +node.data.value;
    if ((childs = children(node.data)) && (n = childs.length)) {
      node.children = new Array(n);
      for (i = n - 1; i >= 0; --i) {
        nodes.push(child = node.children[i] = new Node(childs[i]));
        child.parent = node;
        child.depth = node.depth + 1;
      }
    }
  }
  return root.eachBefore(computeHeight);
}
function node_copy() {
  return hierarchy(this).eachBefore(copyData);
}
function defaultChildren(d) {
  return d.children;
}
function copyData(node) {
  node.data = node.data.data;
}
export function computeHeight(node) {
  var height = 0;
  do {
    node.height = height;
  } while ((node = node.parent) && node.height < ++height);
}
export function Node(data) {
  this.data = data;
  this.depth = this.height = 0;
  this.parent = null;
}
Node.prototype = hierarchy.prototype = {
  constructor: Node,
  count: node_count,
  each: node_each,
  eachAfter: node_eachAfter,
  eachBefore: node_eachBefore,
  sum: node_sum,
  sort: node_sort,
  path: node_path,
  ancestors: node_ancestors,
  descendants: node_descendants,
  leaves: node_leaves,
  links: node_links,
  copy: node_copy
};