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
import TextField from '@material-ui/core/TextField';

class LogentriesDetails extends Component {

    onChangeEquipment = (value) => {
        const {updateWorkorderProperty, setWOEquipment} = this.props;
        //If there is a value, fetch location, department, cost code
        //and custom fields
        if (value) {
            WSWorkorders.autocompleteWorkorderEquipmentSelected(value).then(response => {
                const data = response.body.data;
                //Assign values
                updateWorkorderProperty('departmentCode', data[2]);
                updateWorkorderProperty('departmentDesc', data[3]);
                updateWorkorderProperty('locationCode', data[4]);
                updateWorkorderProperty('locationDesc', data[5]);
                updateWorkorderProperty('costCode', data[6]);
                updateWorkorderProperty('costCodeDesc', '');
                //Set the equipment work order
                setWOEquipment(value);
            }).catch(error => {
                //Simply don't assign values
            });
        }
    };

    render() {
        let {children, workOrderLayout, logentries, updateWorkorderProperty, layout} = this.props;
        console.log("logentries.description---", logentries.description);
        console.log("updateWorkorderProperty---", updateWorkorderProperty);
        console.log("workOrderLayout.fields['description']---", workOrderLayout.fields['description']);
;
        return (
            <EISPanel heading="BASE EVENT CAPTURE">
                <div style={{width: "100%", marginTop: 0}}>

<TextField
        id="standard-name"
        label="Name"
        className=""
        value={null}
        onChange=""
        margin="normal"
      />

                        <EAMBarcodeInput updateProperty={value => updateWorkorderProperty('equipmentCode', value)} right={30} top={20}>
                            <EAMAutocomplete children={children}
                                             elementInfo={workOrderLayout.fields['equipment']}
                                             value={logentries.equipmentCode}
                                             valueKey="equipmentCode"
                                             valueDesc={logentries.equipmentDesc}
                                             descKey="equipmentDesc"
                                             updateProperty={updateWorkorderProperty}
                                             autocompleteHandler={WSWorkorders.autocompleteWorkorderEquipment}
                                             onChangeValue={this.onChangeEquipment}
                                             link={() => logentries.equipmentCode ? "/equipment/" + logentries.equipmentCode : null}
                            />
                        </EAMBarcodeInput>

                    <EAMAutocomplete children={children}
                                     elementInfo={workOrderLayout.fields['location']}
                                     value={logentries.locationCode}
                                     valueKey="locationCode"
                                     valueDesc={logentries.locationDesc}
                                     descKey="locationDesc"
                                     updateProperty={updateWorkorderProperty}
                                     autocompleteHandler={WS.autocompleteLocation}/>

                    <EAMAutocomplete children={children}
                                     elementInfo={workOrderLayout.fields['department']}
                                     value={logentries.departmentCode}
                                     valueKey="departmentCode"
                                     valueDesc={logentries.departmentDesc}
                                     descKey="departmentDesc"
                                     updateProperty={updateWorkorderProperty}
                                     autocompleteHandler={WS.autocompleteDepartment}/>

                    <EAMSelect
                        children={children}
                        elementInfo={workOrderLayout.fields['workordertype']}
                        valueKey="typeCode"
                        values={layout.typeValues}
                        value={logentries.typeCode}
                        updateProperty={updateWorkorderProperty}/>

                    <EAMSelect
                        children={children}
                        elementInfo={workOrderLayout.fields['workorderstatus']}
                        valueKey="statusCode"
                        values={layout.statusValues}
                        value={logentries.statusCode}
                        updateProperty={updateWorkorderProperty}/>

                    <EAMSelect
                        children={children}
                        elementInfo={workOrderLayout.fields['priority']}
                        valueKey="priorityCode"
                        values={layout.priorityValues}
                        value={logentries.priorityCode}
                        updateProperty={updateWorkorderProperty}/>

                    <EAMAutocomplete children={children}
                                     elementInfo={workOrderLayout.fields['woclass']}
                                     value={logentries.classCode}
                                     valueKey="classCode"
                                     valueDesc={logentries.classDesc}
                                     descKey="classDesc"
                                     updateProperty={updateWorkorderProperty}
                                     autocompleteHandler={(filter, config) => WS.autocompleteClass('EVNT', filter, config)}/>

                    <EAMInput
                        elementInfo={{...workOrderLayout.fields['parentwo'], readonly: true}}
                        value={logentries.parentWO}
                        updateProperty={updateWorkorderProperty}
                        valueKey="parentWO"/>

                    <UDFChar fieldInfo={workOrderLayout.fields['udfchar01']}
                             fieldValue={logentries.userDefinedFields.udfchar01}
                             fieldValueDesc={logentries.userDefinedFields.udfchar01Desc}
                             fieldKey={`userDefinedFields.udfchar01`}
                             descKey={`userDefinedFields.udfchar01Desc`}
                             updateUDFProperty={updateWorkorderProperty}
                             children={children}
                             link={() => logentries.userDefinedFields.udfchar01 ? "https://cern.service-now.com/task.do?sysparm_query=number=" + logentries.userDefinedFields.udfchar01 : null}
                    />

                    <UDFChar fieldInfo={workOrderLayout.fields['udfchar20']}
                             fieldValue={logentries.userDefinedFields.udfchar20}
                             fieldValueDesc={logentries.userDefinedFields.udfchar20Desc}
                             fieldKey={`userDefinedFields.udfchar20`}
                             descKey={`userDefinedFields.udfchar20Desc`}
                             updateUDFProperty={updateWorkorderProperty}
                             children={children}/>

                    <UDFChar fieldInfo={workOrderLayout.fields['udfchar24']}
                             fieldValue={logentries.userDefinedFields.udfchar24}
                             fieldValueDesc={logentries.userDefinedFields.udfchar24Desc}
                             fieldKey={`userDefinedFields.udfchar24`}
                             descKey={`userDefinedFields.udfchar01Desc`}
                             updateUDFProperty={updateWorkorderProperty}
                             children={children}
                             link={() => logentries.userDefinedFields.udfchar24 ? "https://its.cern.ch/jira/browse/" + logentries.userDefinedFields.udfchar24 : null}
                    />

                    <EAMCheckbox elementInfo={workOrderLayout.fields['udfchkbox02']}
                                 value={logentries.userDefinedFields.udfchkbox02}
                                 updateProperty={updateWorkorderProperty}
                                 valueKey={`userDefinedFields.udfchkbox02`}
                                 children={children}/>

                    <EAMCheckbox elementInfo={workOrderLayout.fields['udfchkbox04']}
                                 value={logentries.userDefinedFields.udfchkbox04}
                                 updateProperty={updateWorkorderProperty}
                                 valueKey={`userDefinedFields.udfchkbox04`}
                                 children={children}/>

                </div>
            </EISPanel>
        )
    }
}

export default LogentriesDetails