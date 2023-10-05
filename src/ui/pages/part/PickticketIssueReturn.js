import React from 'react';
import EamlightToolbar from '../../components/EamlightToolbar';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import Grid from '@material-ui/core/Grid';
import WSPicktickets from '../../../tools/WSPicktickets';
import PickticketIssueReturnGeneral from "./PickticketIssueReturnGeneral";
import UserDefinedFields from "../../components/userdefinedfields/UserDefinedFields";
import PickticketStock from "./PickticketStock";
import PickticketExtendedView from "./PickticketExtendedView";
import CustomFields from '../../components/customfields/CustomFields';
import PickticketWhereUsed from "./PickticketWhereUsed";
import Entity from '../Entity';
import PickticketTools from "./PickticketTools";
import {PartIcon} from 'eam-components/dist/ui/components/icons'
import PartToolbar from "./PartToolbar";
import EDMSDoclightIframeContainer from "../../components/iframes/EDMSDoclightIframeContainer";
import { TOOLBARS } from '../../components/AbstractToolbar';
import PartUsagePickTicketContainer from "./partusage/PartUsagePickTicketContainer";
import PickTicketTools from "./PickticketTools";
import PickTicketApprovedContainer from "./PickTicketApprovedContainer";
import EamlightToolbarContainer from './../../components/EamlightToolbarContainer';
import {ENTITY_TYPE} from "../../components/Toolbar";
import EntityRegions from '../../components/entityregions/EntityRegions';
import { getTabAvailability, getTabInitialVisibility } from '../EntityTools';
import { TAB_CODES } from '../../components/entityregions/TabCodeMapping';
import PartTools from "./PartTools";
import pickticket from "./Pickticket";
import Comments from 'eam-components/dist/ui/components/comments/Comments';

const PICKTICKETISSUERETURN = 'PICKTICKETISSUERETURN';
const SSPICK = 'SSPICK';

class pickticketissuereturn extends Entity {

    constructor(props) {
        super(props)
        this.props.setLayoutProperty('showEqpTreeButton', false)
    }
    //
    // SETTINGS OBJECT USED BY ENTITY CLASS
    //
    settings = {
        userData: this.props.userData,
        entity: 'pickticketissuereturn',
        entityDesc: 'Issue Return',
        entityURL: '/pickticketissuereturn/',
        entityCodeProperty: 'picklistissuereturn',
        entityScreen: this.props.userData && this.props.userData.screens[this.props.userData.pickTicketScreen],
        renderEntity: this.renderPickticket.bind(this),
        readEntity: WSPicktickets.getPart.bind(WSPicktickets),
        updateEntity: WSPicktickets.updatePart.bind(WSPicktickets),
        createEntity: WSPicktickets.createPickTicket.bind(WSPicktickets),
        //deleteEntity: WSPicktickets.deletePart.bind(WSPicktickets),
        //initNewEntity: () => WSPicktickets.initPickticket(PICKTICKETISSUERETURN, SSPICK, this.props.userData.screens[this.props.userData.pickTicketScreen].screenCode, this.props.location.search),
        initNewEntity: WSPicktickets.initPickticket.bind(WSPicktickets, "PICK"),
        //initNewEntity: () => WSWorkorder.initWorkOrder(PICKTICKET, SSPICK,
        //this.props.userData && this.props.userData.screens[this.props.userData.pickTicketScreen].screenCode, this.props.location.search)
        layout: this.props.pickTicketLayout,
        layoutPropertiesMap: PickticketTools.layoutPropertiesMap,
    };

    getRegions = () => {
        const {
            applicationData,
            handleError,
            showError,
            showNotification,
            userData,
            pickTicketLayout
        } = this.props;
        const { layout, pickticket, equipmentMEC } = this.state;
        const {tabs} = pickTicketLayout;
        console.log("getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW):",getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW));
        const commonProps = {
            pickticket,
            layout,
            pickTicketLayout,
            pickticketissuereturn: this.state.pickticketissuereturn,
            userData,
            updatepickticketProperty: this.updateEntityProperty.bind(this),
            children: this.children
            //setWOEquipment: this.setWOEquipment - vivek
        };

