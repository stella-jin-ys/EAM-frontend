import {connect} from 'react-redux';
import PickTicket from './Pickticket';
import {
    handleError,
    setLayoutProperty,
    showError,
    showNotification,
    toggleHiddenRegion,
    setRegionVisibility,
} from '../../../actions/uiActions'
import {updateApplication} from '../../../actions/applicationActions'
import { isHiddenRegion, getHiddenRegionState, getUniqueRegionID } from '../../../selectors/uiSelectors'

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

const PickticketContainer = connect(mapStateToProps, {
    showNotification,
    showError,
    handleError,
    //updateMyWorkOrders,
    setLayoutProperty,
    updateApplication,
    toggleHiddenRegion,
    setRegionVisibility,
    }
)(PickTicket);

export default PickticketContainer;