import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homepage from "./homepage/Homepage";
import Warehouse from "./warehouse/Warehouse";
import Kiosk from "./kiosk/Kiosk";
import Issue from "./kiosk/Issue";
import Return from "./kiosk/Return";
import RapidRequestHome from "./rapidRequest/RapidRequestHome";
import AcceleratorReviews from "./acceleratorReviews/AcceleratorReviews";
import Review from "./acceleratorReviews/Review";
import PartTable from "./warehouse/PartTable";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/warehouse" component={Warehouse} />

        <Route path="/warehouse/pickticket/:number" component={PartTable} />
        <Route path="/kiosk" component={Kiosk} />
        <Route path="/issue" component={Issue} />
        <Route path="/return" component={Return} />
        <Route path="/rapidrequest" component={RapidRequestHome} />
        <Route exact path="/acceleratorreview" component={AcceleratorReviews} />
        <Route path="/acceleratorreview/:review" component={Review} />
      </Switch>
    </Router>
  );
}

/* 
  Set-ExecutionPolicy RemoteSigned -Scope Process
  json-server --watch db.json --port 3001
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Undefined */
