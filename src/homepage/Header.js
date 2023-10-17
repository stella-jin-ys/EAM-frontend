import React from "react";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

function Header(props) {
  return (
    <div
      style={{
        color: "white",
        height: "30px",
        backgroundColor: "#059af5",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        margin: "-8px",
      }}
    >
      <div>EAM Mobile App</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
        }}
      >
        <PersonOutlineIcon />
        STELLAJIN |
        <ExitToAppIcon />
      </div>
    </div>
  );
}

export default Header;
