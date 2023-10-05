import React, {Component} from 'react';
import EAMSelect from 'eam-components/dist/ui/components/muiinputs/EAMSelect'
import EAMInput from 'eam-components/dist/ui/components/muiinputs/EAMInput'
import EAMDatePicker from 'eam-components/dist/ui/components/muiinputs/EAMDatePicker'
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete'
import WSEquipment from "../../../../tools/WSEquipment";
import WS from "../../../../tools/WS";
import OpenInAppIcon from 'mdi-material-ui/OpenInApp'

class AssetDetails extends Component {

    onChangeCategoryCode = (code) => {
        const {updateEquipmentProperty} = this.props;
        //Fetch the category data
        if (code) {
            WSEquipment.getCategoryData(code).then(response => {
                const categoryData = response.body.data;
                if (categoryData && categoryData.length > 2) {
                    //Set the class and manufacturer
                    const classCode = categoryData[2];
                    const classDesc = categoryData[3];
                    const manufacturerCode = categoryData[4];
                    //Update fields
                    if (classCode) {
                        updateEquipmentProperty('classCode', classCode);
                    }
                    if (classDesc) {
                        updateEquipmentProperty('classDesc', classDesc);
                    }
                    if (manufacturerCode) {
                        updateEquipmentProperty('manufacturerCode', manufacturerCode);
                        updateEquipmentProperty('manufacturerDesc', '');
                    }
                }
            }).catch(error => {
                console.log(error);
            })
        }
    };

    render() {
        let {equipment, children, assetLayout, updateEquipmentProperty, layout} = this.props;

        return (
            <div style={{width: "100%", marginTop: 0}}>

                <EAMAutocomplete
                    children={children}
                    elementInfo={assetLayout.fields['class']}
                    value={equipment.classCode}
                    valueDesc={equipment.classDesc}
                    updateProperty={updateEquipmentProperty}
                    valueKey="classCode"
                    descKey="classDesc"
                    autocompleteHandler={(filter) => WS.autocompleteClass('OBJ', filter)}/>

                {/*<EAMAutocomplete
                    children={children}
                    elementInfo={assetLayout.fields['category']}
                    value={equipment.categoryCode}
                    valueDesc={equipment.categoryDesc}
                    updateProperty={updateEquipmentProperty}
                    valueKey="categoryCode"
                    descKey="categoryDesc"
                    autocompleteHandler={WSEquipment.autocompleteEquipmentCategory}/>


                <EAMAutocomplete
                    children={children}
                    elementInfo={assetLayout.fields['costcode']}
                    value={equipment.costCode}
                    valueDesc={equipment.costCodeDesc || ""}
                    updateProperty={updateEquipmentProperty}
                    valueKey="costCode"
                    descKey="costCodeDesc"
                    autocompleteHandler={WSEquipment.autocompleteCostCode}/>*/}

                <EAMDatePicker
                    children={children}
                    elementInfo={assetLayout.fields['commissiondate']}
                    value={equipment.comissionDate}
                    updateProperty={updateEquipmentProperty}
                    valueKey="comissionDate"/>

                <EAMAutocomplete children={children}
                                    elementInfo={assetLayout.fields['assignedto']}
                                    value={equipment.assignedTo}
                                    updateProperty={updateEquipmentProperty}
                                    valueKey="assignedTo"
                                    valueDesc={equipment.assignedToDesc}
                                    descKey="assignedToDesc"
                                    autocompleteHandler={WS.autocompleteEmployee}/>

                <EAMSelect
                    children={children}
                    elementInfo={assetLayout.fields['criticality']}
                    value={equipment.criticality}
                    values={layout.criticalityValues}
                    updateProperty={updateEquipmentProperty}
                    valueKey="criticality"/>

                <EAMAutocomplete children={children}
                                    elementInfo={assetLayout.fields['manufacturer']}
                                    value={equipment.manufacturerCode}
                                    valueDesc={equipment.manufacturerDesc}
                                    updateProperty={updateEquipmentProperty}
                                    valueKey="manufacturerCode"
                                    descKey="manufacturerDesc"
                                    autocompleteHandler={WSEquipment.autocompleteManufacturer}/>

                <EAMInput
                    children={children}
                    elementInfo={assetLayout.fields['serialnumber']}
                    value={equipment.serialNumber}
                    updateProperty={updateEquipmentProperty}
                    valueKey="serialNumber"/>

                <EAMInput
                    children={children}
                    elementInfo={assetLayout.fields['model']}
                    value={equipment.model}
                    updateProperty={updateEquipmentProperty}
                    valueKey="model"/>

                <EAMAutocomplete children={children}
                                    elementInfo={assetLayout.fields['part']}
                                    value={equipment.partCode}
                                    valueDesc={equipment.partDesc}
                                    updateProperty={updateEquipmentProperty}
                                    valueKey="partCode"
                                    descKey="partDesc"
                                    autocompleteHandler={WSEquipment.autocompleteEquipmentPart}
                                    link={() => equipment.partCode ? "/part/" + equipment.partCode: null}
                                    icon={<OpenInAppIcon/>}/>

                <EAMAutocomplete children={children}
                                    elementInfo={assetLayout.fields['store']}
                                    value={equipment.storeCode}
                                    valueDesc={equipment.storeDesc}
                                    updateProperty={updateEquipmentProperty}
                                    valueKey="storeCode"
                                    descKey="storeDesc"
                                    autocompleteHandler={WSEquipment.autocompleteEquipmentStore}/>

                <EAMAutocomplete children={children}
                                    elementInfo={assetLayout.fields['bin']}
                                    value={equipment.bin}
                                    valueDesc={equipment.binDesc}
                                    updateProperty={updateEquipmentProperty}
                                    valueKey="bin"
                                    descKey="binDesc"
                                    autocompleteHandler={(filter, config) => WSEquipment.autocompleteEquipmentBin(this.props.equipment.storeCode, filter, config)}/>

            </div>
        )
    }
}

export default AssetDetails