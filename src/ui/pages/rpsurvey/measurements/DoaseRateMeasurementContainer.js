import {connect} from 'react-redux'
import {handleError, showError, showNotification} from '../../../../actions/uiActions'
import DoaseRateMeasurement from "./DoaseRateMeasurement";

function mapStateToProps(state) {
    return {
        userData: state.application.userData
    }
}

const DoaseRateMeasurementContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError
    }
)(DoaseRateMeasurement);

export default DoaseRateMeasurementContainer;