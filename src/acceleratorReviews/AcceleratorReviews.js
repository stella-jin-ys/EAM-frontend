import React, { useEffect, useState } from "react";
import {
  TextField,
  Typography,
  MenuItem,
  FormControl,
  Select,
  makeStyles,
  ButtonGroup,
  Button,
  ButtonBase,
  Input,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Header from "../homepage/Header";

const reviewLists = [
  {
    title: "SAR1a System Short List",
    data: [{ FBS: "", system: "", "test plan": "", "test report": "" }],
  },
  {
    title: "SAR1b System Short List",
    data: [{ FBS: "", system: "", "test plan": "", "test report": "" }],
  },
  {
    title: "SAR2a System Short List",
    data: [{ FBS: "", system: "", "test plan": "", "test report": "" }],
  },
  {
    title: "SAR2b System Short List",
    data: [{ FBS: "", system: "", "test plan": "", "test report": "" }],
  },
  {
    title: "SAR3 System Short List",
    data: [
      {
        FBS: "=ESS.ACC.A02.A02.A01",
        system: "DTL2 tank",
        "test plan": "ESS-4869064 rev 1 released Jan 27, 2023",
        "test report": "ESS-4869064 rev 1 released Jan 24, 2023",
      },
    ],
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    padding: 20,
    height: "100vh",
  },
  link: {
    height: "10%",
    width: "80%",
    textAlign: "center",
  },
  btngroup: {
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    color: "black",
    opacity: "0.7",
  },
  homeBtn: {
    width: "80%",
    textAlign: "right",
  },
  moreBtn: {
    marginTop: "20px",
  },
  input: {
    width: "100%",
    marginTop: "40px",
    display: "flex",
    gap: "5px",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
}));

function AcceleratorReviews(props) {
  const classes = useStyles();
  const [reviews, setReviews] = useState(reviewLists);
  const [showAll, setShowAll] = useState(false);
  const [title, setTitle] = useState("");
  const handleClick = (e) => {
    console.log(e.target);
  };
  const addNewReview = () => {
    const newReview = {
      title: title,
    };
    setReviews([...reviews, newReview]);
    console.log(reviews);
    setTitle("");
  };
  const handleMore = () => {
    setShowAll(true);
  };
  return (
    <div>
      <Header />
      <div className={classes.root}>
        <h2>Accelerator Reviews</h2>
        <div className={classes.homeBtn}>
          <Link to="/">
            <Button variant="contained" color="primary">
              Home
            </Button>
          </Link>
        </div>

        {reviews
          .slice()
          .reverse()
          .map((review, i) =>
            (!showAll && i < 3) || showAll ? (
              <Link
                className={classes.link}
                key={i}
                to={`/acceleratorreview/${encodeURIComponent(review.title)}`}
              >
                <Button
                  variant="contained"
                  onClick={handleClick}
                  size="large"
                  className={classes.btngroup}
                >
                  {review.title}
                </Button>
              </Link>
            ) : null
          )}

        <Button
          color="primary"
          className={classes.moreBtn}
          variant="contained"
          onClick={handleMore}
        >
          ...More
        </Button>
        <div className={classes.input}>
          <TextField
            placeholder="Add New Review"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></TextField>

          <Button color="primary" variant="outlined" onClick={addNewReview}>
            Add New Review
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AcceleratorReviews;
