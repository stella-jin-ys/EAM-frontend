import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { EAMCellField } from 'eam-components/dist/ui/components/grids/eam/utils';
import EAMGrid from 'eam-components/dist/ui/components/grids/eam/EAMGrid';
import SyncedQueryParamsEAMGridContext from "../../../../tools/SyncedQueryParamsEAMGridContext";

const cellRenderer = ({ column, value }) => {
    if (column.id === 'pickticketnum') {
        return (
            <Typography>
                <Link to={"/pickticket/" + value}>
                    {value}
                </Link>
            </Typography>
        )
    }
    return EAMCellField({ column, value });
}

const PickticketSearch = (props) => {
    const { pickTicketScreen, handleError } = props;
    return (
        <SyncedQueryParamsEAMGridContext
            gridName={pickTicketScreen.screenCode}
            userFunctionName={pickTicketScreen.screenCode}
            handleError={handleError}
            searchOnMount={pickTicketScreen.startupAction !== "N"}
            cellRenderer={cellRenderer}
        >
        <EAMGrid />
        </SyncedQueryParamsEAMGridContext>
    );
}

export default PickticketSearch;