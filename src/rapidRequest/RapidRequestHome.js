import React from "react";
import FontIcon from "@material-ui/core/Icon";
import EAMBarcodeInput from "eam-components/dist/ui/components/muiinputs/EAMBarcodeInput";
import EAMCheckbox from "eam-components/dist/ui/components/muiinputs/EAMCheckbox";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RapidContainer from "../../src/rapidRequest/RapidContainer";
import RapidRequest from "./RapidRequest";

const SEARCH_TYPES = {
  PART: {
    text: "Parts",
    value: "PART",
    code: "PART",
  },
  EQUIPMENT_TYPES: {
    text: "Equipment",
    value: "A,P,S,L",
    code: "EQUIPMEN",
  },
  JOB: {
    text: "Work Orders",
    value: "JOB",
    code: "JOB",
  },
};
export default class SearchHeader extends React.Component {
  state = {
    searchOn: Object.values(SEARCH_TYPES).map((v) => v.value),
    showModal: false,
  };

  componentDidMount() {
    this.searchInput.focus();
  }
  handleOpenModal = () => {
    this.setState({ showModal: true });
  };
  handleCloseModal = () => {
    this.setState({ showModal: false });
  };
  renderTypeCheckbox(searchType) {
    const { searchOn } = this.state;
    return (
      <EAMCheckbox
        key={searchType.code}
        elementInfo={{ text: searchType.text }}
        value={searchOn.includes(searchType.value).toString()}
        onChange={() => {
          this.setState(
            {
              searchOn: searchOn.includes(searchType.value)
                ? searchOn.filter((val) => val !== searchType.value)
                : [...searchOn, searchType.value],
            },
            () =>
              this.handleSearchInput({ target: { value: this.props.keyword } })
          );
        }}
      />
    );
  }

  render() {
    const searchIconStyle = {
      color: "#02a2f2",
      fontSize: 25,
      position: "absolute",
      right: -4,
      top: 5,
    };
    const { showTypes } = this.props;

    const entityTypes = this.state.searchOn.join(",");

    const { showModal } = this.state;

    const showRapidContainer =
      process.env.REACT_APP_PUBLIC_URL === "/eammobile";

    return (
      <div
        id="searchBox"
        className={
          this.props.searchBoxUp
            ? "searchBox searchBoxSearch"
            : "searchBox searchBoxHome"
        }
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div id="searchBoxLabel" className="searchBoxLabelHome">
          <img
            src="images/eamlight_logo.png"
            alt="EAM Mobile Logo"
            style={{ paddingLeft: 20 }}
          />
          <div style={{ width: 10 }}></div>
          <div
            id="searchBoxLabelGreeting"
            className={
              this.props.searchBoxUp
                ? "searchBoxLabelGreetingSearch"
                : "searchBoxLabelGreetingHome"
            }
          >
            <span
              className="FontLatoBlack Fleft Fs30 DispBlock"
              style={{ color: "#02a2f2" }}
            >
              Welcome to EAM Mobile
            </span>
          </div>
        </div>
        <div
          id="searchBoxInput"
          className={
            this.props.searchBoxUp
              ? "searchBoxInputSearch"
              : "searchBoxInputHome"
          }
        >
          <EAMBarcodeInput
            onChange={(val) => this.props.fetchDataHandler(val, entityTypes)}
            top={3}
            right={-7}
          >
            <input
              onChange={this.handleSearchInput.bind(this)}
              id="searchInputText"
              onKeyDown={this.props.onKeyDown}
              value={this.props.keyword}
              style={{ textTransform: "uppercase" }}
              ref={(input) => {
                this.searchInput = input;
              }}
            />
          </EAMBarcodeInput>
          <FontIcon style={searchIconStyle} className="fa fa-search" />
          {showTypes && (
            <div
              style={{
                height: "30px",
                display: "flex",
                direction: "row",
                whiteSpace: "nowrap",
              }}
            >
              {Object.values(SEARCH_TYPES).map(
                this.renderTypeCheckbox.bind(this)
              )}
            </div>
          )}
          <label id="searchPlaceHolder">
            {!this.props.keyword && this.props.logistics_Placeholder}
          </label>
        </div>

        <div
          onClick={this.handleOpenModal}
          style={{
            cursor: "pointer",
            display: "block",
            textAlign: "center",
          }}
        >
          <AddCircleOutlineIcon fontSize="large" color="primary" />
          <div>Rapid Request</div>
        </div>

        <RapidRequest open={showModal} handleClose={this.handleCloseModal} />
      </div>
    );
  }

  handleSearchInput = (event) => {
    this.props.fetchDataHandler(
      event.target.value,
      this.state.searchOn.join(",")
    );
  };
}
