import React, {Component} from 'react';
import WSWorkorders from "../../../../tools/WSWorkorders";
import EISTable from 'eam-components/dist/ui/components/table';
import Button from '@material-ui/core/Button';
import ContaminationMeasurementDialog from "./ContaminationMeasurementDialog";
import BlockUi from 'react-block-ui';


const buttonStyle = {
    position: 'relative',
    float: 'left',
    bottom: '-13px',
    left: '5px',
};

class ContaminationMeasurement extends Component {

    headers = ['Type of Measurement', 'Measurement Option' ,'Measurement Value' ,'Predetermined Units', 'Comment'];
    propCodes = ['typeOfMeasurement','measurementOptions', 'measurementValue', 'preDeterminedUnits', 'comment'];
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
            WSWorkorders.getContaminationMeasurement(woNumber).then(response => {
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

    closeContaminationMeasurementDialog = () => {
        this.setState(() => ({isDialogOpen: false}));
    };

    handleContaminationMeasurement = (contaminationMeasurement) => {
        //Validate fields first
        //console.log("contaminationMeasurement-save-",contaminationMeasurement);
        if (!this.validateFields()) {
            this.props.showError('Please fill all the required fields');
            return;
        }
        this.setState(() => ({isLoading: true}));
        //Remove transaction info prop
        delete contaminationMeasurement.transactionInfo;
        //Save the record
        WSWorkorders.createContaminationMeasurement(contaminationMeasurement).then(response => {
            //Notification
            this.props.showNotification('Contamination Measurement created successfully');
            //Close dialog
            this.closeContaminationMeasurementDialog();
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
        //console.log("contaminationMeasurement1111---",this.state.data);
        return (

            
            <div style={{width: '100%', height: '100%'}}>
                {this.state.isLoading ? <BlockUi tag="div" blocking={this.props.isLoading}>
                        <div>Loading Contamination Measurement...</div>
                    </BlockUi> :
                    <div style={{width: '100%', height: '100%'}}>
                        <EISTable data={this.state.data} headers={this.headers} propCodes={this.propCodes}
                                  linksMap={this.linksMap}/>
                        {this.props.workorder.statusCode =='IP' &&            
                        <Button onClick={this.openPartUsageDialog} color="primary" style={buttonStyle}>
                            Add Contamination Measurement
                        </Button>}
                    </div>}
                <ContaminationMeasurementDialog handleSave={this.handleContaminationMeasurement}
                                 showNotification={this.props.showNotification}
                                 handleError={this.props.handleError}
                                 handleCancel={this.closeContaminationMeasurementDialog} tabLayout={this.props.tabLayout}
                                 isDialogOpen={this.state.isDialogOpen} workorder={this.props.workorder}
                                 isLoading={this.state.isLoading}
                                 children={this.children}/>
            </div>
           
        )
    }
}

export default ContaminationMeasurement;