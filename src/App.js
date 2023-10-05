import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homepage from "./homepage/Homepage";
import Warehouse from "./warehouse/Warehouse";
import Kiosk from "./kiosk/Kiosk";
import Issue from "./kiosk/Issue";
import Return from "./kiosk/Return";
import RapidRequest from "./rapidRequest/RapidRequest";
import SearchHeader from "./ui/pages/search/SearchHeader";
import Search from "./ui/pages/search/Search";
import RapidRequestHome from "./rapidRequest/RapidRequestHome";

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
      </Switch>
    </Router>
  );
}
