import {connect} from 'react-redux'
import Logentries from '../log/Logentries'
import {showNotification, showError, handleError, setLayoutProperty} from '../../../actions/uiActions'
import {updateMyWorkOrders} from '../../../actions/workorderActions'
import {updateApplication} from '../../../actions/applicationActions'
import {toggleHiddenRegion} from "../../../actions/uiActions";

function mapStateToProps(state) {
    return {
        workOrderLayout: state.application.workOrderLayout,
        userData: state.application.userData,
        hiddenRegions: state.ui.hiddenRegions,
        applicationData: state.application.applicationData
    }
}

const LogentriesContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError,
        updateMyWorkOrders,
        setLayoutProperty,
        updateApplication,
        toggleHiddenRegion,
    }
)(Logentries)

export default LogentriesContainer