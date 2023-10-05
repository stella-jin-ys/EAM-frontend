import React, {Component} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMSelect from 'eam-components/dist/ui/components/muiinputs/EAMSelect';
import EAMInput from 'eam-components/dist/ui/components/muiinputs/EAMInput'
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete';
import WSPicktickets from "../../../tools/WSPicktickets";
import WS from "../../../tools/WS";
import WSWorkorders from "../../../tools/WSWorkorders";
import EAMCheckbox from "eam-components/dist/ui/components/muiinputs/EAMCheckbox";
import EAMDatePicker from 'eam-components/dist/ui/components/muiinputs/EAMDatePicker'
import EAMDateTimePicker from 'eam-components/dist/ui/components/muiinputs/EAMDateTimePicker'
import EAMBarcodeInput from "eam-components/dist/ui/components/muiinputs/EAMBarcodeInput";

class PickticketExtendedView extends Component {
    state = {
        activityList: []
    };
    onChangeWorkOrder = (value) => {
        //const {updateWorkorderProperty, setWOEquipment} = this.props;
        //Set the commission date on change of Instrument
        if (value) {
            WSPicktickets.getWorkOrderPickTicketActivities(value, this.props.pickticket.store).then(response => {
                const data = response.body.data;
                this.setState(() => ({activityList: this.transformActivities(response.body.data)}));
                //setWOEquipment(value);
            }).catch(error => {
                //Simply don't assign values
            });
        }
    };

    transformActivities = (activities) => {
        return activities.map(activity => ({code: activity.activityCode,
                                            desc: `${activity.activityCode} - ${activity.activityNote}`}));
    }
    render() {
        let {children, pickTicketLayout, pickticket, updatepickticketProperty, layout, onChangeHandler, activityList} = this.props;
        /*console.log("onChangeHandler--",onChangeHandler);
        console.log("activityList--",this.state.activityList);
        console.log("pickticket--",pickticket);
        console.log("layout--",layout);*/
        
        //if new entity pick ticket status shall be UNFINISHED
        if (layout.newEntity)
        {
            pickticket.pickticketstatus='U';
        }
        if (!pickticket.store) {
            return <div/>;         
        }
        
        return (
                <div style={{width: "100%", marginTop: 0}}>
            
                {/*<EAMInput
                        elementInfo={{...pickTicketLayout.fields['picklist'], attribute:'R'}}
                        value={pickticket.picklist}
                        updateProperty={updatepickticketProperty}
                        valueKey="picklist" children={children}/> */}
                
                <EAMInput
                    elementInfo={pickTicketLayout.fields['description']}
                    value={pickticket.description}
                    updateProperty={updatepickticketProperty}
                    valueKey="description" children={children}/>

                <EAMDatePicker children={children}
                            elementInfo={pickTicketLayout.fields['daterequired']}
                            valueKey="daterequired"
                            value={pickticket.daterequired || ''}
                            updateProperty={updatepickticketProperty}/>

                <EAMSelect
                    elementInfo={pickTicketLayout.fields['pickticketstatus']}
                    valueKey="pickticketstatus"
                    values={layout.getStatus}
                    value={pickticket.pickticketstatus}
                    updateProperty={updatepickticketProperty} children={children}/>

                <EAMAutocomplete children={children}
                                     elementInfo={pickTicketLayout.fields['workorder']}
                                     value={pickticket.workorder}
                                     valueDesc={pickticket.workorderDesc}
                                     updateProperty={updatepickticketProperty}
                                     valueKey="workorder"
                                     descKey="workorderDesc"
                                     autocompleteHandler={WSPicktickets.autoCompleteWorkOrders}
                                     onChangeValue={this.onChangeWorkOrder}
                            />
                        
                <EAMSelect 
                        elementInfo={pickTicketLayout.fields['activity']}
                                           valueKey="activity"
                                           values={this.state.activityList}
                                           value={pickticket.activity}
                                           updateProperty={updatepickticketProperty}
                                           children={children}/>

                <EAMSelect
                        elementInfo={pickTicketLayout.fields['store']}
                        valueKey="store"
                        values={layout.getStores}
                        value={pickticket.store}
                        updateProperty={updatepickticketProperty} children={children}/>

                <EAMBarcodeInput updateProperty={value => updatepickticketProperty('equipmentCode', value)} right={30} top={20}>
                        <EAMAutocomplete children={children}
                            elementInfo={pickTicketLayout.fields['equipment']}
                            value={pickticket.equipmentCode}
                            valueKey="equipmentCode"
                            valueDesc={pickticket.equipmentDesc}
                            descKey="equipmentDesc"
                            updateProperty={updatepickticketProperty}
                            autocompleteHandler={WSWorkorders.autocompleteWorkorderEquipment}
                            link={() => pickticket.equipmentCode ? "/equipment/" + pickticket.equipmentCode : null}
                        />
                    </EAMBarcodeInput>
                                       
                <EAMAutocomplete children={children}
                        elementInfo={{...pickTicketLayout.fields['toemployee'],attribute: 'R'}}
                        value={pickticket.toemployee}
                        updateProperty={updatepickticketProperty}
                        valueKey="toemployee"
                        valueDesc={pickticket.toemployeeDesc}
                        descKey="toemployeedesc"
                        autocompleteHandler={WS.autocompleteEmployee}/>

                <EAMSelect
                        elementInfo={{...pickTicketLayout.fields['deladdress'],attribute:'R'}}
                        valueKey="deladdress"
                        values={layout.getAddress}
                        value={pickticket.deladdress}
                        onChangeValue={this.setAddress}
                        updateProperty={updatepickticketProperty} children={children}/>
                <EAMInput
                    elementInfo={{...pickTicketLayout.fields['originator'],readonly:true}}
                    value={pickticket.originator}
                    updateProperty={updatepickticketProperty}
                    valueKey="originator" children={children}/>
                <EAMInput
                    elementInfo={{...pickTicketLayout.fields['approvedby'],readonly:true}}
                    value={pickticket.approvedby}
                    updateProperty={updatepickticketProperty}
                    valueKey="approvedby" children={children}/>
                    

                <EAMInput
                    elementInfo={{...pickTicketLayout.fields['totalvalue'],readonly:true}}
                    value={pickticket.totalvalue}
                    updateProperty={updatepickticketProperty}
                    valueKey="totalvalue" children={children}/>

                <EAMDatePicker
                    children={children}
                    elementInfo={{...pickTicketLayout.fields['dateapproved'],readonly:true}}
                    value={pickticket.dateapproved}
                    updateProperty={updatepickticketProperty}
                    valueKey="dateapproved"/>
                </div>
        );
    }
}

export default PickticketExtendedView;