import { connect } from "react-redux";
import {
  handleError,
  setLayoutProperty,
  showError,
  showNotification,
  toggleHiddenRegion,
  setRegionVisibility,
} from "../../src/actions/uiActions";
import { updateMyWorkOrders } from "../../src/actions/workorderActions";
import { updateApplication } from "../../src/actions/applicationActions";
import {
  isHiddenRegion,
  getHiddenRegionState,
  getUniqueRegionID,
} from "../../src/selectors/uiSelectors";
import RapidRequest from "./RapidRequest";

function mapStateToProps(state, props) {
  const entityScreenCode = state.application.userData.workOrderScreen;
  return {
    handleclose: props.handleClose,
    workOrderLayout: state.application.workOrderLayout,
    userData: state.application.userData,
    hiddenRegions: state.ui.hiddenRegions,
    applicationData: state.application.applicationData,
    isHiddenRegion: isHiddenRegion(state)(entityScreenCode),
    getHiddenRegionState: getHiddenRegionState(state)(entityScreenCode),
    getUniqueRegionID: getUniqueRegionID(state)(entityScreenCode),
  };
}

const RapidContainer = connect(mapStateToProps, {
  showNotification,
  showError,
  handleError,
  updateMyWorkOrders,
  setLayoutProperty,
  updateApplication,
  toggleHiddenRegion,
  setRegionVisibility,
})(RapidRequest);

export default RapidContainer;
