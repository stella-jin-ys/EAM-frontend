import {connect} from 'react-redux';
import PickticketSearch from './PickticketSearch';
import {handleError} from "../../../../actions/uiActions";

function mapStateToProps(state) {
    return {
        pickTicketScreen: state.application.userData.screens[state.application.userData.pickTicketScreen]
    }
}

const PickticketSearchContainer = connect(mapStateToProps, {
    handleError
})(PickticketSearch)

export default PickticketSearchContainer