        return [
            {
                id: 'DETAILS',
                label: 'Details',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () =>
                    <PickticketIssueReturnGeneral
                        {...commonProps}
                        applicationData={applicationData}
                        userData={userData} />
                ,
                column: 0,
                order: 0,
                //ignore: !getTabAvailability(tabs, TAB_CODES.EQUIPMENT_TAB_WO_SCREEN),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id: 'PICK TICKETS',
                label: 'Pick Tickets',
                isVisibleWhenNewEntity: true,
                maximizable: true,
                render: () =>
                    <PickTicketApprovedContainer
                        {...commonProps}
                        store={this.state.pickticketissuereturn.store}
                        pickticket={this.state.pickticketissuereturn}
                        applicationData={applicationData}
                        userData={userData} />
                ,
                column: 0,
                order: 0,
                //ignore: !getTabAvailability(tabs, TAB_CODES.EQUIPMENT_TAB_WO_SCREEN),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
             
            
        ]
    }



    
    //
    //
    //
    // getRegions = () => {
    //     let user = this.props.userData.eamAccount.userCode
    //     let screen = this.props.userData.screens[this.props.userData.partScreen].screenCode
    //     return {
    //         PARTSTOCK: {label: "Part Stock", code: user + "_" + screen+ "_PARTSTOCK"},
    //         //WHEREUSED: {label: "Where Used", code: user + "_" + screen+ "_WHEREUSED"},
    //         //USERDEFFIELDS: {label: "User Defined Fields", code: user + "_" + screen+ "_USERDEFFIELDS"},
    //         //COMMENTS: {label: "Comments", code: user + "_" + screen+ "_COMMENTS"},
    //         //CUSTOMFIELDS: {label: "Custom Fields", code: user + "_" + screen+ "_CUSTOMFIELDS"}
    //     }
    // }
     //
    // CALLBACKS FOR ENTITY CLASS
    //
    postInit() {
        this.setStore();
        this.setTransactionType();
        this.setPickTicketChoice();
    }

    postCreate() {
        this.comments.wrappedInstance.createCommentForNewEntity();
    }

    postUpdate() {
        this.comments.wrappedInstance.createCommentForNewEntity();
    }

    postRead(pickticketissuereturn) {
        this.setStore();
        this.setTransactionType();
        this.setPickTicketChoice();
    }

    
    //
    // DROP DOWN VALUES
    //
    setStore = () => {
        WSPicktickets.getStores().then(response => {
            this.setLayout({getStores: response.body.data});
        }).catch(error => {
            this.props.handleError(error);
            this.setLayout({blocking: false});
        });
    };
//
    // DROP DOWN VALUES FOR TRANSACTION TYPE
    //
    setTransactionType = () => {
        WSPicktickets.getTransactionTypes().then(response => {
            this.setLayout({getTransactionTypes: response.body.data});
        }).catch(error => {
            this.props.handleError(error);
            this.setLayout({blocking: false});
        });
    };
    // DROP DOWN VALUES FOR PICK TICKET CHOICE
    //
    setPickTicketChoice = () => {
        WSPicktickets.getPickTicketChoice().then(response => {
            this.setLayout({getPickTicketChoice: response.body.data});
        }).catch(error => {
            this.props.handleError(error);
            this.setLayout({blocking: false});
        });
    };
    

    finishStatusHandler() {
        this.state.pickticketissuereturn.pickticketstatus="F";
        this.updateEntityProperty("pickticketstatus", "F");
    }
    unFinishStatusHandle() {
        this.state.pickticketissuereturn.pickticketstatus="U";
        this.updateEntityProperty("pickticketstatus", "U");
    }
    
    onChangeHandler() {
        this.state.pickticketissuereturn.store = this.state.pickticketissuereturn.store;
    }

