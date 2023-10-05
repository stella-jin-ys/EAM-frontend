import { connect } from "react-redux";
import { handleError } from "../../../actions/uiActions";
import StoreKiosk from "./StoreKiosk";

const mapStateToProps = (state, ownProps) => {
  return {
    workOrderScreen:
      state.application.userData.screens[
        state.application.userData.workOrderScreen
      ],
    applicationData: state.application.applicationData,
    scannedUser: state.scannedUser,
    userData: state.application.userData,
  };
};

const StoreKioskContainer = connect(mapStateToProps, {
  handleError,
})(StoreKiosk);

export default StoreKioskContainer;
