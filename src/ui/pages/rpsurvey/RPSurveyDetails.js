import React, {Component} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMSelect from 'eam-components/dist/ui/components/muiinputs/EAMSelect'
import EAMInput from 'eam-components/dist/ui/components/muiinputs/EAMInput'
import EAMCheckbox from 'eam-components/dist/ui/components/muiinputs/EAMCheckbox'
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete'
import WS from "../../../tools/WS";
import WSWorkorders from "../../../tools/WSWorkorders";
import UDFChar from "../../components/userdefinedfields/UDFChar";
import EAMBarcodeInput from "eam-components/dist/ui/components/muiinputs/EAMBarcodeInput";
import WSEquipment from "../../../tools/WSEquipment";

class RPSurveyDetails extends Component {
    state = {
        equipmentType:""
    };
    onChangeEquipment = (value) => {
        const {updateWorkorderProperty, setWOEquipment} = this.props;
        //If there is a value, fetch location, department, cost code
        //and custom fields
        if (value) {
            WSEquipment.getEquipment(value).then(response => {
                const data = response.body.data;
                console.log("Data equipment",data);
               //Assign values
               updateWorkorderProperty('departmentCode', response.body.data.departmentCode);
               updateWorkorderProperty('departmentDesc', response.body.data.departmentDesc);
               updateWorkorderProperty('locationCode', response.body.data.hierarchyLocationCode);
               updateWorkorderProperty('locationDesc', response.body.data.hierarchyLocationDesc);
               updateWorkorderProperty('costCode', response.body.data.costCode);
               updateWorkorderProperty('costCodeDesc', '');
               //Set the equipment work order
               setWOEquipment(value); 
            }).catch(error => {
                console.log("Error:",error);
            });
        }
           
        if (value) {
            WSWorkorders.getRPSurveyAreaClassification(value).then(response => {
                const data = response.body.data;
                //Assign values
                updateWorkorderProperty('userDefinedFields.udfchar15', data[0].desc);
                //this is needed for onchange of equipment
                this.setState(() => ({equipmentType: data[0].code}));
            }).catch(error => {
                //Simply don't assign values
                console.log("error:",error);
            });
        }
    };
    onChangeStatus (value) {
        const {setWOFieldsReadOnly} = this.props;
        setWOFieldsReadOnly(value,this.props.workOrderLayout);
    }

