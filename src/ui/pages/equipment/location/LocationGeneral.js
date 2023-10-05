import React from "react";
import EAMInput from "eam-components/dist/ui/components/muiinputs/EAMInput";
import EAMAutocomplete from "eam-components/dist/ui/components/muiinputs/EAMAutocomplete";
import WS from "../../../../tools/WS";
import StatusRow from "../../../components/statusrow/StatusRow";

const AssetGeneral = props => {
    const {
        location,
        children,
        locationLayout,
        updateEquipmentProperty,
        layout
    } = props;

    
    return (
        <div style={{ width: "100%", marginTop: 0 }}>
            {layout.newEntity && (
                <EAMInput
                    children={children}
                    elementInfo={locationLayout.fields["equipmentno"]}
                    value={location.code}
                    updateProperty={updateEquipmentProperty}
                    valueKey="code"
                />
            )}

 
                        
                    <EAMInput
                        children = {children}
                        elementInfo={{...locationLayout.fields['udfchar01'], readonly: true}}
                        value={location.userDefinedFields.udfchar01}
                        updateProperty={updateEquipmentProperty}
                        valueKey="userDefinedFields.udfchar01"
                    />
                    <EAMInput
                        children = {children}
                        elementInfo={{...locationLayout.fields['udfchar05'], readonly: true}}
                        value={location.userDefinedFields.udfchar05}
                        updateProperty={updateEquipmentProperty}
                        valueKey="userDefinedFields.udfchar05"
                    />
 
  <EAMAutocomplete
                children={children}
                elementInfo={locationLayout.fields["department"]}
                value={location.departmentCode}
                valueDesc={location.departmentDesc}
                updateProperty={updateEquipmentProperty}
                valueKey="departmentCode"
                descKey="departmentDesc"
                autocompleteHandler={WS.autocompleteDepartment}
            />
             <StatusRow
                entity={location}
                entityType={"equipment"}
                style={{marginTop: "10px", marginBottom: "-10px"}}
            />
                
    </div>
    );
};

export default AssetGeneral;