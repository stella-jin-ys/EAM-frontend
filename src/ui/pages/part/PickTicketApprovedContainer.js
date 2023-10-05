import {connect} from 'react-redux'
import {
    handleError, setLayoutProperty, showError, showNotification,
    toggleHiddenRegion
} from '../../../actions/uiActions';

import PickTicketApproved from "./PickTicketApproved";

function mapStateToProps(state) {
    return {
        userData: state.application.userData
    }
}

const PickTicketApprovedContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError
    }
)(PickTicketApproved);

export default PickTicketApprovedContainer;