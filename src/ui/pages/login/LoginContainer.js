import {connect} from 'react-redux'
import Login from './Login'
import {handleError, showError, showNotification} from '../../../actions/uiActions'
import {updateInforContext} from "../../../actions/inforContextActions";
import {getUserInfo} from '../../../actions/applicationActions';

function mapStateToProps(state) {
    return {
        inforContext: state.inforContext
    }
}

const LoginContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError,
        updateInforContext,
        getUserInfo
    }
)(Login)

export default LoginContainer