    render() {
        
        let {children, workOrderLayout, workorder, updateWorkorderProperty,layout, equipmentType} = this.props;
        //for new entity - create page of RP Survey
        if (workorder.number === null) {
            workorder.typeCode='RPS';
            workorder.classCode='RPS';
        }
        
        //console.log("layout.measurementValues-",layout.measurementValues);
        //console.log("layout.contaminationValues-",layout);
        //console.log("RP - RP Survey layout---", layout);
        //console.log("workOrderLayout", workOrderLayout);
        //console.log("workorder+++++++++++", workorder);
        
        //check if euipmentype field value is set, read the value from previous component, we store in state for new entity
        // and read it from previous component while we read existing WO
        if (this.state.equipmentType != "" && this.state.equipmentType != "undefined") {
            equipmentType = this.state.equipmentType;
        }

        let editAreaClassification =false;
        let editOthers =false;
        if (workorder.statusCode =='IP') { //ongoing
            if (equipmentType =='L') {
                editAreaClassification=true;
            } else {
                editOthers =true;
            }
        }

        return (
            
                <div style={{width: "100%", marginTop: 0}}>

                    <EAMInput
                        children={children}
                        elementInfo={{...workOrderLayout.fields['description'], readonly:false}}
                        value={workorder.description}
                        updateProperty={updateWorkorderProperty}
                        valueKey="description"/>

                    
                    <EAMInput
                        children={children}
                        elementInfo={{...workOrderLayout.fields['createdby'], readonly:true}}
                        value={workorder.createdBy}
                        updateProperty={updateWorkorderProperty}
                        valueKey="createdBy"/>
                    <EAMInput
                        children={children}
                        elementInfo={{...workOrderLayout.fields['datecreated'], readonly:true}}
                        value={workorder.createdDate}
                        updateProperty={updateWorkorderProperty}
                        valueKey="createdDate"/>                       

                    <EAMBarcodeInput updateProperty={value => updateWorkorderProperty('equipmentCode', value)} right={30} top={20}>
                            <EAMAutocomplete children={children}
                                             elementInfo={workOrderLayout.fields['equipment']}
                                             value={workorder.equipmentCode}
                                             valueKey="equipmentCode"
                                             valueDesc={workorder.equipmentDesc}
                                             descKey="equipmentDesc"
                                             updateProperty={updateWorkorderProperty}
                                             autocompleteHandler={WSWorkorders.autocompleteWorkorderEquipment}
                                             onChangeValue={this.onChangeEquipment}
                                             link={() => workorder.equipmentCode ? "/equipment/" + workorder.equipmentCode : null}
                            />
                    </EAMBarcodeInput>

                    <EAMAutocomplete children={children}
                                     elementInfo={{...workOrderLayout.fields['location'],readonly:true}}
                                     value={workorder.locationCode}
                                     valueKey="locationCode"
                                     valueDesc={workorder.locationDesc}
                                     descKey="locationDesc"
                                     updateProperty={updateWorkorderProperty}
                                     autocompleteHandler={WS.autocompleteLocation}/>

                    <EAMAutocomplete children={children}
                                     elementInfo={{...workOrderLayout.fields['department'],readonly:true}}
                                     value={workorder.departmentCode}
                                     valueKey="departmentCode"
                                     valueDesc={workorder.departmentDesc}
                                     descKey="departmentDesc"
                                     updateProperty={updateWorkorderProperty}
                                     autocompleteHandler={WS.autocompleteDepartment}/>
                                     
                   	{/* We have two fields one for readonly and one for edit, since CERN framework doesn't support 
                    UDF readonly field dynamically
                    */}   
                    {!workOrderLayout.newEntity && editAreaClassification &&    
                    <UDFChar fieldInfo={workOrderLayout.fields['udfchar15']}
                             fieldValue={workorder.userDefinedFields.udfchar15}
                             fieldValueDesc={workorder.userDefinedFields.udfchar15Desc}
                             fieldKey={`userDefinedFields.udfchar15`}
                             descKey={`userDefinedFields.udfchar15Desc`}
                             updateUDFProperty={updateWorkorderProperty}
                             children={children}/>} 

                    {(workOrderLayout.newEntity || (workorder.statusCode !='IP') || (!editAreaClassification)) &&  
                    <UDFChar fieldInfo={{...workOrderLayout.fields['udfchar15'],readonly:true}}
                             fieldValue={workorder.userDefinedFields.udfchar15}
                             fieldValueDesc={workorder.userDefinedFields.udfchar15Desc}
                             fieldKey={`userDefinedFields.udfchar15`}
                             descKey={`userDefinedFields.udfchar15Desc`}
                             updateUDFProperty={updateWorkorderProperty}
                             children={children}/>}

                    

                    
                    {!workOrderLayout.newEntity && editOthers &&   
                     <UDFChar fieldInfo={workOrderLayout.fields['udfchar16']}
                             fieldValue={workorder.userDefinedFields.udfchar16}
                             fieldValueDesc={workorder.userDefinedFields.udfchar16Desc}
                             fieldKey={`userDefinedFields.udfchar16`}
                             descKey={`userDefinedFields.udfchar16Desc`}
                             updateUDFProperty={updateWorkorderProperty}
                             children={children}/>}
                    {(workOrderLayout.newEntity || (workorder.statusCode !='IP') || (!editOthers)) &&   
                     <UDFChar fieldInfo={{...workOrderLayout.fields['udfchar16'],readonly:true}}
                             fieldValue={workorder.userDefinedFields.udfchar16}
                             fieldValueDesc={workorder.userDefinedFields.udfchar16Desc}
                             fieldKey={`userDefinedFields.udfchar16`}
                             descKey={`userDefinedFields.udfchar16Desc`}
                             updateUDFProperty={updateWorkorderProperty}
                             children={children}/>}

                   {!workOrderLayout.newEntity && editOthers &&   
                     <UDFChar fieldInfo={workOrderLayout.fields['udfchar17']}
                             fieldValue={workorder.userDefinedFields.udfchar17}
                             fieldValueDesc={workorder.userDefinedFields.udfchar17Desc}
                             fieldKey={`userDefinedFields.udfchar17`}
                             descKey={`userDefinedFields.udfchar17Desc`}
                             updateUDFProperty={updateWorkorderProperty}
                            children={children}/> }	
                
                    {(workOrderLayout.newEntity || (workorder.statusCode !='IP') || (!editOthers)) &&   
                     <UDFChar fieldInfo={{...workOrderLayout.fields['udfchar17'],readonly:true}}
                             fieldValue={workorder.userDefinedFields.udfchar17}
                             fieldValueDesc={workorder.userDefinedFields.udfchar17Desc}
                             fieldKey={`userDefinedFields.udfchar17`}
                             descKey={`userDefinedFields.udfchar17Desc`}
                             updateUDFProperty={updateWorkorderProperty}
                            children={children}/> }

                    {!workOrderLayout.newEntity && editOthers &&   
                     <EAMInput
                        children={children}
                        elementInfo={workOrderLayout.fields['udfchar18']}
                        value={workorder.userDefinedFields.udfchar18}
                        updateProperty={updateWorkorderProperty}
                        valueKey="userDefinedFields.udfchar18"/>}

                    {(workOrderLayout.newEntity || (workorder.statusCode !='IP') || (!editOthers)) &&   
                    <EAMInput
                        children={children}
                        elementInfo={{...workOrderLayout.fields['udfchar18'],readonly:true}}
                        value={workorder.userDefinedFields.udfchar18}
                        updateProperty={updateWorkorderProperty}
                        valueKey="userDefinedFields.udfchar18"/>}
                    {/*---end---*/ }
                    
                    <EAMSelect
                        children={children}
                        elementInfo={workOrderLayout.fields['workorderstatus']}
                        valueKey="statusCode"
                        values={layout.statusValues}
                        value={workorder.statusCode}
                        onChangeValue={this.onChangeStatus(workorder.statusCode)}
                        updateProperty={updateWorkorderProperty}/>
                    <EAMAutocomplete children={children}
                                        elementInfo={workOrderLayout.fields['parentwo']}
                                        value={workorder.parentWO}
                                        valueDesc={workorder.parentWODesc}
                                        updateProperty={updateWorkorderProperty}
                                        valueKey="parentWO"
                                        descKey="parentWODesc"
                                        autocompleteHandler={WSWorkorders.autoCompleteParentWorkOrders}
                                        
                                /> 
                   
                                              
                    <EAMSelect
                        children={children}
                        elementInfo={{...workOrderLayout.fields['workordertype'], readonly:true}}
                        valueKey="typeCode"
                        values={layout.typeValues}
                        value={workorder.typeCode}
                        updateProperty={updateWorkorderProperty}/>
                    

                    <EAMSelect
                        children={children}
                        elementInfo={{...workOrderLayout.fields['woclass'],readonly:true}}
                        valueKey="classCode"
                        values={layout.woclassValues}
                        value={workorder.classCode}
                    updateProperty={updateWorkorderProperty}/>
                    
                    <EAMCheckbox elementInfo={workOrderLayout.fields['udfchkbox04']}
                                 value={workorder.userDefinedFields.udfchkbox04}
                                 updateProperty={updateWorkorderProperty}
                                 valueKey={`userDefinedFields.udfchkbox04`}
                                 children={children}/> 


                </div>
          
        )
    }
}

export default RPSurveyDetails