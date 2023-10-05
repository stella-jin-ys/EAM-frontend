import Checklists from 'eam-components/dist/ui/components/checklists/Checklists';
import Comments from 'eam-components/dist/ui/components/comments/Comments';
import EDMSWidget from 'eam-components/dist/ui/components/edms/EDMSWidget';
import {WorkorderIcon} from 'eam-components/dist/ui/components/icons';
import React from 'react';
import BlockUi from 'react-block-ui';
import WSEquipment from "../../../tools/WSEquipment";
import WSWorkorder from "../../../tools/WSWorkorders";
import WS from '../../../tools/WS'
import {ENTITY_TYPE} from "../../components/Toolbar";
import CustomFields from '../../components/customfields/CustomFields';
import ChesslightIframeContainer from "../../components/iframes/ChesslightIframeContainer";
import Entity from '../Entity';
import EamlightToolbarContainer from './../../components/EamlightToolbarContainer';
import Activities from '../work/activities/Activities';
import WorkorderChildren from "../work/childrenwo/WorkorderChildren";
import WorkorderDetails from '../work/WorkorderGeneral';
import WorkorderScheduling from '../work/WorkorderScheduling';
import WorkorderTools from "../work/WorkorderTools";
import EntityRegions from '../../components/entityregions/EntityRegions';
import IconButton from '@material-ui/core/IconButton';
import OpenInNewIcon from 'mdi-material-ui/OpenInNew';
import {assignValues, assignUserDefinedFields, assignCustomFieldFromCustomField, AssignmentType} from '../EntityTools';
import { isCernMode } from '../../components/CERNMode';
import { TAB_CODES } from '../../components/entityregions/TabCodeMapping';
import { getTabAvailability, getTabInitialVisibility } from '../EntityTools';
import RPSurveyDetails from './RPSurveyDetails';
import RPSurveyEquipmentDetails from './RPSurveyEquipmentDetails';
import RPSurveyInstrumentDetails from './RPSurveyInstrumentDetails';

import DoaseRateMeasurementContainer from "./measurements/DoaseRateMeasurementContainer";
import ContaminationMeasurementContainer from "./measurements/ContaminationMeasurementContainer";

const assignStandardWorkOrderValues = (workOrder, standardWorkOrder) => {
    const swoToWoMap = ([k, v]) => [k, standardWorkOrder[v]];

    workOrder = assignValues(workOrder, Object.fromEntries([
        ['classCode', 'woClassCode'],
        ['typeCode', 'workOrderTypeCode'],
        ['problemCode', 'problemCode'],
        ['priorityCode', 'priorityCode']
    ].map(swoToWoMap)), AssignmentType.SOURCE_NOT_EMPTY);

    workOrder = assignValues(workOrder, Object.fromEntries([
        ['description', 'desc'],
    ].map(swoToWoMap)), AssignmentType.DESTINATION_EMPTY);

    workOrder = assignUserDefinedFields(workOrder, standardWorkOrder.userDefinedFields, AssignmentType.DESTINATION_EMPTY);
    workOrder = assignCustomFieldFromCustomField(workOrder, standardWorkOrder.customField, AssignmentType.DESTINATION_EMPTY);

    return workOrder;
};

class RPSurvey extends Entity {

    constructor(props) {
        super(props);
        this.setProblemCodes(null, null);
        this.setFailureCodes(null, null);
        this.setActionCodes(null, null);
        this.setCauseCodes(null, null);
        this.setPriorityValues();
        this.props.setLayoutProperty('showEqpTreeButton', false);
    }

    onChangeStandardWorkOrder = standardWorkOrderCode => {
        if (!standardWorkOrderCode) {
            return;
        }

        return WSWorkorder.getStandardWorkOrder(standardWorkOrderCode).then(response => {
            const standardWorkOrder = response.body.data;

            this.setState(state => ({
                workorder: assignStandardWorkOrderValues({...state.workorder}, standardWorkOrder)
            }));
        })
    }

    onChangeEquipment = value => {
        if(!value) {
            return;
        }

        //If there is a value, fetch location, department, cost code
        //and custom fields
        return Promise.all([
            WS.autocompleteEquipmentSelected(value).then(response => {
                const data = response.body.data[0];

                if(!data) {
                    return;
                }

                //Assign values
                this.setState(prevState => ({
                    workorder: {
                        ...prevState.workorder,
                        departmentCode: data.department,
                        departmentDesc: data.departmentdisc, // 'disc' is not a typo (well, it is in Infor's response ;-) )
                        locationCode: data.parentlocation,
                        locationDesc: data.locationdesc,
                        costCode: data.equipcostcode,
                        costCodeDesc: ''
                    }
                }));
            }),
            this.setWOEquipment(value) //Set the equipment work order
        ]).catch(error => {
            //Simply don't assign values
        });
    };

