import React, { Component } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import "../ApplicationLayout.css";
import "./EamlightMenu.css";
import EamlightMenuMyWorkorders from "./EamlightMenuMyWorkorders";
import EamlightMenuMyWorkordersRPSurvey from "./EamlightMenuMyWorkordersRPSurvey";
import EamlightMenuMyPicktickets from "./EamlightMenuMyPicktickets";
import EamlightMenuMyTeamWorkorders from "./EamlightMenuMyTeamWorkorders";
import EamlightMenuItem from "./EamlightMenuItem";
import AddIcon from "@material-ui/icons/Add";
import List from "@material-ui/icons/List";
import SearchIcon from "@material-ui/icons/Search";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import EamlightSubmenu from "./EamlightSubmenu";
import SpeedometerIcon from "mdi-material-ui/Speedometer";
import SyncIcon from "mdi-material-ui/Sync";
import AutorenewIcon from "mdi-material-ui/Autorenew";
import {
  PartIcon,
  WorkorderIcon,
  LogEntriesIcon,
} from "eam-components/dist/ui/components/icons";
import { Account, AccountMultiple, Settings } from "mdi-material-ui";
import ScreenChange from "./ScreenChange";
import { AssetIcon } from "eam-components/dist/ui/components/icons";
import { PositionIcon } from "eam-components/dist/ui/components/icons";
import { SystemIcon } from "eam-components/dist/ui/components/icons";

class EamlightMenu extends Component {
  constructor(props) {
    super(props);
    this.mainMenuClickHandler = this.mainMenuClickHandler.bind(this);
    this.openSubMenu = this.openSubMenu.bind(this);
  }

  mainMenuClickHandler(event) {
    // deactivate previous menu and submenu
    //this.menudiv.querySelector('#layout-tab-menu li > div.active').classList.remove('active');
    this.menudiv
      .querySelector("#menuscrollable > .layout-tab-submenu.active")
      .classList.remove("active");
    // activate current menu and submenu
    var rel = event.currentTarget.getAttribute("rel");
    event.currentTarget.classList.add("active");
    this.menudiv.querySelector("#" + rel).classList.add("active");
  }

  openSubMenu(rel) {
    // deactivate previous submenu
    this.menudiv
      .querySelector("#menuscrollable > .layout-tab-submenu.active")
      .classList.remove("active");
    // activate current submenu
    this.menudiv.querySelector("#" + rel).classList.add("active");
  }

  creationAllowed(screen) {
    return screen && this.props.userData.screens[screen].creationAllowed;
  }

  readAllowed(screen) {
    return screen && this.props.userData.screens[screen].readAllowed;
  }

  //
  // HEADERS
  //
  getWorkOrdersHeader() {
    return (
      <ScreenChange
        updateScreenLayout={this.props.updateWorkOrderScreenLayout}
        screen={this.props.userData.workOrderScreen}
        screens={Object.values(this.props.userData.screens).filter(
          (screen) => screen.parentScreen === "WSJOBS"
        )}
      />
    );
  }

  getAvaliableLogbooksHeader() {
    return (
      <ScreenChange
        updateScreenLayout={this.props.updateWorkOrderScreenLayout}
        screen={"WSJOBS"}
        screens={Object.values([
          {
            creationAllowed: true,
            deleteAllowed: true,
            gridId: null,
            hidden: null,
            parentScreen: "WSJOBS",
            readAllowed: true,
            screenCode: "WSJOBS",
            screenDesc: "Availale Logbooks",
            updateAllowed: true,
          },
          {
            creationAllowed: true,
            deleteAllowed: true,
            gridId: null,
            hidden: null,
            parentScreen: "SSPART",
            readAllowed: true,
            screenCode: "SSPART",
            screenDesc: "Parts",
            updateAllowed: true,
          },
        ]).filter((screen) => screen.parentScreen === "WSJOBS")}
      />
    );
  }

