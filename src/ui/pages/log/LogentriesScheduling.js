import React, {Component} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMDateTimePicker from 'eam-components/dist/ui/components/muiinputs/EAMDateTimePicker'
import EAMDatePicker from 'eam-components/dist/ui/components/muiinputs/EAMDatePicker'
import EAMAutocomplete from "eam-components/dist/ui/components/muiinputs/EAMAutocomplete";
import WS from "../../../tools/WS";
import UDFChar from "../../components/userdefinedfields/UDFChar";

class LogentriesScheduling extends Component {

    render() {
        let {children, workOrderLayout, logentries, updateWorkorderProperty} = this.props;

        return (
            <EISPanel heading="SCHEDULING">
                <div style={{width: "100%", marginTop: 0}}>

                    <EAMAutocomplete children={children}
                                     elementInfo={workOrderLayout.fields['reportedby']}
                                     value={logentries.reportedBy}
                                     updateProperty={updateWorkorderProperty}
                                     valueKey="reportedBy"
                                     valueDesc={logentries.reportedByDesc}
                                     descKey="reportedByDesc"
                                     autocompleteHandler={WS.autocompleteEmployee}/>

                    <EAMAutocomplete children={children}
                                     elementInfo={workOrderLayout.fields['assignedto']}
                                     value={logentries.assignedTo}
                                     updateProperty={updateWorkorderProperty}
                                     valueKey="assignedTo"
                                     valueDesc={logentries.assignedToDesc}
                                     descKey="assignedToDesc"
                                     autocompleteHandler={WS.autocompleteEmployee}/>

                    <EAMDatePicker children={children}
                                   elementInfo={workOrderLayout.fields['reqstartdate']}
                                   valueKey="requestedStartDate"
                                   value={logentries.requestedStartDate || ''}
                                   updateProperty={updateWorkorderProperty}/>

                    <EAMDatePicker children={children}
                                   elementInfo={workOrderLayout.fields['reqenddate']}
                                   valueKey="requestedEndDate"
                                   value={logentries.requestedEndDate || ''}
                                   updateProperty={updateWorkorderProperty}/>

                    <EAMDatePicker children={children}
                                   elementInfo={workOrderLayout.fields['schedstartdate']}
                                   valueKey="scheduledStartDate"
                                   value={logentries.scheduledStartDate || ''}
                                   updateProperty={updateWorkorderProperty}/>

                    <EAMDatePicker children={children}
                                   elementInfo={workOrderLayout.fields['schedenddate']}
                                   valueKey="scheduledEndDate"
                                   value={logentries.scheduledEndDate || ''}
                                   updateProperty={updateWorkorderProperty}/>

                    <EAMDateTimePicker children={children}
                                       elementInfo={workOrderLayout.fields['startdate']}
                                       valueKey="startDate"
                                       value={logentries.startDate || ''}
                                       updateProperty={updateWorkorderProperty}/>

                    <EAMDateTimePicker children={children}
                                       elementInfo={workOrderLayout.fields['datecompleted']}
                                       valueKey="completedDate"
                                       value={logentries.completedDate || ''}
                                       updateProperty={updateWorkorderProperty}/>

                    <UDFChar fieldInfo={workOrderLayout.fields['udfchar17']}
                             fieldValue={logentries.userDefinedFields.udfchar17}
                             fieldValueDesc={logentries.userDefinedFields.udfchar17Desc}
                             fieldKey={`userDefinedFields.udfchar17`}
                             descKey={`userDefinedFields.udfchar17Desc`}
                             updateUDFProperty={updateWorkorderProperty}
                             children={children}/>

                </div>
            </EISPanel>
        )
    }
}

export default LogentriesScheduling