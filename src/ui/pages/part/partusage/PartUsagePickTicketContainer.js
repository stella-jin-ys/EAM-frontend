import {connect} from 'react-redux'
import PartUsagePickTicket from "./PartUsagePickTicket";

import {
    handleError,
    setLayoutProperty,
    showError,
    showNotification,
    toggleHiddenRegion,
    setRegionVisibility,
} from '../../../../actions/uiActions'

import {updateApplication} from '../../../../actions/applicationActions'
import { isHiddenRegion, getHiddenRegionState, getUniqueRegionID } from '../../../../selectors/uiSelectors'

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
    }
}

const PartUsagePickTicketContainer = connect(mapStateToProps, {
    showNotification,
    showError,
    handleError,
    setLayoutProperty,
    updateApplication,
    toggleHiddenRegion,
    setRegionVisibility,
    }
)(PartUsagePickTicket);

export default PartUsagePickTicketContainer;
