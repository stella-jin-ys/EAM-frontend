import React, {Component} from 'react';
import WSWorkorders from "../../../../tools/WSWorkorders";
import EISTable from 'eam-components/dist/ui/components/table';
import Button from '@material-ui/core/Button';
import DoaseRateMeasurementDialog from "./DoaseRateMeasurementDialog";
import BlockUi from 'react-block-ui';


const buttonStyle = {
    position: 'relative',
    float: 'left',
    bottom: '-13px',
    left: '5px',
};

class DoaseRateMeasurement extends Component {

    headers = ['Distant',  'Dose Rate Signs','Dose Rate Value', 'PreDetermined Units', 'radiation Type', 'Comment'];
    propCodes = ['distant', 'doaseRateSigns','doaseRateValue', 'preDeterminedUnits', 'radiationType', 'comment'];
    linksMap = new Map([['partCode', {linkType: 'fixed', linkValue: 'part/', linkPrefix: '/'}]]);

    state = {
        data: [],
        isDialogOpen: false,
        isLoading: false
    };

    children = {};

    componentWillMount() {
        this.fetchData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.workorder.number && nextProps.workorder.number !== this.props.workorder.number)
            this.fetchData(nextProps);
        else if (!nextProps.workorder.number) {
            this.setState(() => ({
                data: []
            }));
        }
    }
    fetchData = (props) => {
        this.setState(() => ({isLoading: true}));
        let woNumber = props.workorder.number;

        if (woNumber) {
            WSWorkorders.getMeasurementValues(woNumber).then(response => {
                this.setState(() => ({
                    data: response.body.data,
                    isLoading: false
                }));
            }).catch(error => {
                this.props.handleError(error);
                this.setState(() => ({isLoading: false}));
            });
        }
    };

    openPartUsageDialog = () => {
        this.setState(() => ({isDialogOpen: true}));
    };

    closeDoaseRateMeasurementDialog = () => {
        this.setState(() => ({isDialogOpen: false}));
    };

    handleDoaseRateMeasurement = (doaseRateMeasurement) => {
        //Validate fields first
        //if (!this.validateFields()) {
            //this.props.showError('Please fill all the required fields');
            //return;
        //}
        this.setState(() => ({isLoading: true}));
        //Remove transaction info prop
        delete doaseRateMeasurement.transactionInfo;
        //Save the record
        WSWorkorders.createDoaseRateMeasurement(doaseRateMeasurement).then(response => {
            //Notification
            this.props.showNotification('Dose Rate Measurement created successfully');
            //Close dialog
            this.closeDoaseRateMeasurementDialog();
            //Init the list of part usage again
            this.fetchData(this.props);
            this.setState(() => ({isLoading: false}));
        }).catch(error => {
            this.props.handleError(error);
            this.setState(() => ({isLoading: false}));
        });
    };

    validateFields = () => {
        let validationPassed = true;
        Object.keys(this.children).forEach(key => {
            if (!this.children[key].validate()) {
                validationPassed = false;
            }
        });
        return validationPassed;
    };

    render() {
        /*console.log("data-data--",this.state.data);
        console.log("this.state.isLoading---",this.state.isLoading);*/

        return (
            <div style={{width: '100%', height: '100%'}}>
                {this.state.isLoading ? <BlockUi tag="div" blocking={this.props.isLoading}>
                        <div>Loading Dose Rate Measurement...</div>
                    </BlockUi> :
                    <div style={{width: '100%', height: '100%'}}>
                        <EISTable data={this.state.data} headers={this.headers} propCodes={this.propCodes}
                                  linksMap={this.linksMap}/>
                        {this.props.workorder.statusCode =='IP' &&          
                        <Button onClick={this.openPartUsageDialog} color="primary" style={buttonStyle}>
                            Add Dose Rate Measurement
                        </Button>}
                    </div>}
                    
                <DoaseRateMeasurementDialog handleSave={this.handleDoaseRateMeasurement}
                                 showNotification={this.props.showNotification}
                                 handleError={this.props.handleError}
                                 handleCancel={this.closeDoaseRateMeasurementDialog} tabLayout={this.props.tabLayout}
                                 isDialogOpen={this.state.isDialogOpen} workorder={this.props.workorder}
                                 isLoading={this.state.isLoading}
                                 children={this.children}/>
            </div>
        )
    }
}

export default DoaseRateMeasurement;