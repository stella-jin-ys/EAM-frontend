import React from 'react';
import EamlightToolbar from '../../components/EamlightToolbar';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import Grid from '@material-ui/core/Grid';
import WSPicktickets from '../../../tools/WSPicktickets';
import PickticketGeneral from "./PickticketGeneral";
import UserDefinedFields from "../../components/userdefinedfields/UserDefinedFields";
import PickticketStock from "./PickticketStock";
import PickticketExtendedView from "./PickticketExtendedView";
import Comments from 'eam-components/dist/ui/components/comments/Comments';
import CustomFields from '../../components/customfields/CustomFields';
import PickticketWhereUsed from "./PickticketWhereUsed";
import Entity from '../Entity';
import {PartIcon} from 'eam-components/dist/ui/components/icons'
import PartToolbar from "./PartToolbar";
import EDMSDoclightIframeContainer from "../../components/iframes/EDMSDoclightIframeContainer";
import { TOOLBARS } from '../../components/AbstractToolbar';
import PartUsagePickTicketContainer from "./partusage/PartUsagePickTicketContainer";
import PickTicketTools from "./PickticketTools";
import { TAB_CODES } from '../../components/entityregions/TabCodeMapping';
import { getTabAvailability, getTabInitialVisibility } from '../EntityTools';
import EamlightToolbarContainer from './../../components/EamlightToolbarContainer';
import {ENTITY_TYPE} from "../../components/Toolbar";
import EntityRegions from '../../components/entityregions/EntityRegions';


const PICKTICKET = 'PICKTICKET';
const SSPICK = 'SSPICK';
const PICK ='PICK';

class pickticket extends Entity {
    constructor(props) {
        super(props)
        this.props.setLayoutProperty('showEqpTreeButton', false)
    }

    state = {
        isRequired: false,
        storeList: [],
        activityList: []
    };

    //
    // SETTINGS OBJECT USED BY ENTITY CLASS
    //
    settings = {
        entity: 'pickticket',
        entityDesc: 'Pick Ticket',
        entityURL: '/pickticket/',
        entityCodeProperty: 'picklist',
        entityScreen: this.props.userData.screens[this.props.userData.pickTicketScreen],
        renderEntity: this.renderPickticket.bind(this),
        readEntity: WSPicktickets.getPart.bind(WSPicktickets),
        updateEntity: WSPicktickets.updatePart.bind(WSPicktickets),
        createEntity: WSPicktickets.createPickTicket.bind(WSPicktickets),
        deleteEntity: WSPicktickets.deletePickTicket.bind(WSPicktickets),
        initNewEntity: () => WSPicktickets.initPickticket(PICKTICKET, SSPICK, this.props.userData.screens[this.props.userData.pickTicketScreen].screenCode, this.props.location.search)
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
        //const {tabLayout} ={pickTicketLayout.tabs.PAR.fields};
        //console.log("pickTicketLayout in pickticket:",pickTicketLayout);
        const commonProps = {
            pickticket,
            layout,
            pickTicketLayout,
            userData,
            updatepickticketProperty: this.updateEntityProperty.bind(this),
            children: this.children,
            //setWOEquipment: this.setWOEquipment - vivek
        };
        return [
            {
                id: 'GENERAL',
                label: 'General',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () =>
                    <PickticketGeneral
                        {...commonProps}
                        applicationData={applicationData}
                        userData={userData} />
                ,
                column: 1,
                order: 1,
                //ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id: 'EXTENDED VIEW',
                label: 'Extended View',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () =>
                    <PickticketExtendedView
                        {...commonProps}
                        applicationData={applicationData}
                        userData={userData} />
                ,
                column: 1,
                order: 2,
                //ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id: 'PART USUAGE',
                label: 'Part Usage',
                isVisibleWhenNewEntity: true,
                maximizable: true,
                render: () =>
                    <PartUsagePickTicketContainer
                        {...commonProps}
                        applicationData={applicationData}
                        userData={userData} 
                        tabLayout={this.props.pickTicketLayout.tabs.PAR.fields}
                        />
                ,
                column: 1,
                order: 3,
                //ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id: 'COMMENTS',
                label: 'Comments',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () =>
                    <Comments
                        ref={comments => this.comments = comments}
                        entityCode='PICK'
                        entityKeyCode={!layout.newEntity ? pickticket.picklist : undefined}
                        userCode={userData.eamAccount.userCode}
                        handleError={handleError}
                        allowHtml={true} />
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 2,
                order: 1,
                //ignore: !getTabAvailability(tabs, TAB_CODES.COMMENTS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.COMMENTS)
            },
            
        ]

       
    }
     //{!this.props.hiddenRegions[this.getRegions().PARTUSAGE.code] &&
            //                     PickTicketTools.isRegionAvailable('PAR', props.pickTicketLayout) &&
            //                     !this.state.layout.newEntity && (this.state.pickticket.pickticketstatus =='A' || this.state.pickticket.pickticketstatus == 'R' || this.state.pickticket.pickticketstatus == 'RP') &&
            //                     <PartUsagePickTicketContainer pickticket={this.state.pickticket}
            //                                         tabLayout={this.props.pickTicketLayout.tabs.PAR.fields}/>}
    //
    // CALLBACKS FOR ENTITY CLASS
    //
    postInit() {
        this.setStore();
        this.setAddress();
        this.setStatus();
    }

