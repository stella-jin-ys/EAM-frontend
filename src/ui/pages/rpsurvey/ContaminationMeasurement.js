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

class ContaminationMeasurement extends Component {

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
        let {children, workOrderLayout, workorder, updateWorkorderProperty, layout} = this.props;

        //console.log("Wo layout---", layout);
        //console.log("workOrderLayout---", workOrderLayout);

        return (
            <EISPanel heading="Contamination Measurement">
                <div style={{width: "100%", marginTop: 0}}>

                    <EAMInput
                        children={children}
                        elementInfo={workOrderLayout.fields['u2_wspf_10_typeofmeasurment']}
                        value={workorder.u2_wspf_10_typeofmeasurment}
                        updateProperty={updateWorkorderProperty}
                        valueKey="u2_wspf_10_typeofmeasurment"/>
                    
                    <EAMInput
                        children={children}
                        elementInfo={workOrderLayout.fields['u2_wspf_10_cobackground']}
                        value={workorder.u2_wspf_10_cobackground}
                        updateProperty={updateWorkorderProperty}
                        valueKey="u2_wspf_10_cobackground"/>

                    <EAMInput
                        children={children}
                        elementInfo={workOrderLayout.fields['u2_wspf_10_alphacontval']}
                        value={workorder.u2_wspf_10_alphacontval}
                        updateProperty={updateWorkorderProperty}
                        valueKey="u2_wspf_10_alphacontval"/>

                    <EAMInput
                        children={children}
                        elementInfo={workOrderLayout.fields['u2_wspf_10_drbackground']}
                        value={workorder.u2_wspf_10_drbackground}
                        updateProperty={updateWorkorderProperty}
                        valueKey="u2_wspf_10_drbackground"/>

                    <EAMInput
                        children={children}
                        elementInfo={workOrderLayout.fields['u2_wspf_10_betacontval']}
                        value={workorder.u2_wspf_10_betacontval}
                        updateProperty={updateWorkorderProperty}
                        valueKey="u2_wspf_10_betacontval"/>

                    <EAMInput
                        children={children}
                        elementInfo={workOrderLayout.fields['u2_wspf_10_betabckg']}
                        value={workorder.u2_wspf_10_betabckg}
                        updateProperty={updateWorkorderProperty}
                        valueKey="u2_wspf_10_betabckg"/>

                    <EAMInput
                        children={children}
                        elementInfo={workOrderLayout.fields['u2_wspf_10_prdunitscont']}
                        value={workorder.u2_wspf_10_prdunitscont}
                        updateProperty={updateWorkorderProperty}
                        valueKey="u2_wspf_10_prdunitscont"/>


                    <EAMInput
                        children={children}
                        elementInfo={workOrderLayout.fields['u2_wspf_10_contcomment']}
                        value={workorder.u2_wspf_10_contcomment}
                        updateProperty={updateWorkorderProperty}
                        valueKey="u2_wspf_10_contcomment"/>
                    

                        

                </div>
            </EISPanel>
        )
    }
}

export default ContaminationMeasurement