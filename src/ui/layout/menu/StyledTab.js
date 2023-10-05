import {withStyles} from "@material-ui/core";
import Tab from "@material-ui/core/Tab";

const StyledTab = withStyles({
    root: {
        width: 50,
        minWidth: 50,
        color: "white"
    }
})(Tab)

export default StyledTab;