    postCreate() {
        this.comments.wrappedInstance.createCommentForNewEntity();
    }

    postUpdate() {
        this.comments.wrappedInstance.createCommentForNewEntity();
    }

    postRead(pickticket) {
        //this.setStore();
        //this.setAddress();
        //this.setStatus();
    }

    
    //
    // DROP DOWN VALUES FOR STORES
    //
    setStore = () => {
        WSPicktickets.getStores().then(response => {
            this.setLayout({getStores: response.body.data});
        }).catch(error => {
            this.props.handleError(error);
            this.setLayout({blocking: false});
        });
    };

    setAddress = () => {
        WSPicktickets.getAddress().then(response => {
            this.setLayout({getAddress: response.body.data});
        }).catch(error => {
            this.props.handleError(error);
            this.setLayout({blocking: false});
        });
    };

    setStatus = () => {
        WSPicktickets.getStatus().then(response => {
            this.setLayout({getStatus: response.body.data});
        }).catch(error => {
            this.props.handleError(error);
            this.setLayout({blocking: false});
        });
    };
    transformActivities = (activities) => {
        return activities.map(activity => ({code: activity.code,
                                            desc: `${activity.code} - ${activity.desc}`}));
    }

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
    //
    //
    //
    // getRegions = () => {
    //     let user = this.props.userData.eamAccount.userCode
    //     let screen = this.props.userData.screens[this.props.userData.pickTicketScreen].screenCode
        
    //     return {
    //         //PARTSTOCK: {label: "Part Stock", code: user + "_" + screen+ "_PARTSTOCK"},
    //         PARTUSAGE: {label: "Part Usage", code: user + "_" + screen+ "_PARTUSAGE"},
    //         //WHEREUSED: {label: "Where Used", code: user + "_" + screen+ "_WHEREUSED"},
    //         //USERDEFFIELDS: {label: "User Defined Fields", code: user + "_" + screen+ "_USERDEFFIELDS"},
    //         COMMENTS: {label: "Comments", code: user + "_" + screen+ "_COMMENTS"},
    //         //CUSTOMFIELDS: {label: "Custom Fields", code: user + "_" + screen+ "_CUSTOMFIELDS"}
    //     }
    // }

    finishStatusHandler() {
        this.state.pickticket.pickticketstatus="F";
        this.updateEntityProperty("pickticketstatus", "F");
    }
    unFinishStatusHandle() {
        this.state.pickticket.pickticketstatus="U";
        this.updateEntityProperty("pickticketstatus", "U");
    }

    validateFields(children) {
        let validationPassed = true;
        Object.keys(children).forEach(key => {
            if (children[key] && children[key].validate && !children[key].validate()) {
                validationPassed = false
            }
        });
        return validationPassed
    }

