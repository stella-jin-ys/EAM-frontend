import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EISTable from 'eam-components/dist/ui/components/table';
import { Component } from 'react';
import WSWorkorder from "../../../../tools/WSWorkorders";
import './permitToWork.css';


class PermitToWork extends Component {

    headers = [
        "PTW ID",
        "Description",
        "PTW Type",
        "PTW Status"
    ];

    propCodes = [
        "number",
        "description",
        "type",
        "status"
    ];

    state = {
        ptwData: [],
    };

    componentWillMount() {
        this.getPTW(this.props.workorder);
    }

    getPTW = (workorder) => {
        WSWorkorder.getPermitToWork(workorder)
            .then((response) => {
              console.log("response.body.data:", response.body.data);
              this.setState(() => ({
               ptwData: response.body.data,
                isLoading: false,
              }));
            })
            .catch((error) => {
              console.log("error details: " , error);
              this.setState(() => ({ isLoading: false }));
        });

    }

    render() {

        const rows = this.state.ptwData;

        return (
           <EISTable data={rows} headers={this.headers} propCodes={this.propCodes}/>
        )
    }
}

export default PermitToWork;