  getAssetsHeader() {
    return (
      <ScreenChange
        updateScreenLayout={this.props.updateAssetScreenLayout}
        screen={this.props.userData.assetScreen}
        screens={Object.values(this.props.userData.screens).filter(
          (screen) => screen.parentScreen === "OSOBJA"
        )}
      />
    );
  }

  getPositionsHeader() {
    return (
      <ScreenChange
        updateScreenLayout={this.props.updatePositionScreenLayout}
        screen={this.props.userData.positionScreen}
        screens={Object.values(this.props.userData.screens).filter(
          (screen) => screen.parentScreen === "OSOBJP"
        )}
      />
    );
  }

  getSystemsHeader() {
    return (
      <ScreenChange
        updateScreenLayout={this.props.updateSystemScreenLayout}
        screen={this.props.userData.systemScreen}
        screens={Object.values(this.props.userData.screens).filter(
          (screen) => screen.parentScreen === "OSOBJS"
        )}
      />
    );
  }

  getPartsHeader() {
    return (
      <ScreenChange
        updateScreenLayout={this.props.updatePartScreenLayout}
        screen={this.props.userData.partScreen}
        screens={Object.values(this.props.userData.screens).filter(
          (screen) => screen.parentScreen === "SSPART"
        )}
      />
    );
  }

  getLogisticsHeader() {
    return (
      <ScreenChange
        updateScreenLayout={this.props.updatePickTicketScreenLayout}
        screen={this.props.userData.pickTicketScreen}
        screens={Object.values(this.props.userData.screens).filter(
          (screen) => screen.parentScreen === "SSPICK"
        )}
      />
    );
  }

