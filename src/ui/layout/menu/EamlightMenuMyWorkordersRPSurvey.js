import React, { Component } from "react";
import EamlightMenuWorkorder from "./EamlightMenuWorkorder";
import Tabs from "@material-ui/core/Tabs";
import StyledTab from "./StyledTab";

export default class EamlightMenuMyWorkorders extends Component {
  state = {
    days: "ALL",
  };

  handleChange = (event, value) => {
    this.setState({ days: value });
  };

  generateMyOpenWorkOrdersRPS() {
    return this.props.myOpenWorkOrders
      .filter((wo) => this.state.days === "ALL" || wo.days === this.state.days)
      .map((wo) => <EamlightMenuWorkorder key={wo.number} wo={wo} />);
  }

  render() {
    return (
      <ul className="layout-tab-submenu active" id="mywos">
        <li>
          <a href="#" className="TexAlCenter">
            OPEN RP Survey
          </a>
          <Tabs
            fullwidth
            centered
            value={this.state.days}
            onChange={this.handleChange}
            indicatorColor="primary"
          >
            {/*<StyledTab label="Late" value="LATE" />
                        <StyledTab label="Today" value="TODAY" />
                        <StyledTab label="Week" value="WEEK"/>*/}
            <StyledTab label="All" value="ALL" />
          </Tabs>

          <ul>{this.generateMyOpenWorkOrdersRPS()}</ul>
        </li>
      </ul>
    );
  }
}