    renderPickticket() {
        const { layout } = this.state;
        const {
            applicationData,
            getUniqueRegionID,
            history,
            isHiddenRegion,
            setRegionVisibility,
            getHiddenRegionState,
            toggleHiddenRegion,
            userData
        } = this.props;
        const regions = this.getRegions();
        console.log("regions:",regions);
        let props = {
            pickticketissuereturn: this.state.pickticketissuereturn,
            userData: this.props.userData,
            updatepickticketProperty: this.updateEntityProperty.bind(this),
            layout: this.state.layout,
            pickTicketLayout: this.props.pickTicketLayout,
            children: this.children,
            onChangeHandler : this.onChangeHandler.bind(this)
        };
    
        console.log("pickticketissuereturn----", pickticketissuereturn);
        console.log("pickTicketLayout-----", this.props.pickTicketLayout);
        //Normal pickticket screen
        return (
            <div className="entityContainer">
                <BlockUi tag="div" blocking={this.state.layout.blocking} style={{height: "100%", width: '100%'}}>

                    {/* <EamlightToolbar isModified={this.state.layout.isModified}
                                     newEntity={this.state.layout.newEntity}
                                     entityScreen={this.props.userData.screens[this.props.userData.pickTicketScreen]}
                                     entityName={this.settings.entityDesc}
                                     entityKeyCode={this.state.pickticketissuereturn.picklistissuereturn}
                                     saveHandler={this.saveHandler.bind(this)}
                                     finishStatusHandler={this.finishStatusHandler.bind(this)}
                                     unFinishStatusHandle={this.unFinishStatusHandle.bind(this)}
                                     isPickTicket={true}
                                     newHandler={() => this.props.history.push('/pickticketissuereturn')}
                                     deleteHandler={this.deleteEntity.bind(this, this.state.pickticketissuereturn.code)}
                                     toolbarProps={{ 
                                                    _toolbarType: TOOLBARS.PICKTICKETISSUERETURN, 
                                                    pickticket: this.state.pickticket,
                                                    postInit: this.postInit.bind(this),
                                                    setLayout: this.setLayout.bind(this),
                                                    newPart: this.state.layout.newEntity,
                                                    applicationData: this.props.applicationData,
                                                    screencode: this.props.userData.screens[this.props.userData.pickTicketScreen].screenCode,
                                                    handleError: this.props.handleError,
                                                    showNotification: this.props.showNotification,
                                                    showError: this.props.showError            
                                     }}
                                     width={730}
                                     entityIcon={<PartIcon style={{height: 18}}/>}
                                     toggleHiddenRegion={this.props.toggleHiddenRegion}
                                     regions={this.getRegions()}
                                     hiddenRegions={this.props.hiddenRegions}/> */}
                    <EamlightToolbarContainer isModified={layout.isModified}
                                     newEntity={layout.newEntity}
                                     entityScreen={userData.screens[userData.pickTicketScreen]}
                                     entityName={this.settings.entityDesc}
                                     entityKeyCode={this.state.pickticketissuereturn.picklistissuereturn}
                                     isPickTicket={true}
                                     saveHandler={this.saveHandler.bind(this)}
                                     newHandler={() => history.push('/pickticketissuereturn')}
                                     deleteHandler={this.deleteEntity.bind(this, this.state.pickticketissuereturn.code)}
                                     width={790}
                                     toolbarProps={{
                                        entity: this.state.pickticketissuereturn,
                                        postInit: this.postInit.bind(this),
                                        setLayout: this.setLayout.bind(this),
                                        newEntity: layout.newEntity,
                                        applicationData: applicationData,
                                        userGroup: userData.eamAccount.userGroup,
                                        screencode: userData.screens[userData.pickTicketScreen].screenCode,
                                        copyHandler: this.copyEntity.bind(this),
                                        entityDesc: this.settings.entityDesc,
                                        entityType: ENTITY_TYPE.SSPICK
                                     }}
                                     entityIcon={<PartIcon style={{height: 18}}/>}
                                     toggleHiddenRegion={toggleHiddenRegion}
                                     regions={regions}
                                     getUniqueRegionID={getUniqueRegionID}
                                     getHiddenRegionState={getHiddenRegionState}
                                     isHiddenRegion={isHiddenRegion}>
                    </EamlightToolbarContainer>
                    <EntityRegions
                        regions={regions}
                        isNewEntity={layout.newEntity}
                        getUniqueRegionID={getUniqueRegionID}
                        getHiddenRegionState={getHiddenRegionState}
                        setRegionVisibility={setRegionVisibility}
                        isHiddenRegion={this.props.isHiddenRegion} />
                    {/* <div className="entityMain">
                        <Grid container spacing={8}>
                            <Grid item  xs={12}>
                                <PickticketIssueReturnGeneral {...props}/>
                            </Grid>
                            <Grid item  xs={12}>
                            <PickTicketApprovedContainer pickticket={this.state.pickticketissuereturn}
                                                    tabLayout={this.props.pickTicketLayout.fields} store={this.state.pickticketissuereturn.store}/>
                            </Grid>
                        </Grid>
                    </div> */}
                </BlockUi>
            </div>
        );
    }
}

export default pickticketissuereturn;