import { connect } from 'react-redux'
import SearchLogistics from './SearchLogistics'
import { handleError } from "../../../actions/uiActions";

const mapStateToProps = (state, ownProps) => {
    return {
  
    }
};


const SearchLogisticsContainer = connect(
    mapStateToProps, {
        handleError
      }
  )(SearchLogistics);
  
  export default SearchLogisticsContainer