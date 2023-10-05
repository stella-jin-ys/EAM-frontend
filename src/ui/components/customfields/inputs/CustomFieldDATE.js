import React from 'react';
import EAMSelect from 'eam-components/dist/ui/components/muiinputs/EAMSelect'
import EAMDatePicker from 'eam-components/dist/ui/components/muiinputs/EAMDatePicker'
import tools from '../CustomFieldTools'

function CustomFieldDATE(props) {

    let {customField, updateCustomFieldValue, elementInfo, children, lookupValues} =props;
    elementInfo = {...elementInfo, readonly: props.readonly};

    if (tools.isLookupCustomField(customField)) {
        return <EAMSelect
            children={children}
            elementInfo={elementInfo}
            valueKey="value"
            values={lookupValues && lookupValues[customField.code]}
            value={customField.value}
            updateProperty={updateCustomFieldValue}/>
    } else {
        return (
            <EAMDatePicker
                children={children}
                elementInfo={elementInfo}
                value={customField.value}
                updateProperty={updateCustomFieldValue}
                valueKey="value"/>
        )
    }

}

export default CustomFieldDATE;