// import {connect} from 'react-redux';
// import PickTicketIssueReturn from './PickticketIssueReturn';
// import {
//     handleError, setLayoutProperty, showError, showNotification,
//     toggleHiddenRegion
// } from '../../../actions/uiActions';

// function mapStateToProps(state) {
//     return {
//         pickTicketLayout: state.application.pickTicketLayout,
//         hiddenRegions: state.ui.hiddenRegions,
//         userData: state.application.userData,
//         applicationData: state.application.applicationData
//     }
// }

// const PickticketIssueReturnContainer = connect(mapStateToProps, {
//         showNotification,
//         showError,
//         handleError,
//         setLayoutProperty,
//         toggleHiddenRegion,
//     }
// )(PickTicketIssueReturn);

// export default PickticketIssueReturnContainer;

import { connect } from "react-redux";
import PickTicketIssueReturn from "./PickticketIssueReturn";
import KioskMenu from "../kiosk/KioskMenu";
import {
  handleError,
  setLayoutProperty,
  showError,
  showNotification,
  toggleHiddenRegion,
  setRegionVisibility,
} from "../../../actions/uiActions";
//import {updateMyWorkOrders} from '../../../actions/workorderActions'
import { updateApplication } from "../../../actions/applicationActions";
import {
  isHiddenRegion,
  getHiddenRegionState,
  getUniqueRegionID,
} from "../../../selectors/uiSelectors";

function mapStateToProps(state) {
  const entityScreenCode = state.application.userData.workOrderScreen;
  return {
    pickTicketLayout: state.application.pickTicketLayout,
    hiddenRegions: state.ui.hiddenRegions,
    userData: state.application.userData,
    applicationData: state.application.applicationData,
    isHiddenRegion: isHiddenRegion(state)(entityScreenCode),
    getHiddenRegionState: getHiddenRegionState(state)(entityScreenCode),
    getUniqueRegionID: getUniqueRegionID(state)(entityScreenCode),
  };
}

const PickticketIssueReturnContainer = connect(mapStateToProps, {
  showNotification,
  showError,
  handleError,
  //updateMyWorkOrders,
  setLayoutProperty,
  updateApplication,
  toggleHiddenRegion,
  setRegionVisibility,
})(PickTicketIssueReturn, KioskMenu);

export default PickticketIssueReturnContainer;
