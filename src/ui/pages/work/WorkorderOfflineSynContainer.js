import {connect} from 'react-redux'
import {handleError, showError, showNotification} from '../../../actions/uiActions'
import WorkorderOfflineSyn from "./WorkorderOfflineSyn";

function mapStateToProps(state) {
    return {
        userData: state.application.userData
    }
}

const WorkorderOfflineSynContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError
    }
)(WorkorderOfflineSyn);

export default WorkorderOfflineSynContainer;