import React, {Component} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMInput from 'eam-components/dist/ui/components/muiinputs/EAMInput'
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete'
import WSWorkorders from "../../../tools/WSWorkorders";
import EAMBarcodeInput from "eam-components/dist/ui/components/muiinputs/EAMBarcodeInput";

class RPSurveyInstrumentDetails extends Component {

    componentWillMount() {
        //set the value of commission date on load of the page
        this.onChangeEquipment(this.props.workorder.userDefinedFields.udfchar14);
    }
    onChangeEquipment = (value) => {
        const {updateWorkorderProperty, setWOEquipment} = this.props;
        //Set the commission date on change of Instrument
        if (value) {
            WSWorkorders.autocompleteWorkorderInstrumentSelected(value).then(response => {
                const data = response.body.data;
                //Assign values
                updateWorkorderProperty('equipmentCode', data[0]);
                updateWorkorderProperty('equipmentDesc', data[1]);
                updateWorkorderProperty('eqpCommissionDate', data[2]);
                //Set the equipment work order
                setWOEquipment(value);
            }).catch(error => {
                //Simply don't assign values
            });
        }
    };
    render() {
        let {children, workOrderLayout, workorder, updateWorkorderProperty, layout} = this.props;

        return (
            <EISPanel heading="Instrument">
                <div style={{width: "100%", marginTop: 0}}>     
                <EAMBarcodeInput updateProperty={value => updateWorkorderProperty('udfchar14', value)} right={30} top={20}>
                    <EAMAutocomplete children={children}
                                             elementInfo={workOrderLayout.fields['udfchar14']}
                                             value={workorder.userDefinedFields.udfchar14}
                                             valueKey={`userDefinedFields.udfchar14`}
                                             valueDesc={workorder.userDefinedFields.udfchar14Desc}
                                             descKey={`userDefinedFields.udfchar14Desc`}
                                             updateProperty={updateWorkorderProperty}
                                             autocompleteHandler={WSWorkorders.autocompleteWorkorderInstrument}
                                             onChangeValue={this.onChangeEquipment}
                                             link={() => workorder.equipmentCode ? "/equipment/" + workorder.equipmentCode : null}
                            />
                    </EAMBarcodeInput>
                   <EAMInput
                        children = {children}
                        elementInfo={{...workOrderLayout.fields['eqpCommissionDate'],readonly:true}}
                        value={workorder.eqpCommissionDate}
                        />

                  

                </div>
            </EISPanel>
        )
    }
}

export default RPSurveyInstrumentDetails