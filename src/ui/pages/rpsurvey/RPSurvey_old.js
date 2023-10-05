import Grid from '@material-ui/core/Grid';
import { WorkorderIcon } from 'eam-components/dist/ui/components/icons';
import Comments from 'eam-components/dist/ui/components/comments/Comments';
import React from 'react';
import BlockUi from 'react-block-ui';
import CustomFields from '../../components/customfields/CustomFields';
import WSEquipment from "../../../tools/WSEquipment";
import WSWorkorder from "../../../tools/WSWorkorders";
import WS from "../../../tools/WS"; 
import { TOOLBARS } from "../../components/AbstractToolbar";
import Entity from '../Entity';
import EamlightToolbar from '../../components/EamlightToolbar';
import RPSurveyDetails from './RPSurveyDetails';
import RPSurveyEquipmentDetails from './RPSurveyEquipmentDetails';
import RPSurveyInstrumentDetails from './RPSurveyInstrumentDetails';
import WorkorderTools from "../work/WorkorderTools";
import DoaseRateMeasurementContainer from "./measurements/DoaseRateMeasurementContainer";
import ContaminationMeasurementContainer from "./measurements/ContaminationMeasurementContainer";
import EamlightToolbarContainer from './../../components/EamlightToolbarContainer';
import {ENTITY_TYPE} from "../../components/Toolbar";
import EntityRegions from '../../components/entityregions/EntityRegions';
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from 'mdi-material-ui/OpenInNew';
import {assignValues, assignUserDefinedFields, assignCustomFieldFromCustomField, AssignmentType} from '../EntityTools';
import { isCernMode } from '../../components/CERNMode';
import { TAB_CODES } from '../../components/entityregions/TabCodeMapping';
import { getTabAvailability, getTabInitialVisibility } from '../EntityTools';

class RPSurvey extends Entity {
    
    constructor(props) {
        super(props);
        let equipmentType;
    }
    

   // }

    //
    // SETTINGS OBJECT USED BY ENTITY CLASS
    //
    // settings = {
    //     userData: this.props.userData,
    //     entity: 'workorder',
    //     entityDesc: 'RP Survey',
    //     entityURL: '/rpsurvey/',
    //     entityCodeProperty: 'number',
    //     entityScreen: this.props.userData && this.props.userData.screens[this.props.userData.workOrderScreen],
    //     renderEntity: this.renderWorkOrder.bind(this),
    //     readEntity: WSWorkorder.getWorkOrder.bind(WSWorkorder),
    //     updateEntity: WSWorkorder.updateWorkOrder.bind(WSWorkorder),
    //     createEntity: WSWorkorder.createWorkOrder.bind(WSWorkorder),
    //     deleteEntity: WSWorkorder.deleteWorkOrder.bind(WSWorkorder),
    //     initNewEntity: () => WSWorkorder.initWorkOrder("EVNT", "WSJOBS",
    //         this.props.userData && this.props.userData.screens[this.props.userData.workOrderScreen].screenCode,
    //         this.props.location.search)
    // }

