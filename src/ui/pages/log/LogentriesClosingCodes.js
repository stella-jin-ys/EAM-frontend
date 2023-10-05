import React, {Component} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMSelect from 'eam-components/dist/ui/components/muiinputs/EAMSelect';
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete';
import WSWorkorders from "../../../tools/WSWorkorders";

class LogentriesClosingCodes extends Component {

    render() {
        let {children, workOrderLayout, logentries, updateWorkorderProperty, layout} = this.props;

        return (
            <EISPanel heading="CLOSING CODES">
                <div style={{width: "100%", marginTop: 0}}>

                    <EAMSelect children={children}
                               elementInfo={workOrderLayout.fields['problemcode']}
                               valueKey="problemCode"
                               values={layout.problemCodeValues}
                               value={logentries.problemCode || ''}
                               updateProperty={updateWorkorderProperty}/>

                    <EAMSelect children={children}
                               elementInfo={workOrderLayout.fields['failurecode']}
                               valueKey="failureCode"
                               values={layout.failureCodeValues}
                               value={logentries.failureCode || ''}
                               updateProperty={updateWorkorderProperty}/>

                    <EAMSelect children={children}
                               elementInfo={workOrderLayout.fields['causecode']}
                               valueKey="causeCode"
                               values={layout.causeCodeValues}
                               value={logentries.causeCode || ''}
                               updateProperty={updateWorkorderProperty}/>

                    <EAMSelect children={children}
                               elementInfo={workOrderLayout.fields['actioncode']}
                               valueKey="actionCode"
                               values={layout.actionCodeValues}
                               value={logentries.actionCode || ''}
                               updateProperty={updateWorkorderProperty}/>

                    <EAMAutocomplete children={children}
                                     elementInfo={workOrderLayout.fields['costcode']}
                                     value={logentries.costCode}
                                     updateProperty={updateWorkorderProperty}
                                     valueKey="costCode"
                                     valueDesc={logentries.costCodeDesc}
                                     descKey="costCodeDesc"
                                     autocompleteHandler={WSWorkorders.autocompleteCostCode}/>

                </div>
            </EISPanel>
        )
    }
}

export default LogentriesClosingCodes;