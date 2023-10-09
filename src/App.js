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

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path="/warehouse" component={Warehouse} />
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
