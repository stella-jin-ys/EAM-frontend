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

class RPSurveyEquipmentDetails extends Component {

    onChangeEquipment = (value) => {
        const {updateWorkorderProperty, setWOEquipment} = this.props;
        //If there is a value, fetch location, department, cost code
        //and custom fields
        if (value) {
            WSWorkorders.autocompleteWorkorderEquipmentSelected(value).then(response => {
                const data = response.body.data;
                //console.log("Equipmemnt Code----",value);
                //console.log("Equipmemnt data----",data);
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
        let {children, workOrderLayout, workorder, updateWorkorderProperty, layout} = this.props;
        /*console.log("layout.measurementValues-",layout.measurementValues);
        console.log("Wo layout---", layout);

        console.log("RP Survey layout---", layout);
        console.log("workOrderLayout", workOrderLayout);
        console.log("workorder+++++++++++", workorder);*/

        return (
           
                <div style={{width: "100%", marginTop: 0}}>                      
                    <EAMBarcodeInput updateProperty={value => updateWorkorderProperty('equipmentCode', value)} right={30} top={20}>
                            <EAMAutocomplete children={children}
                                             elementInfo={{...workOrderLayout.fields['equipment'], readonly:true}}
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

                    {/*<EAMAutocomplete children={children}
                                     elementInfo={{...workOrderLayout.fields['location'], readonly:true}}
                                     value={workorder.locationCode}
                                     valueKey="locationCode"
                                     valueDesc={workorder.locationDesc}
                                     descKey="locationDesc"
                                     updateProperty={updateWorkorderProperty}
                                     autocompleteHandler={WS.autocompleteLocation}/>

                    <EAMAutocomplete children={children}
                                     elementInfo={{...workOrderLayout.fields['department'], readonly:true}}
                                     value={workorder.departmentCode}
                                     valueKey="departmentCode"
                                     valueDesc={workorder.departmentDesc}
                                     descKey="departmentDesc"
                                     updateProperty={updateWorkorderProperty}
                                     autocompleteHandler={WS.autocompleteDepartment}/>

                    <EAMSelect
                        children={children}
                        elementInfo={{...workOrderLayout.fields['workordertype'], readonly:true}}
                        valueKey="typeCode"
                        values={layout.typeValues}
                        value={workorder.typeCode}
                        updateProperty={updateWorkorderProperty}/>

                    <EAMSelect
                        children={children}
                        elementInfo={{...workOrderLayout.fields['workorderstatus'], readonly:true}}
                        valueKey="statusCode"
                        values={layout.statusValues}
                        value={workorder.statusCode}
        updateProperty={updateWorkorderProperty}/>*/}

                </div>
           
        )
    }
}

export default RPSurveyEquipmentDetails