  //
  // RENDER
  //
  render() {
    const iconStyles = {
      width: 22,
      height: 22,
      color: "white",
    };

    const iconStyle1 = {
      width: 22,
      height: 22,
      color: "#ade6d8",
    };

    const menuIconStyle = {
      display: "inline-block",
      marginRight: 5,
      color: "#f7ce03",
      width: "100%",
      height: 36,
    };
    //logic to show the different menu in left side for reach app
    let leftMenu = "EAMMOBILE"; //default is EAM-Light search
    if (process.env.REACT_APP_PUBLIC_URL == "/logistics") {
      leftMenu = "LOGISTICS";
    } else if (process.env.REACT_APP_PUBLIC_URL == "/rpsurvey") {
      leftMenu = "RPSURVEY";
    } else if (process.env.REACT_APP_PUBLIC_URL == "/storekiosk") {
      leftMenu = "STOREKIOSK";
    }
    return (
      <div
        id="menu"
        ref={(menudiv) => {
          this.menudiv = menudiv;
        }}
      >
        <div id="menuscrollable">
          <ul id="layout-tab-menu">
            {/*-- This section is for MY and TEAM Work order - EAM - Light--> */}
            {/* {leftMenu === "EAMMOBILE" &&
                            <li>
                                <div rel="mywos" className="active" onClick={this.mainMenuClickHandler}>
                                    <Tooltip title="MY OPEN WOs" placement="right">
                                        <Account style={iconStyles} />
                                    </Tooltip>
                                    {!!this.props.myOpenWorkOrders.length && <div className="numberOfWorkOrders">
                                        {this.props.myOpenWorkOrders.length < 100 ? this.props.myOpenWorkOrders.length : '99+'}</div>}
                                </div>
                            </li>
                        }
                        {leftMenu === "EAMMOBILE" &&
                            <li>
                                <div rel="myteamwos" onClick={this.mainMenuClickHandler}>
                                    <Tooltip title="MY TEAM's WOs" placement="right">
                                        <AccountMultiple style={iconStyles} />
                                    </Tooltip>
                                    {!!this.props.myTeamWorkOrders.length && <div className="numberOfWorkOrders">
                                        {this.props.myTeamWorkOrders.length < 100 ? this.props.myTeamWorkOrders.length : '99+'}</div>}
                                </div>
                                </li>
                        } */}
            {/*<li> - May be remove
                            <div rel="mypts" className="active" onClick={this.mainMenuClickHandler}>
                                <Tooltip title="APPROVED PT" placement="right">
                                    <Account style={iconStyles} />
                                </Tooltip>
                                {!!this.props.myOpenPicktickets.length && <div className="numberOfWorkOrders">
                                    {this.props.myOpenPicktickets.length < 100 ? this.props.myOpenPicktickets.length : '99+'}</div>}
                            </div>
                        </li>*/}

            {/*------- This section is for Work order - EAM - Light-------> */}
            {leftMenu == "EAMMOBILE" && this.props.userData.workOrderScreen && (
              <li>
                <div rel="workorders" onClick={this.mainMenuClickHandler}>
                  <Tooltip title="WORK ORDERS" placement="right">
                    <WorkorderIcon style={iconStyles} />
                  </Tooltip>
                </div>
              </li>
            )}

            {/*------- This section is for RP SURVEY -------> */}
            {leftMenu == "RPSURVEY" && (
              <li>
                <div rel="rpsurvey" onClick={this.mainMenuClickHandler}>
                  <Tooltip title="RP Survey" placement="right">
                    <WorkorderIcon style={iconStyles} />
                  </Tooltip>
                </div>
              </li>
            )}
            {/*------- This section is for EQUIPMENT -------> */}
            {/*
                        {(this.props.userData.assetScreen || this.props.userData.positionScreen || this.props.userData.systemScreen) &&
                        <li>
                            <div rel="equipment" onClick={this.mainMenuClickHandler}>
                                <Tooltip title="EQUIPMENT" placement="right">
                                    <Settings style={iconStyles} />
                                </Tooltip>
                            </div>
                        </li>
                        }
                        */}
            {/*------- This section is for Materials -------> */}
            {/*
                        {this.props.userData.partScreen &&
                        <li>
                            <div rel="materials" onClick={this.mainMenuClickHandler}>
                                <Tooltip title="MATERIALS" placement="right">
                                    <PartIcon style={iconStyles} />
                                </Tooltip>
                            </div>
                        </li>
                        }*/}

            {/*------- This section is for LOGISTICS PICK TICKET -------> */}
            {leftMenu == "LOGISTICS" && (
              <li>
                <div rel="logistics" onClick={this.mainMenuClickHandler}>
                  <Tooltip title="Pick Ticket" placement="right">
                    <PartIcon style={iconStyle1} />
                  </Tooltip>
                </div>
              </li>
            )}
          
          </ul>
          {leftMenu == "EAMMOBILE" && (
            <EamlightMenuMyWorkorders
              myOpenWorkOrders={this.props.myOpenWorkOrders}
            />
          )}

          {leftMenu == "RPSURVEY" && (
            <EamlightMenuMyWorkordersRPSurvey
              myOpenWorkOrders={this.props.myOpenWorkOrders}
            />
          )}

          {leftMenu == "LOGISTICS" && (
            <EamlightMenuMyPicktickets
              approvedPicktickets={this.props.myOpenPicktickets}
            />
          )}

          <EamlightMenuMyTeamWorkorders
            myTeamWorkOrders={this.props.myTeamWorkOrders}
            eamAccount={this.props.userData.eamAccount}
          />

          {this.props.userData.workOrderScreen && (
            <EamlightSubmenu
              id="workorders"
              header={this.getWorkOrdersHeader()}
            >
              {this.props.userData.screens[this.props.userData.workOrderScreen]
                .creationAllowed && (
                <EamlightMenuItem
                  label="New Work Order"
                  icon={<AddIcon style={menuIconStyle} />}
                  link="workorder"
                />
              )}

              {this.props.userData.screens[this.props.userData.workOrderScreen]
                .readAllowed && (
                <EamlightMenuItem
                  label={
                    "Search " +
                    this.props.userData.screens[
                      this.props.userData.workOrderScreen
                    ].screenDesc
                  }
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="wosearch"
                />
              )}
              <EamlightMenuItem
                label="Meter Reading"
                icon={<SpeedometerIcon style={menuIconStyle} />}
                link="meterreading"
              />
              <EamlightMenuItem
                label="Offline"
                icon={<SyncIcon style={menuIconStyle} />}
                link="wosyn"
              />
            </EamlightSubmenu>
          )}

          <EamlightSubmenu id="rpsurvey" header={this.getWorkOrdersHeader()}>
            {this.props.userData.screens[this.props.userData.workOrderScreen]
              .creationAllowed && (
              <EamlightMenuItem
                label="Create RP Survey"
                icon={<AddIcon style={menuIconStyle} />}
                link="rpsurvey"
              />
            )}

            {this.props.userData.screens[this.props.userData.workOrderScreen]
              .readAllowed && (
              <EamlightMenuItem
                label={"Search RP Survey"}
                icon={<SearchIcon style={menuIconStyle} />}
                link="rpsurveysearch"
              />
            )}
          </EamlightSubmenu>

          {this.props.userData.workOrderScreen && (
            <EamlightSubmenu
              id="logentries"
              header={this.getAvaliableLogbooksHeader()}
            >
              {this.props.userData.screens[this.props.userData.workOrderScreen]
                .creationAllowed && (
                <EamlightMenuItem
                  label="CRG Logbook Non LHC"
                  icon={<List style={menuIconStyle} />}
                  link="workorder"
                />
              )}

              {this.props.userData.screens[this.props.userData.workOrderScreen]
                .creationAllowed && (
                <EamlightMenuItem
                  label="CRG Logbook LHC"
                  icon={<List style={menuIconStyle} />}
                  link="workorder"
                />
              )}

              {this.props.userData.screens[this.props.userData.workOrderScreen]
                .creationAllowed && (
                <EamlightMenuItem
                  label="New Logbook Entry"
                  icon={<AddIcon style={menuIconStyle} />}
                  link="logentries"
                />
              )}

              {this.props.userData.screens[this.props.userData.workOrderScreen]
                .readAllowed && (
                <EamlightMenuItem
                  label={
                    "All Cyro Ready loss Records" +
                    this.props.userData.screens[
                      this.props.userData.workOrderScreen
                    ].screenDesc
                  }
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="wosearch"
                />
              )}

              {this.props.userData.screens[this.props.userData.workOrderScreen]
                .readAllowed && (
                <EamlightMenuItem
                  label={
                    "All Open Records" +
                    this.props.userData.screens[
                      this.props.userData.workOrderScreen
                    ].screenDesc
                  }
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="wosearch"
                />
              )}

              {this.props.userData.screens[this.props.userData.workOrderScreen]
                .readAllowed && (
                <EamlightMenuItem
                  label={
                    "All Records" +
                    this.props.userData.screens[
                      this.props.userData.workOrderScreen
                    ].screenDesc
                  }
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="wosearch"
                />
              )}

              {this.props.userData.screens[this.props.userData.workOrderScreen]
                .readAllowed && (
                <EamlightMenuItem
                  label={
                    "All ongoing operations" +
                    this.props.userData.screens[
                      this.props.userData.workOrderScreen
                    ].screenDesc
                  }
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="wosearch"
                />
              )}

              {this.props.userData.screens[this.props.userData.workOrderScreen]
                .readAllowed && (
                <EamlightMenuItem
                  label={
                    "Lat two weeks creation" +
                    this.props.userData.screens[
                      this.props.userData.workOrderScreen
                    ].screenDesc
                  }
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="wosearch"
                />
              )}

              {this.props.userData.screens[this.props.userData.workOrderScreen]
                .readAllowed && (
                <EamlightMenuItem
                  label={
                    "P1 ATLAS Logbook" +
                    this.props.userData.screens[
                      this.props.userData.workOrderScreen
                    ].screenDesc
                  }
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="wosearch"
                />
              )}

              {this.props.userData.screens[this.props.userData.workOrderScreen]
                .readAllowed && (
                <EamlightMenuItem
                  label={
                    "P18-P2 Logbook" +
                    this.props.userData.screens[
                      this.props.userData.workOrderScreen
                    ].screenDesc
                  }
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="wosearch"
                />
              )}

              {this.props.userData.screens[this.props.userData.workOrderScreen]
                .readAllowed && (
                <EamlightMenuItem
                  label={
                    "P4 Logbook" +
                    this.props.userData.screens[
                      this.props.userData.workOrderScreen
                    ].screenDesc
                  }
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="wosearch"
                />
              )}

              {this.props.userData.screens[this.props.userData.workOrderScreen]
                .readAllowed && (
                <EamlightMenuItem
                  label={
                    "P5 CMS Logbook" +
                    this.props.userData.screens[
                      this.props.userData.workOrderScreen
                    ].screenDesc
                  }
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="wosearch"
                />
              )}
            </EamlightSubmenu>
          )}

          {(this.props.userData.assetScreen ||
            this.props.userData.positionScreen ||
            this.props.userData.systemScreen) && (
            <EamlightSubmenu id="equipment" header={<a href="#">EQUIPMENT</a>}>
              {this.props.userData.assetScreen && (
                <EamlightMenuItem
                  label="Assets"
                  icon={<AssetIcon style={menuIconStyle} />}
                  onClick={this.openSubMenu.bind(this, "assets")}
                />
              )}

              {this.props.userData.positionScreen && (
                <EamlightMenuItem
                  label="Positions"
                  icon={<PositionIcon style={menuIconStyle} />}
                  onClick={this.openSubMenu.bind(this, "positions")}
                />
              )}

              {this.props.userData.locationScreen && (
                <EamlightMenuItem
                  label="Locations"
                  icon={<PositionIcon style={menuIconStyle} />}
                  onClick={this.openSubMenu.bind(this, "locations")}
                />
              )}

              {/*{ this.props.userData.systemScreen &&
                        <EamlightMenuItem label="Systems"
                                          icon={<SystemIcon style={menuIconStyle}/>}
                                          onClick={this.openSubMenu.bind(this, 'systems')}/>
                        }*/}
              {/*
                        {this.props.userData.assetScreen && this.props.userData.screens[this.props.userData.assetScreen].updateAllowed &&
                        <EamlightMenuItem label="Replace Equipment"
                                          icon={<AutorenewIcon style={menuIconStyle}/>}
                        link="replaceeqp"/>}
                        */}
            </EamlightSubmenu>
          )}

          {this.props.userData.assetScreen && (
            <EamlightSubmenu id="assets" header={this.getAssetsHeader()}>
              {this.creationAllowed(this.props.userData.assetScreen) && (
                <EamlightMenuItem
                  label="New Asset"
                  icon={<AddIcon style={menuIconStyle} />}
                  link="asset"
                />
              )}

              {this.readAllowed(this.props.userData.assetScreen) && (
                <EamlightMenuItem
                  label={
                    "Search " +
                    this.props.userData.screens[this.props.userData.assetScreen]
                      .screenDesc
                  }
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="assetsearch"
                />
              )}

              <EamlightMenuItem
                label="Back to Equipment"
                icon={<ArrowBackIcon style={menuIconStyle} />}
                onClick={this.openSubMenu.bind(this, "equipment")}
              />
            </EamlightSubmenu>
          )}

          {this.props.userData.locationScreen && (
            <EamlightSubmenu id="locations" header={this.getPositionsHeader()}>
              {/*
                        {this.creationAllowed(this.props.userData.locationScreen)  &&
                        <EamlightMenuItem label="New Location"
                                          icon={<AddIcon style={menuIconStyle}/>}
                                          link="location"/>
                        }
                        */}
              {this.readAllowed(this.props.userData.locationScreen) && (
                <EamlightMenuItem
                  label={
                    "Search " +
                    this.props.userData.screens[
                      this.props.userData.locationScreen
                    ].screenDesc
                  }
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="locationsearch"
                />
              )}

              <EamlightMenuItem
                label="Back to Equipment"
                icon={<ArrowBackIcon style={menuIconStyle} />}
                onClick={this.openSubMenu.bind(this, "equipment")}
              />
            </EamlightSubmenu>
          )}

          {this.props.userData.positionScreen && (
            <EamlightSubmenu id="positions" header={this.getPositionsHeader()}>
              {/*{this.creationAllowed(this.props.userData.positionScreen)  &&
                        <EamlightMenuItem label="New Position"
                                          icon={<AddIcon style={menuIconStyle}/>}
                                          link="position"/>
                        }*/}

              {this.readAllowed(this.props.userData.positionScreen) && (
                <EamlightMenuItem
                  label={
                    "Search " +
                    this.props.userData.screens[
                      this.props.userData.positionScreen
                    ].screenDesc
                  }
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="positionsearch"
                />
              )}

              <EamlightMenuItem
                label="Back to Equipment"
                icon={<ArrowBackIcon style={menuIconStyle} />}
                onClick={this.openSubMenu.bind(this, "equipment")}
              />
            </EamlightSubmenu>
          )}

          {this.props.userData.systemScreen && (
            <EamlightSubmenu id="systems" header={this.getSystemsHeader()}>
              {this.creationAllowed(this.props.userData.systemScreen) && (
                <EamlightMenuItem
                  label="New System"
                  icon={<AddIcon style={menuIconStyle} />}
                  link="system"
                />
              )}

              {this.readAllowed(this.props.userData.systemScreen) && (
                <EamlightMenuItem
                  label={
                    "Search " +
                    this.props.userData.screens[
                      this.props.userData.systemScreen
                    ].screenDesc
                  }
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="systemsearch"
                />
              )}

              <EamlightMenuItem
                label="Back to Equipment"
                icon={<ArrowBackIcon style={menuIconStyle} />}
                onClick={this.openSubMenu.bind(this, "equipment")}
              />
            </EamlightSubmenu>
          )}

          {this.props.userData.partScreen && (
            <EamlightSubmenu id="materials" header={this.getPartsHeader()}>
              {this.props.userData.screens[this.props.userData.partScreen]
                .creationAllowed && (
                <EamlightMenuItem
                  label="New Part"
                  icon={<AddIcon style={menuIconStyle} />}
                  link="part"
                />
              )}

              {this.props.userData.screens[this.props.userData.partScreen]
                .readAllowed && (
                <EamlightMenuItem
                  label={
                    "Search " +
                    this.props.userData.screens[this.props.userData.partScreen]
                      .screenDesc
                  }
                  icon={<SearchIcon style={menuIconStyle} />}
                  link="partsearch"
                />
              )}
            </EamlightSubmenu>
          )}
          {this.props.userData.pickTicketScreen && (
            <EamlightSubmenu id="logistics" header={this.getLogisticsHeader()}>
              <EamlightMenuItem
                label="Create Pick Ticket"
                icon={<AddIcon style={menuIconStyle} />}
                link="pickticket"
              />

              <EamlightMenuItem
                label={"Review Pick Tickets"}
                icon={<SearchIcon style={menuIconStyle} />}
                link="pickticketsearch"
              />
              <EamlightMenuItem
                label={
                  "Issue/Return " +
                  this.props.userData.screens[
                    this.props.userData.pickTicketScreen
                  ].screenDesc
                }
                icon={<ErrorOutlineIcon style={menuIconStyle} />}
                link="pickticketissuereturn"
              />
              <EamlightMenuItem
                label={"Bin to Bin Transter "}
                icon={<SwapHorizIcon style={menuIconStyle} />}
                link="bintobin"
              />
            </EamlightSubmenu>
          )}
        </div>
      </div>
    );
  }
}

export default EamlightMenu;
