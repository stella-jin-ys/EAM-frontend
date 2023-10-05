import React, { Component } from "react";
import EamlightMenuWorkorder from "./EamlightMenuWorkorder";
import Tabs from "@material-ui/core/Tabs";
import StyledTab from "./StyledTab";

export default class EamlightMenuMyPicktickets extends Component {
  state = {
    days: "ALL",
  };

  handleChange = (event, value) => {
    this.setState({ days: value });
  };

  generateMyApprovedPicktickets() {
    return this.props.myOpenPicktickets
      .filter(
        (wo) => this.state.days === "Approved" || wo.days === this.state.days
      )
      .map((wo) => <EamlightMenuWorkorder key={wo.number} wo={wo} />);
  }

  render() {
    return (
      <ul className="layout-tab-submenu active" id="mywos">
        <li>
          <a href="#" className="TexAlCenter">
            Approved Pick Tickets
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
            <StyledTab label="Approved" value="Approved" />
          </Tabs>

          <ul>{/*{this.generateMyApprovedPicktickets()}*/}</ul>
        </li>
      </ul>
    );
  }
}