    settings = {
        userData: this.props.userData,
        entity: 'workorder',
        entityDesc: 'RP Survey',
        entityURL: '/rpsurvey/',
        entityCodeProperty: 'number',
        entityScreen: this.props.userData && this.props.userData.screens[this.props.userData.workOrderScreen],
        renderEntity: this.renderWorkOrder.bind(this),
        readEntity: WSWorkorder.getWorkOrder.bind(WSWorkorder),
        updateEntity: WSWorkorder.updateWorkOrder.bind(WSWorkorder),
        createEntity: WSWorkorder.createWorkOrder.bind(WSWorkorder),
        deleteEntity: WSWorkorder.deleteWorkOrder.bind(WSWorkorder),
        initNewEntity: WSWorkorder.initWorkOrder.bind(WSWorkorder, "EVNT"),
        layout: this.props.workOrderLayout,
        layoutPropertiesMap: WorkorderTools.layoutPropertiesMap,
        handlerFunctions: {
            equipmentCode: this.onChangeEquipment,
            standardWO: this.onChangeStandardWorkOrder,
            classCode: this.onChangeClass,
        }
    }

getRegions = () => {
        const {
            applicationData,
            handleError,
            showError,
            showNotification,
            userData,
            workOrderLayout
        } = this.props;
        const { layout, workorder, equipmentMEC } = this.state;
        const {tabs} = workOrderLayout;

        const commonProps = {
            workorder,
            layout,
            workOrderLayout,
            userData,
            updateWorkorderProperty: this.updateEntityProperty.bind(this),
            children: this.children
            //setWOEquipment: this.setWOEquipment - vivek
        };

        return [
            
            {
                id: 'COMMENTS',
                label: 'Comments',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () =>
                    <Comments
                        ref={comments => this.comments = comments}
                        entityCode='EVNT'
                        entityKeyCode={!layout.newEntity ? workorder.number : undefined}
                        userCode={userData.eamAccount.userCode}
                        handleError={handleError}
                        allowHtml={true} />
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 2,
                order: 7,
                ignore: !getTabAvailability(tabs, TAB_CODES.COMMENTS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.COMMENTS)
            },
            {
                id: 'CUSTOMFIELDS',
                label: 'Custom Fields',
                isVisibleWhenNewEntity: true,
                customVisibility: () => workOrderLayout.fields.block_5.attribute !== 'H',
                maximizable: false,
                render: () =>
                    <CustomFields
                        children={this.children}
                        entityCode='EVNT'
                        entityKeyCode={workorder.number}
                        classCode={workorder.classCode}
                        customFields={workorder.customField}
                        updateEntityProperty={this.updateEntityProperty.bind(this)} />
                ,
                column: 2,
                order: 10,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
        ]


    }
    //
    // CALLBACKS FOR ENTITY CLASS
    //
    postInit() {
        //new entity
        this.setStatuses('', '', true)
        this.setTypes()
        this.setClass()
        this.enableChildren()
    }

    postCreate() {
        this.setStatuses(this.state.workorder.statusCode, this.state.workorder.typeCode, false);
        // Comments panel might be hidden
        if (this.comments) {
            this.comments.createCommentForNewEntity();
        }
    }

    postUpdate() {
        this.props.updateMyWorkOrders(this.state.workorder)
        this.setStatuses(this.state.workorder.statusCode, this.state.workorder.typeCode, false)
        
        // Check if opening a terminated work order
        if (WorkorderTools.isClosedWorkOrder(this.state.workorder.statusCode)) {
            this.disableChildren()
            this.children['EAMID_WorkOrder_STATUS_STATUSCODE'].enable()
        } else {
            this.enableChildren()
        }
        // Comments panel might be hidden
        if (this.comments) {
            this.comments.createCommentForNewEntity();
        }
    }

    postRead(workorder) {
        this.props.updateMyWorkOrders(workorder)
        this.setStatuses(workorder.statusCode, workorder.typeCode, false)
        
        // Check if opening a terminated work order
        if (WorkorderTools.isClosedWorkOrder(workorder.statusCode)) {
            this.disableChildren()
            this.children['EAMID_WorkOrder_STATUS_STATUSCODE'].enable()
        } else {
            this.enableChildren()
        }
        this.getMeasurements();
        //Set work order equipment
        this.setWOEquipment(workorder.equipmentCode);
        //set area classification
        this.setAreaClassification(workorder.equipmentCode);
        this.setParentWO(workorder.statusCode);
    }
    
    //
    // DROP DOWN VALUES
    //
    setStatuses(status, type, newwo) {
        WSWorkorder.getWorkOrderStatusValues(status, type, newwo)
            .then(response => {
                this.setLayout({statusValues: response.body.data})
            })
    }
    setTypes() {
        WSWorkorder.getWOTypeRPSurvey()
            .then(response => {
                this.setLayout({typeValues: response.body.data})
            })
    }
    setClass() {
        WSWorkorder.getWOClassRPSurvey()
            .then(response => {
                this.setLayout({woclassValues: response.body.data})
            })
    }
   
    getMeasurements() {
        WSWorkorder.getMeasurementValues(this.state.workorder.number)
            .then(response => {
                this.setLayout({measurementValues: response.body.data})
            });
    }

    setWOEquipment = (code) => {
        //Only call if the region is available
        if (WorkorderTools.isRegionAvailable('CUSTOM_FIELDS_EQP', this.props.workOrderLayout)) {
            WSEquipment.getEquipment(code).then(response => {
                this.setLayout({woEquipment: response.body.data})
            }).catch(error => {
                this.setLayout({woEquipment: undefined})
            });
        }
    }

  
    //onload of WO
    setAreaClassification = (eqpCode) => {
        this.setWOFieldsReadOnly(this.state.workorder.statusCode,this.props.workOrderLayout);
        WSWorkorder.getRPSurveyAreaClassification(eqpCode).then(response => {
        const data = response.body.data;
        this.equipmentType =data[0].code;
        }).catch(error => {
            //Simply don't assign values
            console.log("Error in reading euipment tyep:",error);
        });
    };
    setWOFieldsReadOnly(value,workOrderLayout) {
        //set equipment field
        if (value) {
            if (value =='PO' || value =='Q') {
                workOrderLayout.fields['equipment'].readonly=false;
            } else  {
                workOrderLayout.fields['equipment'].readonly=true;
            }
        }
        //set parentWO
        if (value =='PO') {
            workOrderLayout.fields['parentwo'].readonly=false;
        } else {
            workOrderLayout.fields['parentwo'].readonly=true;
        }
        //ADR Limit
        if (value =='IP') {
            workOrderLayout.fields['udfchkbox04'].readonly=false;
        } else {
            workOrderLayout.fields['udfchkbox04'].readonly=true;
        }
    }
   
    //
    //
    //
    
    renderWorkOrder() {
        const { layout, workorder } = this.state;
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
        console.log("getHiddenRegionState:",getHiddenRegionState);
        console.log("getUniqueRegionID:",getUniqueRegionID);
        console.log("workorder1234:",workorder);
        return (
            <div className="entityContainer">
                <BlockUi tag="div" blocking={layout.blocking} style={{height: "100%", width: "100%"}}>

                    <EamlightToolbarContainer isModified={layout.isModified}
                                     newEntity={layout.newEntity}
                                     entityScreen={userData.screens[userData.workOrderScreen]}
                                     entityName="Work Order"
                                     entityKeyCode={workorder.number}
                                     saveHandler={this.saveHandler.bind(this)}
                                     newHandler={() => history.push('/rpsurvey')}
                                     deleteHandler={this.deleteEntity.bind(this, workorder.number)}
                                     width={790}
                                     toolbarProps={{
                                        entity: workorder,
                                        postInit: this.postInit.bind(this),
                                        setLayout: this.setLayout.bind(this),
                                        newEntity: layout.newEntity,
                                        applicationData: applicationData,
                                        userGroup: userData.eamAccount.userGroup,
                                        screencode: userData.screens[userData.workOrderScreen].screenCode,
                                        copyHandler: this.copyEntity.bind(this),
                                        entityDesc: this.settings.entityDesc,
                                        entityType: ENTITY_TYPE.WORKORDER
                                     }}
                                     entityIcon={<WorkorderIcon style={{height: 18}}/>}
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
        )
    }
}

export default RPSurvey;