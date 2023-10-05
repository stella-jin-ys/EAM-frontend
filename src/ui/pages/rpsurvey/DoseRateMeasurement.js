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

class DoseRateMeasurement extends Component {

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
            <EISPanel heading="Dose Rate Measurement">
                <div style={{width: "100%", marginTop: 0}}>

                    <EAMInput
                        children={children}
                        elementInfo={workOrderLayout.fields['u2_wspf_10_drdistance']}
                        value={workorder.u2_wspf_10_drdistance}
                        updateProperty={updateWorkorderProperty}
                        valueKey="u2_wspf_10_drdistance"/>

                    <EAMInput
                        children={children}
                        elementInfo={workOrderLayout.fields['u2_wspf_10_drdistance40']}
                        value={workorder.u2_wspf_10_drdistance40}
                        updateProperty={updateWorkorderProperty}
                        valueKey="u2_wspf_10_drdistance40"/>

                    <EAMInput
                        children={children}
                        elementInfo={workOrderLayout.fields['u2_wspf_10_drdistance100']}
                        value={workorder.u2_wspf_10_drdistance100}
                        updateProperty={updateWorkorderProperty}
                        valueKey="u2_wspf_10_drdistance100"/>

                    <EAMInput
                        children={children}
                        elementInfo={workOrderLayout.fields['u2_wspf_10_drbackground']}
                        value={workorder.u2_wspf_10_drbackground}
                        updateProperty={updateWorkorderProperty}
                        valueKey="u2_wspf_10_drbackground"/>

                    <EAMInput
                        children={children}
                        elementInfo={workOrderLayout.fields['u2_wspf_10_drvalue']}
                        value={workorder.u2_wspf_10_drvalue}
                        updateProperty={updateWorkorderProperty}
                        valueKey="u2_wspf_10_drvalue"/>
                        
                    <EAMInput
                        children={children}
                        elementInfo={workOrderLayout.fields['u2_wspf_10_drsigns']}
                        value={workorder.u2_wspf_10_drsigns}
                        updateProperty={updateWorkorderProperty}
                        valueKey="u2_wspf_10_drsigns"/>

                    <EAMInput
                        children={children}
                        elementInfo={workOrderLayout.fields['u2_wspf_10_prdunits']}
                        value={workorder.u2_wspf_10_prdunits}
                        updateProperty={updateWorkorderProperty}
                        valueKey="u2_wspf_10_prdunits"/>

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

export default DoseRateMeasurement