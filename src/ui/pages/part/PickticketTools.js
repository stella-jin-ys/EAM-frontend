class PickticketTools {


    isRegionAvailable(regionCode, pickTicketLayout) {
        //Fields and tabs
        const {fields, tabs} = pickTicketLayout;
        //Check according to the case
        switch (regionCode) {
            case 'CUSTOM_FIELDS':
                //Is the block 6
                return fields.block_6 && fields.block_6.attribute !== 'H';
            default:/*All other regions*/
                //Regions in here:
                // Where used
                return tabs[regionCode] && tabs[regionCode].alwaysAvailable;
        }
    }
}

export default new PickticketTools();