import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLayoutProperty } from "../../actions/uiActions";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Menu from "mdi-material-ui/Menu";
import "./ApplicationLayout.css";
import UserInfoContainer from "./UserInfoContainer";
import {
  Console,
  FileTree,
  FormatHorizontalAlignLeft,
  FormatHorizontalAlignRight,
} from "mdi-material-ui";
import { useLocation } from "react-router-dom";
import { useTheme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import ScanUser from "../../ui/components/servicelogin/ScanUser";

const styles = {
  topBarLink: {
    color: "white",
    textDecoration: "none",
    fontWeight: "900",
    fontSize: "18px",
  },
  topBarSpan: {
    fontSize: "12px",
  },
};

export default withStyles(styles)(function ApplicationLayout(props) {
  const {
    classes,
    applicationData,
    userData,
    scannedUser,
    updateScannedUser,
    handleError,
    showNotification,
  } = props;

  //const environment = applicationData.EL_ENVIR;
  const environment = process.env.REACT_APP_PUBLIC_ENV; //ESS

  const [menuCompacted, setMenuCompacted] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const showEqpTree = useSelector((state) => state.ui.layout.showEqpTree);
  const showEqpTreeButton = useSelector(
    (state) => state.ui.layout.showEqpTreeButton
  );
  const location = useLocation();

  const menuIconStyle = {
    color: "white",
    fontSize: 18,
  };

  let headerTitle = "EAM Mobile"; //default is EAM-Light search
  if (process.env.REACT_APP_PUBLIC_URL == "/logistics") {
    headerTitle = "Logistics";
  } else if (process.env.REACT_APP_PUBLIC_URL == "/rpsurvey") {
    headerTitle = "RP Survey";
  } else if (process.env.REACT_APP_PUBLIC_URL == "/storekiosk") {
    headerTitle = "EAM Store Kiosk";
  }
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.get("maximize") && setMenuCompacted(true);
  }, []);

  const topbar = (
    <div id="topbar" style={{ backgroundColor: theme.palette.primary.main }}>
      <div id="topbar-left">
        <Link to="/" className={clsx(classes.topBarLink)}>
          {headerTitle}
        </Link>
        {environment !== "PROD" && (
          <span className={clsx(classes.topBarSpan)}>{environment}</span>
        )}
      </div>

      <div id="topbar-right">
        <div id="menu-resize-btn">
          <IconButton onClick={() => setMenuCompacted(!menuCompacted)}>
            {menuCompacted ? (
              <FormatHorizontalAlignRight style={menuIconStyle} />
            ) : (
              <FormatHorizontalAlignLeft style={menuIconStyle} />
            )}
          </IconButton>
        </div>
        <div id="mobile-menu-btn">
          <IconButton onClick={() => setMobileMenuActive(!mobileMenuActive)}>
            <Menu style={menuIconStyle} />
          </IconButton>
        </div>

        {showEqpTreeButton && (
          <div id="eqp-tree-btn">
            <div
              style={{
                borderLeft: "1px solid rgba(255, 255, 255, 0.8)",
                height: 22,
              }}
            />
            <IconButton
              onClick={() =>
                dispatch(setLayoutProperty("showEqpTree", !showEqpTree))
              }
            >
              <FileTree style={menuIconStyle} />
            </IconButton>
          </div>
        )}

        <UserInfoContainer />
      </div>
    </div>
  );

  const startsWithString = "https://inforos-test.cern.ch";
  const isInsideIframe = window.self !== window.top;
  const showTopBar = !(
    document.referrer.startsWith(startsWithString) && isInsideIframe
  );

  // const showScan = applicationData.serviceAccounts && applicationData.serviceAccounts.includes( userData.eamAccount.userCode) && (!scannedUser || !scannedUser.userCode)
  //     && <ScanUser
  //             updateScannedUser={updateScannedUser}
  //             showNotification={showNotification}
  //             handleError={handleError}
  //         />;

  if ((headerTitle = "EAM Store Kiosk")) {
    return (
      <div
        id="maindiv"
        className="SlimMenu"
        onClick={() => setMobileMenuActive(false)}
      >
        {showTopBar && topbar}
        <div id="layout-container">
          {props.children[0] && (
            <div
              id="layout-menu-cover"
              className="active"
              onClick={(event) => event.stopPropagation()}
            >
              {props.children[0]}
            </div>
          )}
          <div id="layout-portlets-cover">{props.children[1]}</div>
        </div>
        {/* {showScan} */}
      </div>
    );
  } else {
    return (
      <div
        id="maindiv"
        className={menuCompacted ? "SlimMenu" : ""}
        onClick={() =>
          !menuCompacted && mobileMenuActive && setMobileMenuActive(false)
        }
      >
        {showTopBar && topbar}
        <div id="layout-container">
          {props.children[0] && (
            <div
              id="layout-menu-cover"
              className={mobileMenuActive ? "active" : ""}
              onClick={(event) => event.stopPropagation()}
            >
              {props.children[0]}
            </div>
          )}
          <div id="layout-portlets-cover">{props.children[1]}</div>
        </div>
        {/* {showScan} */}
      </div>
    );
  }
});
