import React, {Component} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMSelect from 'eam-components/dist/ui/components/muiinputs/EAMSelect';
import EAMInput from 'eam-components/dist/ui/components/muiinputs/EAMInput'
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete';
import WSPicktickets from "../../../tools/WSPicktickets";
import EAMCheckbox from "eam-components/dist/ui/components/muiinputs/EAMCheckbox";
import EAMDatePicker from 'eam-components/dist/ui/components/muiinputs/EAMDatePicker'
import EAMDateTimePicker from 'eam-components/dist/ui/components/muiinputs/EAMDateTimePicker'

class PickticketIssueReturnGeneral extends Component {

    render() {
        let {children, pickTicketLayout, pickticketissuereturn, updatepickticketProperty, layout, onChangeHandler} = this.props;
        return (
            
                <div style={{width: "100%", marginTop: 0}}>
                   <EAMSelect
                        elementInfo={pickTicketLayout.fields['transactiontype']}
                        valueKey="transactiontype"
                        values={layout.getTransactionTypes}
                        value={pickticketissuereturn.transactiontype}
                        updateProperty={updatepickticketProperty} children={children}
                  />
                  <EAMSelect
                        elementInfo={pickTicketLayout.fields['pickticketchoice']}
                        valueKey="pickticketchoice"
                        values={layout.getPickTicketChoice}
                        value={pickticketissuereturn.pickticketchoice}
                        updateProperty={updatepickticketProperty} children={children}
                  /> 
                  <EAMSelect
                        elementInfo={pickTicketLayout.fields['store']}
                        valueKey="store"
                        values={layout.getStores}
                        value={pickticketissuereturn.store}
                        onChangeValue={onChangeHandler}
                        updateProperty={updatepickticketProperty} children={children}
                  />
                </div>
           
        );
    }
}

export default PickticketIssueReturnGeneral;