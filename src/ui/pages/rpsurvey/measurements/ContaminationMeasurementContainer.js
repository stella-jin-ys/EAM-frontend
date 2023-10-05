import {connect} from 'react-redux'
import {handleError, showError, showNotification} from '../../../../actions/uiActions'
import ContaminationMeasurement from "./ContaminationMeasurement";

function mapStateToProps(state) {
    return {
        userData: state.application.userData
    }
}

const ContaminationMeasurementContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError
    }
)(ContaminationMeasurement);

export default ContaminationMeasurementContainer;