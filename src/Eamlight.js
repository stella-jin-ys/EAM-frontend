import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  HashRouter,
} from "react-router-dom";
import ApplicationLayoutContainer from "./ui/layout/ApplicationLayoutContainer";
import EamlightMenuContainer from "./ui/layout/menu/EamlightMenuContainer";
import RPSurveyContainer from "./ui/pages/rpsurvey/RPSurveyContainer";
import RPSurveySearchContainer from "./ui/pages/rpsurvey/search/RPSurveySearchContainer";
import WorkorderContainer from "./ui/pages/work/WorkorderContainer";
import WorkorderSearchContainer from "./ui/pages/work/search/WorkorderSearchContainer";
import PartSearchContainer from "./ui/pages/part/search/PartSearchContainer";
import AssetSearchContainer from "./ui/pages/equipment/asset/search/AssetSearchContainer";
import PositionSearchContainer from "./ui/pages/equipment/position/search/PositionSearchContainer";
import SystemSearchContainer from "./ui/pages/equipment/system/search/SystemSearchContainer";
import LocationSearchContainer from "./ui/pages/equipment/location/search/LocationSearchContainer";
import BlockUi from "react-block-ui";
import InfoPage from "./ui/components/infopage/InfoPage";
import ESSDocLinkIframe from "./ui/components/iframes/ESSDocLinkIframe";
import ImpactContainer from "./ui/components/impact/ImpactContainer";
import "./Eamlight.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import PartContainer from "./ui/pages/part/PartContainer";
//import WorkorderOfflineSynContainer from "./ui/pages/work/WorkorderOfflineSynContainer";
import SearchContainer from "./ui/pages/search/SearchContainer";
import SearchLogisticsContainer from "./ui/pages/search/SearchLogisticsContainer";
import ReplaceEqpContainer from "./ui/pages/equipment/replaceeqp/ReplaceEqpContainer";
import { ThemeProvider } from "@material-ui/core/styles";
import EquipmentRedirect from "./ui/pages/equipment/EquipmentRedirect";
import MeterReadingContainer from "./ui/pages/meter/MeterReadingContainer";
import EquipmentContainer from "./ui/pages/equipment/EquipmentContainer";
import { theme } from "eam-components/dist/ui/components/theme";
import LoginContainer from "./ui/pages/login/LoginContainer";
import PickticketContainer from "./ui/pages/part/PickticketContainer";
import PickticketSearchContainer from "./ui/pages/part/search/PickticketSearchContainer";
import PickticketIssueReturnContainer from "./ui/pages/part/PickticketIssueReturnContainer";
import BinToBin from "./ui/pages/part/BinToBin";
import CommentsESSContainer from "./ui/components/commentsESS/CommentsESSContainer";
import Grid from "./ui/pages/grid/Grid";
import JMTIntegrationContainer from "./ui/components/jmt/JMTIntegrationContainer";
import EqpTree from "./ui/components/eqtree/EqpTree";
import InstallEqpContainer from "./ui/pages/equipment/installeqp/InstallEqpContainer";
import Themes from "eam-components/dist/ui/components/theme";
import config from "./config";
import StoreKioskContainer from "./ui/pages/kiosk/StoreKioskContainer";
import StoreKiosk from "./ui/pages/kiosk/StoreKiosk";
import Issue from "./ui/pages/kiosk/Issue";
import Return from "./ui/pages/kiosk/Return";
import IssuePart from "./ui/pages/kiosk/IssuePart";
import ReturnPart from "./ui/pages/kiosk/ReturnPart";
import SearchPart from "./ui/pages/kiosk/SearchPart";

