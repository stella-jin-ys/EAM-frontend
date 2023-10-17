import { Link } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
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
} from "@material-ui/core";
import Issue from "../kiosk/Issue";
import Return from "../kiosk/Return";
import SearchProducts from "./SearchProducts";
import Header from "../homepage/Header";

const images = [
  {
    url: "https://images.pexels.com/photos/5506059/pexels-photo-5506059.jpeg?auto=compress&cs=tinysrgb&w=1600",
    title: "ISSUE",
    width: "70%",
  },
  {
    url: "https://images.pexels.com/photos/51320/drill-milling-milling-machine-drilling-51320.jpeg?auto=compress&cs=tinysrgb&w=1600",
    title: "RETURN",
    width: "70%",
  },
  {
    url: "https://images.pexels.com/photos/924676/pexels-photo-924676.jpeg?auto=compress&cs=tinysrgb&w=1600",
    title: "SEARCH PART",
    width: "70%",
  },
];
const stores = ["store1", "store2", "store3", "store4", "store5"];

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
    marginTop: theme.spacing(5),
    width: "100%",
    alignItems: "center",
  },
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
    minWidth: 300,
    width: "100%",
    margin: "15px 0",
    height: "100%",
    overflow: "hidden",
  },
  image: {
    position: "relative",
    height: 150,
    [theme.breakpoints.down("xs")]: {
      width: "100% !important", // Overrides inline-style
      height: 100,
    },
    "&:hover, &$focusVisible": {
      zIndex: 1,
      "& $imageBackdrop": {
        opacity: 0.15,
      },
      "& $imageMarked": {
        opacity: 0,
      },
      "& $imageTitle": {
        border: "4px solid currentColor",
      },
    },
  },
  imageButton: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 40%",
  },
  imageBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create("opacity"),
  },
  imageTitle: {
    position: "relative",
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px ${
      theme.spacing(1) + 4
    }px`,
    [theme.breakpoints.down("xs")]: {
      padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px ${
        theme.spacing(0.5) + 2
      }px`, // Adjust padding for small screens
    },
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: "absolute",
    bottom: -2,
    left: "calc(50% - 9px)",
    transition: theme.transitions.create("opacity"),
  },
  select: {
    width: "40%",
    marginBottom: "40px",
  },
}));

function Kiosk() {
  const classes = useStyles();
  const [transactionType, setTransactionType] = useState("");
  const [currentPage, setCurrentPage] = useState(null);
  const [stores, setStores] = useState([]);
  const [storeInput, setStoreInput] = useState("");
  const stateToPass = { storeInput };

  /*  useEffect(() => {
    async function fetchStores() {
      const res = await WSPicktickets.getStores();
      const dataArray = await res.body.data;
      setStores(dataArray);
    }
    fetchStores();
  }, []); */
  useEffect(() => {
    fetch(`http://localhost:3001/stores/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setStores(data);
      })
      .catch((error) => {
        console.error("Error fetching stores:", error);
      });
  }, []);
  const handleClick = (title, page) => {
    setTransactionType(title);
    setCurrentPage(page);
  };

  const handleStoreInput = (e) => {
    setStoreInput(e.target.value);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "ISSUE":
        return <Issue transactionType={transactionType} />;
      case "RETURN":
        return <Return />;
      case "SEARCH PART":
        return <SearchProducts />;
      default:
        return null;
    }
  };
  return (
    <div>
      <Header />

      <div className={classes.root}>
        <FormControl className={classes.formControl}>
          <Typography component="div">Select a Store *</Typography>
          <Select
            onChange={handleStoreInput}
            value={storeInput}
            className={classes.select}
          >
            {stores.map((store, i) => (
              <MenuItem key={i} value={store}>
                {store}
              </MenuItem>
            ))}
          </Select>
          <Typography component="div">Select Transaction Type *</Typography>
          <div className={classes.root}>
            {currentPage
              ? renderPage()
              : images.map((image, i) => (
                  <ButtonBase
                    focusRipple
                    key={image.title}
                    className={classes.image}
                    style={{
                      width: image.width,
                    }}
                    component={Link}
                    to={{
                      state: stateToPass,
                      pathname: `/${image.title
                        .toLowerCase()
                        .replace(" ", "")}`,
                    }}
                    onClick={() => handleClick(image.title)}
                  >
                    <span
                      className={classes.imageSrc}
                      style={{
                        backgroundImage: `url(${image.url})`,
                      }}
                    />
                    <span className={classes.imageBackdrop} />
                    <span className={classes.imageButton}>
                      <Typography
                        component="span"
                        variant="subtitle1"
                        color="inherit"
                        className={classes.imageTitle}
                      >
                        {image.title}
                        <span className={classes.imageMarked} />
                      </Typography>
                    </span>
                  </ButtonBase>
                ))}
          </div>
        </FormControl>
      </div>
    </div>
  );
}

export default Kiosk;
