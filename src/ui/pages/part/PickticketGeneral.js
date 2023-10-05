import React, {Component} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMSelect from 'eam-components/dist/ui/components/muiinputs/EAMSelect';
import EAMInput from 'eam-components/dist/ui/components/muiinputs/EAMInput'
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete';
import WSPicktickets from "../../../tools/WSPicktickets";
import EAMCheckbox from "eam-components/dist/ui/components/muiinputs/EAMCheckbox";
import EAMDatePicker from 'eam-components/dist/ui/components/muiinputs/EAMDatePicker'
import EAMDateTimePicker from 'eam-components/dist/ui/components/muiinputs/EAMDateTimePicker'

class PickticketGeneral extends Component {
    render() {
        let {children, pickTicketLayout, pickticket, updatepickticketProperty, layout} = this.props;
        /*console.log("pickticket layout--111---", layout);
        console.log("pickticket--111---", pickticket);
        console.log("pickTicketLayout--111---", pickTicketLayout);
        console.log("updatepickticketProperty--111---", updatepickticketProperty);
        console.log("children--111---", children);
        console.log("pickTicketLayout.fields['store']--111---", pickTicketLayout.fields['store']);*/
        return (
           
                <div style={{width: "100%", marginTop: 0, minWidth: "700"}}>
            
                <EAMSelect
                        elementInfo={pickTicketLayout.fields['store']}
                        valueKey="store"
                        values={layout.getStores}
                        value={pickticket.store}
                        updateProperty={updatepickticketProperty} children={children}/>
                </div>
           
        );
    }
}

export default PickticketGeneral;