class Eamlight extends Component {
  blockUiStyle = {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  blockUiStyleDiv = {
    display: "flex",
    height: 60,
    alignItems: "flex-end",
  };

  render() {
    // Display login screen

    const eqpRegex = ["/asset", "/position", "/system", "/location"].map(
      (e) => `${e}/:code(.+)?`
    );

    const selectedTheme =
      Themes[
        config.theme[this.props.applicationData.EL_ENVIR] ||
          config.theme.DEFAULT
      ] || Themes.DANGER;

    // Render real application once user data is there and user has an EAM account

    //set the home page of the app
    let homePage = SearchContainer; //default is EAM-Light search
    if (process.env.REACT_APP_PUBLIC_URL == "/logistics") {
      homePage = SearchLogisticsContainer;
    } else if (process.env.REACT_APP_PUBLIC_URL == "/rpsurvey") {
      homePage = RPSurveySearchContainer;
    } else if (process.env.REACT_APP_PUBLIC_URL == "/storekiosk") {
      homePage = StoreKiosk;
    }
    return (
      <HashRouter basename={process.env.REACT_APP_PUBLIC_URL}>
        <ThemeProvider theme={selectedTheme}>
          <Switch>
            <Route exact path="/impact" component={ImpactContainer} />
            <Route path="/jmt" component={JMTIntegrationContainer} />
            <Route path="/eqptree" component={EqpTree} />
            <ApplicationLayoutContainer>
              {homePage !== StoreKiosk && <EamlightMenuContainer />}
              <div style={{ height: "100%" }}>
                {/* ----------Home page for each application-------- */}

                {<Route exact path="/" component={homePage} />}

                <Route
                  exact
                  path="/workorder/:code?"
                  component={WorkorderContainer}
                />

                <Route
                  exact
                  path="/wosearch"
                  component={WorkorderSearchContainer}
                />
                {/*     <Route exact path="/wosyn"
                                                               component={WorkorderOfflineSynContainer} />  */}

                <Route
                  exact
                  path="/rpsurvey/:code?"
                  component={RPSurveyContainer}
                />

                <Route
                  exact
                  path="/rpsurveysearch"
                  component={RPSurveySearchContainer}
                />

                <Route exact path="/part/:code?" component={PartContainer} />
                <Route
                  exact
                  path="/partsearch"
                  component={PartSearchContainer}
                />

                <Route
                  exact
                  path="/assetsearch"
                  component={AssetSearchContainer}
                />

                <Route
                  exact
                  path="/positionsearch"
                  component={PositionSearchContainer}
                />

                <Route path="/systemsearch" component={SystemSearchContainer} />

                <Route
                  path="/locationsearch"
                  component={LocationSearchContainer}
                />

                <Route
                  exact
                  path="/systemsearch"
                  component={SystemSearchContainer}
                />

                <Route
                  exact
                  path="/equipment/:code?"
                  component={EquipmentRedirect}
                />

                <Route
                  exact
                  path="/replaceeqp"
                  component={ReplaceEqpContainer}
                />

                <Route
                  exact
                  path="/meterreading"
                  component={MeterReadingContainer}
                />

                <Route
                  exact
                  path="/documentsLink"
                  component={ESSDocLinkIframe}
                />

                <Route
                  exact
                  path="/pickticket/:code?"
                  component={PickticketContainer}
                />

                <Route
                  exact
                  path="/pickticketsearch"
                  component={PickticketSearchContainer}
                />

                <Route
                  exact
                  path="/pickticketissuereturn"
                  component={PickticketIssueReturnContainer}
                />

                <Route exact path="/bintobin" component={BinToBin} />

                <Route
                  exact
                  path="/commentsess"
                  component={CommentsESSContainer}
                />

                <Route exact path="/issue" component={Issue} />

                <Route exact path="/return" component={Return} />
                <Route exact path="/returnpart" component={ReturnPart} />

                <Route exact path="/searchpart" component={SearchPart} />

                <Route exact path={eqpRegex} component={EquipmentContainer} />
              </div>
            </ApplicationLayoutContainer>
          </Switch>
        </ThemeProvider>
      </HashRouter>
    );
  }
}

export default Eamlight;