    /**
     *
     */
    saveHandler() {
        // Validate all children and continue when all have passed
        if (!this.validateFields(this.children) && !this.state.isRequired) {
            return this.props.showError('Several errors have occurred')
        } else if(this.state.isRequired) {
            return this.props.showError('You must have at least a work order and activity or an equipment alone to create a pick ticket')
        }
        // Create new or update existing entity
        if (this.state.layout.newEntity) {
            this.createEntity(this.state[this.settings.entity])
        } else {
            this.updateEntity(this.state[this.settings.entity])
        }
    }

    onChangeHandler() {
            //Set loading
            if(this.state.pickticket.workorder != null && this.state.pickticket.workorder != "") {
                WSPicktickets.getWorkOrderPickTicketActivities(this.state.pickticket.workorder).then(responses => {
                    this.setState(() => ({activityList: this.transformActivities(responses.body.data)}));
                }).catch(error => {
                    this.props.handleError(error);
                });
            }
    }
    
    validateFields(children) {
        /*console.log("children.EAMID_WorkOrderPart_WORKORDERPARTID_ACTIVITYID_ACTIVITYCODE_Content---",children.EAMID_WorkOrderPart_WORKORDERPARTID_ACTIVITYID_ACTIVITYCODE_Content.props.value);
        console.log("EAMID_PickList_WORKORDERACTIVITY_ACTIVITYID_WORKORDERID_JOBNUM---",children.EAMID_PickList_WORKORDERACTIVITY_ACTIVITYID_WORKORDERID_JOBNUM.props.value);
        console.log("children---",children);
        console.log("children---",children);*/
        let validationPassed = true;
        Object.keys(children).forEach(key => {
            if (children[key] && children[key].validate && !children[key].validate()) {
                //console.log("key---------",key);
                validationPassed = false
            }
        });
        if(validationPassed) {
            if(!children.EAMID_WorkOrderPart_WORKORDERPARTID_ACTIVITYID_ACTIVITYCODE_Content.props.value && !children.EAMID_PickList_WORKORDERACTIVITY_ACTIVITYID_WORKORDERID_JOBNUM.props.value && !children.EAMID_PickList_ASSETID_EQUIPMENTCODE.props.value) {
                validationPassed = false
                this.setState({isRequired: true});
                this.state.isRequired = true;
                /*console.log("validationPassed---11------",validationPassed);
                console.log("validationPassed---11------",this.state.isRequired);*/
                return validationPassed;
            } else if((children.EAMID_WorkOrderPart_WORKORDERPARTID_ACTIVITYID_ACTIVITYCODE_Content.props.value && children.EAMID_PickList_WORKORDERACTIVITY_ACTIVITYID_WORKORDERID_JOBNUM.props.value) || children.EAMID_PickList_ASSETID_EQUIPMENTCODE.props.value) {
                validationPassed = true
                this.setState({isRequired: false});
                this.state.isRequired = false;
            }
        }
        this.state.isRequired = false;
        //console.log("validationPassed-----22----",validationPassed);
        return validationPassed
    }
    renderPickticket() {
        // let props = {
        //     pickticket: this.state.pickticket,
        //     userData: this.props.userData,
        //     updatepickticketProperty: this.updateEntityProperty.bind(this),
        //     layout: this.state.layout,
        //     pickTicketLayout: this.props.pickTicketLayout,
        //     children: this.children,
        //     onChangeHandler : this.onChangeHandler.bind(this),
        //     activityList : this.state.activityList
        // };
        const { layout, pickticket } = this.state;
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
        //console.log("11",this.state.pickticket);
        /*console.log("this.state.pickticket-", this.state.pickticket);
        console.log("this.state.layout-", this.state.layout);
        console.log("this.props.pickTicketLayout.tabs.PAR.fields-", this.props.pickTicketLayout.tabs.PAR.fields);*/
        
        //Normal pickticket screen
        return (
            // <div className="entityContainer">
            //     <BlockUi tag="div" blocking={this.state.layout.blocking} style={{height: "100%", width: '100%'}}>

            //         <EamlightToolbar isModified={this.state.layout.isModified}
            //                          newEntity={this.state.layout.newEntity}
            //                          entityScreen={this.props.userData.screens[this.props.userData.pickTicketScreen]}
            //                          entityName={this.settings.entityDesc}
            //                          entityKeyCode={this.state.pickticket.picklist}
            //                          saveHandler={this.saveHandler.bind(this)}
            //                          finishStatusHandler={this.finishStatusHandler.bind(this)}
            //                          unFinishStatusHandle={this.unFinishStatusHandle.bind(this)}
            //                          isPickTicket={true}
            //                          newHandler={() => this.props.history.push('/pickticket')}
            //                          deleteHandler={this.deleteEntity.bind(this, this.state.pickticket.code)}
            //                          toolbarProps={{ 
            //                                         _toolbarType: TOOLBARS.PICKTICKET, 
            //                                         pickticket: this.state.pickticket,
            //                                         postInit: this.postInit.bind(this),
            //                                         setLayout: this.setLayout.bind(this),
            //                                         newPart: this.state.layout.newEntity,
            //                                         applicationData: this.props.applicationData,
            //                                         screencode: this.props.userData.screens[this.props.userData.pickTicketScreen].screenCode,
            //                                         handleError: this.props.handleError,
            //                                         showNotification: this.props.showNotification,
            //                                         showError: this.props.showError            
            //                          }}
            //                          width={730}
            //                          entityIcon={<PartIcon style={{height: 18}}/>}
            //                          toggleHiddenRegion={this.props.toggleHiddenRegion}
            //                          regions={this.getRegions()}
            //                          hiddenRegions={this.props.hiddenRegions}/>


            //          <div className="entityMain">
            //             <Grid container spacing={8}>
            //                 <Grid item sm={6} xs={12}>
            //                     <PickticketGeneral {...props}/>
            //                     <PickticketExtendedView {...props}/>
                               
            //                 </Grid>
            //                 <Grid item sm={6} xs={12}>

                               
            //                 </Grid>
            //                 <Grid item sm={12} xs={12} lg={12}>
            //                     {!this.props.hiddenRegions[this.getRegions().PARTUSAGE.code] &&
            //                     PickTicketTools.isRegionAvailable('PAR', props.pickTicketLayout) &&
            //                     !this.state.layout.newEntity && (this.state.pickticket.pickticketstatus =='A' || this.state.pickticket.pickticketstatus == 'R' || this.state.pickticket.pickticketstatus == 'RP') &&
            //                     <PartUsagePickTicketContainer pickticket={this.state.pickticket}
            //                                         tabLayout={this.props.pickTicketLayout.tabs.PAR.fields}/>}
               
            //                 </Grid>

                             

                           
            //             </Grid>
            //         </div> 
            //     </BlockUi>
            // </div>
            <div className="entityContainer">
                <BlockUi tag="div" blocking={layout.blocking} style={{height: "100%", width: "100%"}}>

                    <EamlightToolbarContainer isModified={layout.isModified}
                                     newEntity={layout.newEntity}
                                     entityScreen={userData.screens[userData.pickTicketScreen]}
                                     entityName="Pick Ticket"
                                     entityKeyCode={pickticket.picklist}
                                     saveHandler={this.saveHandler.bind(this)}
                                     newHandler={() => history.push('/pickticket')}
                                     deleteHandler={this.deleteEntity.bind(this, pickticket.picklist)}
                                     width={790}
                                     toolbarProps={{
                                        entity: pickticket,
                                        postInit: this.postInit.bind(this),
                                        setLayout: this.setLayout.bind(this),
                                        newEntity: layout.newEntity,
                                        applicationData: applicationData,
                                        userGroup: userData.eamAccount.userGroup,
                                        screencode: userData.screens[userData.pickTicketScreen].screenCode,
                                        copyHandler: this.copyEntity.bind(this),
                                        entityDesc: this.settings.entityDesc,
                                        entityType: ENTITY_TYPE.PICKTICKET
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
                </BlockUi>
            </div>

            
        );
    }
}

export default pickticket;