    //
    // SETTINGS OBJECT USED BY ENTITY CLASS
    //
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
            children: this.children,
            setWOFieldsReadOnly: this.setWOFieldsReadOnly,
            tabLayout: this.props.workOrderLayout.tabs.PAR.fields,
            //setWOEquipment: this.setWOEquipment - vivek
        };

        return [
            {
                id: 'GENERAL',
                label: 'General',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () =>
                    <RPSurveyDetails
                        {...commonProps}
                        applicationData={applicationData}
                        userData={userData} />
                ,
                column: 0,
                order: 1,
                //ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
           
            {
                id: 'DOSERATE',
                label: 'Dose Rate Measurement',
                isVisibleWhenNewEntity: true,
                maximizable: true,
                render: () =>
                    <DoaseRateMeasurementContainer
                        {...commonProps}
                        applicationData={applicationData}
                        userData={userData} />
                ,
                column: 0,
                order: 2,
                //ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id: 'CONTAMINATION',
                label: 'Contamination Measurement',
                isVisibleWhenNewEntity: true,
                maximizable: true,
                render: () =>
                    <ContaminationMeasurementContainer
                        {...commonProps}
                        applicationData={applicationData}
                        userData={userData} />
                ,
                column: 0,
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
                        entityCode='EVNT'
                        entityKeyCode={!layout.newEntity ? workorder.number : undefined}
                        userCode={userData.eamAccount.userCode}
                        handleError={handleError}
                        allowHtml={true} />
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 1,
                order: 1,
                //ignore: !getTabAvailability(tabs, TAB_CODES.COMMENTS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.COMMENTS)
            },
            {
                id: 'EQUIPMENT',
                label: 'Equipment',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () =>
                    <RPSurveyEquipmentDetails
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
                column: 1,
                order: 3,
                //ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
           
            {
                id: 'CHESSDOCUMENTS',
                label: 'Chess Documents',
                isVisibleWhenNewEntity: false,
                //customVisibility: () => WorkorderTools.isRegionAvailable('MEC', commonProps.workOrderLayout),
                maximizable: true,
                render: () =>
                <div style={{width: "100%", marginTop: 0}}>
                <ChesslightIframeContainer
                    //objectType={this.getEDMSObjectType(equipment)}
                    //objectID={equipment.code}
                    handleError={handleError}
                    entityDetails={commonProps}
                />
                </div>
                ,
                
                column: 1,
                order: 4,
                //ignore: !getTabAvailability(tabs, TAB_CODES.EQUIPMENT_TAB_WO_SCREEN),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EQUIPMENT_TAB_WO_SCREEN)
            },
           /* 
            {this.state.workorder.classCode == "RPS" &&
            <DoaseRateMeasurementContainer workorder={this.state.workorder}
                tabLayout={this.props.workOrderLayout.tabs.PAR.fields}/>}

            {this.state.workorder.classCode == "RPS" &&                   
            <ContaminationMeasurementContainer workorder={this.state.workorder}
                tabLayout={this.props.workOrderLayout.tabs.PAR.fields}/> } */

          
           /*  {
                id: 'SCHEDULING',
                label: 'Scheduling',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                customVisibility: () => WorkorderTools.isRegionAvailable('SCHEDULING', commonProps.workOrderLayout),
                render: () =>
                    <WorkorderScheduling {...commonProps} />
                ,
                column: 1,
                order: 2,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            }, */
            /*{
                id: 'CLOSINGCODES',
                label: 'Closing Codes',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                customVisibility: () => WorkorderTools.isRegionAvailable('CLOSING_CODES', commonProps.workOrderLayout),
                render: () =>
                    <WorkorderClosingCodes {...commonProps} />
                ,
                column: 1,
                order: 3,
                ignore: !getTabAvailability(tabs, TAB_CODES.CLOSING_CODES),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.CLOSING_CODES)
            },
            {
                id: 'PARTUSAGE',
                label: 'Part Usage',
                isVisibleWhenNewEntity: false,
                maximizable: false,
                customVisibility: () => WorkorderTools.isRegionAvailable('PAR', commonProps.workOrderLayout),
                render: () =>
                    <PartUsageContainer
                        workorder={workorder}
                        tabLayout={commonProps.workOrderLayout.tabs.PAR}
                        equipmentMEC={equipmentMEC}/>
                ,
                column: 1,
                order: 4,
                ignore: !getTabAvailability(tabs, TAB_CODES.PART_USAGE),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.PART_USAGE)
            },*/
            /* {
                id: 'CHILDRENWOS',
                label: 'Child Work Orders',
                isVisibleWhenNewEntity: false,
                maximizable: false,
                customVisibility: () => WorkorderTools.isRegionAvailable('CWO', commonProps.workOrderLayout),
                render: () =>
                    <WorkorderChildren workorder={workorder.number} />
                ,
                column: 1,
                order: 4,
                ignore: !getTabAvailability(tabs, TAB_CODES.CHILD_WO),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.CHILD_WO)
            }, */
            /*{
                id: 'EDMSDOCUMENTS',
                label: 'CHESS Documents',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () =>
                    <ESSDocLinkResizableIframe
                        objectType="J"
                        objectID={workorder.number} />
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 2,
                order: 5,
                ignore: !isCernMode && !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_WORK_ORDERS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EDMS_DOCUMENTS_WORK_ORDERS)
            },
            {
                id: 'NCRS',
                label: 'NCRs',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () =>
                    <EDMSWidget
                        objectID={workorder.number}
                        objectType="J"
                        creationMode="NCR"
                        edmsDocListLink={applicationData.EL_EDMSL}
                        showError={showError}
                        showSuccess={showNotification} />
                ,
                column: 2,
                order: 6,
                ignore: !isCernMode && !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_WORK_ORDERS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EDMS_DOCUMENTS_WORK_ORDERS)
            },*/
            
            /* {
                id: 'ACTIVITIES',
                label: 'Activities and Booked Labor',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () =>
                    <Activities
                        workorder={workorder.number}
                        department={workorder.departmentCode}
                        departmentDesc={workorder.departmentDesc}
                        layout={workOrderLayout.tabs}
                        defaultEmployee={userData.eamAccount.employeeCode}
                        defaultEmployeeDesc={userData.eamAccount.employeeDesc}
                        postAddActivityHandler={this.postAddActivityHandler}
                        updateEntityProperty={this.updateEntityProperty.bind(this)}
                        updateCount={workorder.updateCount}
                        startDate={workorder.startDate}
                        />
                ,
                column: 2,
                order: 8,
                ignore: !getTabAvailability(tabs, TAB_CODES.ACTIVITIES) && !getTabAvailability(tabs, TAB_CODES.BOOK_LABOR),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.ACTIVITIES) && !tabs[TAB_CODES.BOOK_LABOR]
            }, */
            /* {
                id: 'CHECKLISTS',
                label: 'Checklists',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () =>  (
                    <Checklists
                        workorder={workorder.number}
                        printingChecklistLinkToAIS={applicationData.EL_PRTCL}
                        maxExpandedChecklistItems={Math.abs(parseInt(applicationData.EL_MCHLS)) || 50}
                        getWoLink={wo => '/workorder/' + wo}
                        ref={checklists => this.checklists = checklists}
                        showSuccess={showNotification}
                        showError={showError}
                        handleError={handleError}
                        userCode={userData.eamAccount.userCode}
                        topSlot={
                            applicationData.EL_PRTCL &&
                                <div style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                }}>
                                    <IconButton
                                        onClick={() => window.open(applicationData.EL_PRTCL + workorder.number, '_blank', 'noopener noreferrer')}
                                        style={{ color: "#00aaff" }}>
                                        <OpenInNewIcon />
                                    </IconButton>
                                </div>
                        }/>
                )
                ,
                column: 2,
                order: 9,
                ignore: !getTabAvailability(tabs, TAB_CODES.CHECKLIST),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.CHECKLIST)
            }, */
            
            /*{
                id: 'CUSTOMFIELDSEQP',
                label: 'Custom Fields Equipment',
                isVisibleWhenNewEntity: true,
                customVisibility: () => WorkorderTools.isRegionAvailable('CUSTOM_FIELDS_EQP', commonProps.workOrderLayout),
                maximizable: false,
                render: () =>
                    <CustomFields children={this.children}
                        entityCode='OBJ'
                        entityKeyCode={layout.woEquipment && layout.woEquipment.code}
                        classCode={layout.woEquipment && layout.woEquipment.classCode}
                        customFields={layout.woEquipment && layout.woEquipment.customField}
                        updateEntityProperty={this.updateEntityProperty.bind(this)}
                        readonly={true} />
                ,
                column: 2,
                order: 11,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id: 'METERREADINGS',
                label: 'Meter Readings',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () =>
                    <MeterReadingContainerWO equipment={workorder.equipmentCode}/>
                ,
                column: 2,
                order: 12,
                ignore: !getTabAvailability(tabs, TAB_CODES.METER_READINGS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.METER_READINGS)
            },
            {
                id: 'MULTIPLEEQUIPMENT',
                label: 'Equipment',
                isVisibleWhenNewEntity: false,
                customVisibility: () => WorkorderTools.isRegionAvailable('MEC', commonProps.workOrderLayout),
                maximizable: false,
                render: () =>
                    <WorkorderMultiequipment workorder={workorder.number} setEquipmentMEC={this.setEquipmentMEC.bind(this)}/>
                ,
                column: 2,
                order: 13,
                ignore: !getTabAvailability(tabs, TAB_CODES.EQUIPMENT_TAB_WO_SCREEN),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EQUIPMENT_TAB_WO_SCREEN)
            },*/
        ]


    }

    setEquipmentMEC(data) {
        this.setState({equipmentMEC: data})
    }

    //
    // CALLBACKS FOR ENTITY CLASS
    //
    postInit() {
        this.setStatuses('', '', true)
        this.setTypes('', '', true, false)
        this.enableChildren()
    }

    postCreate() {
        this.setStatuses(this.state.workorder.statusCode, this.state.workorder.typeCode, false);
        this.setTypes(this.state.workorder.statusCode, this.state.workorder.typeCode, false);
        // Comments panel might be hidden
        if (this.comments) {
            this.comments.createCommentForNewEntity();
        }
    }

    postUpdate() {
        this.props.updateMyWorkOrders(this.state.workorder)
        this.setStatuses(this.state.workorder.statusCode, this.state.workorder.typeCode, false)
        this.setTypes(this.state.workorder.statusCode, this.state.workorder.typeCode, false)
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
        this.setTypes(workorder.statusCode, workorder.typeCode, false)
        // Check if opening a terminated work order
        if (WorkorderTools.isClosedWorkOrder(workorder.statusCode)) {
            this.disableChildren()
            this.children['EAMID_WorkOrder_STATUS_STATUSCODE'].enable()
        } else {
            this.enableChildren()
        }
        //Set work order equipment
        this.setWOEquipment(workorder.equipmentCode);
    }

    postCopy = () => {
        let fields = this.props.workOrderLayout.fields;
        isCernMode && this.updateEntityProperty("statusCode", fields.workorderstatus.defaultValue ? fields.workorderstatus.defaultValue : "R")
        isCernMode && this.updateEntityProperty("typeCode", fields.workordertype.defaultValue ? fields.workordertype.defaultValue : "CD")
        isCernMode && this.updateEntityProperty("completedDate", "");
    }

    //
    // DROP DOWN VALUES
    //
    setStatuses(status, type, newwo) {
        WSWorkorder.getWorkOrderStatusValues(this.props.userData.eamAccount.userGroup, status, type, newwo)
            .then(response => {
                this.setLayout({statusValues: response.body.data})
            })
    }

    setTypes(status, type, newwo, ppmwo) {
        WSWorkorder.getWorkOrderTypeValues(this.props.userData.eamAccount.userGroup)
            .then(response => {
                this.setLayout({typeValues: response.body.data})
            })
    }

    setProblemCodes(woclass, objclass) {
        WSWorkorder.getWorkOrderProblemCodeValues(woclass, objclass)
            .then(response => {
                this.setLayout({problemCodeValues: response.body.data})
            })
    }

    setActionCodes(objclass, failurecode, problemcode, causecode) {
        WSWorkorder.getWorkOrderActionCodeValues(objclass, failurecode, problemcode, causecode)
            .then(response => {
                this.setLayout({actionCodeValues: response.body.data})
            })
    }

    setCauseCodes(objclass, failurecode, problemcode) {
        WSWorkorder.getWorkOrderCauseCodeValues(objclass, failurecode, problemcode)
            .then(response => {
                this.setLayout({causeCodeValues: response.body.data})
            })
    }

    setFailureCodes(objclass, problemcode) {
        WSWorkorder.getWorkOrderFailureCodeValues(objclass, problemcode)
            .then(response => {
                this.setLayout({failureCodeValues: response.body.data})
            })
    }

    setPriorityValues() {
        WSWorkorder.getWorkOrderPriorities()
            .then(response => {
                this.setLayout({priorityValues: response.body.data})
            });
    }

    setWOEquipment = code => {
        //Only call if the region is available
        if (!WorkorderTools.isRegionAvailable('CUSTOM_FIELDS_EQP', this.props.workOrderLayout)) {
            return;
        }

        return WSEquipment.getEquipment(code).then(response => {
            this.setLayout({woEquipment: response.body.data})
        }).catch(error => {
            this.setLayout({woEquipment: undefined})
        });
    };

    postAddActivityHandler = () => {
        //Refresh the activities in the checklist
        this.checklists && this.checklists.readActivities(this.state.workorder.number);
    };
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
                                     newHandler={() => history.push('/workorder')}
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