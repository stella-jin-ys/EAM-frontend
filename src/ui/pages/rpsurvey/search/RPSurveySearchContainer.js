import { connect } from 'react-redux';
import RPSurveySearch from './RPSurveySearch';
import { handleError } from "../../../../actions/uiActions";

function mapStateToProps(state) {
    return {
        workOrderScreen: state.application.userData.screens[state.application.userData.workOrderScreen]
    }
}

const RPSurveySearchContainer = connect(mapStateToProps, {
    handleError
})(RPSurveySearch);

export default RPSurveySearchContainer;