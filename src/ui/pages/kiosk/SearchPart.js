import React from "react";
import PartSearchContainer from "../part/search/PartSearchContainer";
import { Link } from "react-router-dom";
import { Button, Paper } from "@material-ui/core";

function SearchPart(props) {
  return (
    <>
      <Link to="/">
        <Button
          size="small"
          variant="contained"
          color="primary"
          style={{
            top: "5px",
          }}
        >
          Home
        </Button>
      </Link>
      <PartSearchContainer />
    </>
  );
}

export default SearchPart;
