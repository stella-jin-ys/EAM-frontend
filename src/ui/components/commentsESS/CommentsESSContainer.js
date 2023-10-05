import {connect} from 'react-redux'
import CommentsESS from './CommentsESS'
import {
    handleError,
    setLayoutProperty,
    showError,
    showNotification,
    toggleHiddenRegion,
    setRegionVisibility,
} from '../../../actions/uiActions'
import {updateMyWorkOrders} from '../../../actions/workorderActions'
import {updateApplication} from '../../../actions/applicationActions'
import { isHiddenRegion, getHiddenRegionState, getUniqueRegionID } from '../../../selectors/uiSelectors'


function mapStateToProps(state) {
    const entityScreenCode = state.application.userData.workOrderScreen;
    return {
        workOrderLayout: state.application.workOrderLayout,
        userData: state.application.userData,
        hiddenRegions: state.ui.hiddenRegions,
        applicationData: state.application.applicationData,
        isHiddenRegion: isHiddenRegion(state)(entityScreenCode),
        getHiddenRegionState: getHiddenRegionState(state)(entityScreenCode),
        getUniqueRegionID: getUniqueRegionID(state)(entityScreenCode),
    }
}

const CommentsESSContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError,
        updateMyWorkOrders,
        setLayoutProperty,
        updateApplication,
        toggleHiddenRegion,
        setRegionVisibility,
    }
)(CommentsESS)

export default CommentsESSContainer