import WS from './WS';

/**
 * Handles all calls to REST Api
 */
class WSPicktickets {

    //
    // PARTS
    //

    initPickticket(entity, systemFunction, userFunction, params, config = {}) {
        return WS._get(`/pickticket/init/${entity}/${systemFunction}/${userFunction}${params}`, config);
    }

    getPart(code, config = {}) {
        code = encodeURIComponent(code);
        return WS._get('/pickticket/' + code, config);
    }

    //
    // ACTIVITIES AND BOOKED LABOURS
    //
    getWorkOrderPickTicketActivities(number, store, config = {}) {
        return WS._get('/pickticket/readactvities/'+number + '/'+store, config);
    }

    getWorkOrder(number, config = {}) {
        return WS._get('/workorders/' + number, config);
    }

    createPickTicket(pickticket, config = {}) {
        return WS._post('/pickticket/', pickticket, config);
    }

    updatePart(pickticket, config = {}) {
        return WS._put('/pickticket/', pickticket, config);
    }

    deletePickTicket(code, config = {}) {
        return WS._delete('/pickticket/' + code, config);
    }

    //
    // AUTOCOMPLETE PARTS
    //

    autocompletePartClass = (filter, config = {}) => {
        filter = encodeURIComponent(filter);
        return WS._get('/autocomplete/part/class/' + filter, config);
    };

    autocompletePartCategory = (filter, config = {}) => {
        filter = encodeURIComponent(filter);
        return WS._get('/autocomplete/part/category/' + filter, config);
    };

    autocompletePartCommodity = (filter, config = {}) => {
        filter = encodeURIComponent(filter);
        return WS._get('/autocomplete/part/commodity/' + filter, config);
    };

    autocompletePartUOM = (filter, config = {}) => {
        filter = encodeURIComponent(filter);
        return WS._get('/autocomplete/part/uom/' + filter, config);
    };

    //
    // DROPDOWNS STORES
    //

    getStores(config = {}) {
        return WS._get('/partusage/stores', config);
    }

    //
    // DROPDOWNS ADDRESS
    //

    getAddress(config = {}) {
        return WS._get('/pickticket/getaddress', config);
    }

    getStatus(config = {}) {
        return WS._get('/pickticket/getstatus', config);
    }
    //
    // DROPDOWNS WorkOrders
    //

    autoCompleteWorkOrders(filter, config = {}) {
        return WS._get('/pickticket/workorders/'+filter, config);
    }
    //
    // DROPDOWNS TRANSACTION TYPE
    //

    getTransactionTypes(config = {}) {
        return WS._get('/pickticket/transactiontypes', config);
    }
    //
    // DROPDOWNS PICK TICKET CHOICE
    //

    getPickTicketChoice(config = {}) {
        return WS._get('/pickticket/pickticketchoice', config);
    }
    //PARTS CONNECTED TO A PICK TICKET
    getPartUsagePickTicketList(pickticket, config = {}) {
        return WS._get('/pickticket/transactionpart/' + pickticket, config);
    }
 //GET APPROVED PICK TICKETS FOR A STORE
    getApprovedPickTicketList(store, config = {}) {
        return WS._get('/pickticket/pickticektapproved/' + store, config);
    }
    //GET THE BINS FOR A STORE IN PICKTICKET
    getBins(partCode, storeCode, config = {}) {
        return WS._get('/pickticket/bins/' + partCode + "/" +storeCode, config);
    }
    
    getPartUsageSelectedAsset(partCode, storeCode, binCode, config ={}) {
        console.log("part code in ws: ", partCode);
        return WS._get('/pickticket/getassetpart?partcode='+partCode+'&storecode='+storeCode+'&bincode='+binCode, config);
    }

    getPartUsagePart(workorder, store, code, config = {}) {
        return WS._get(`/autocomplete/partusage/part/${workorder}/${store}/${code}`, config);
    }

    getInitNewPartUsage(workorder, config = {}) {
        return WS._post('/partusage/init', workorder, config);
    }
    //
    //WHERE USED PARTS
    //

    getPartWhereUsed(partCode, config = {}) {
        partCode = encodeURIComponent(partCode);
        return WS._get('/partlists/partsassociated/' + partCode, config);
    }

    //
    // PART STOCK
    //

    getPartStock(partCode, config = {}) {
        partCode = encodeURIComponent(partCode);
        return WS._get('/parts/partstock/' + partCode);
    }

    //
    // PRINT BARCODE
    //

    printBarcode(barcodeInput, config = {}) {
        return WS._put('/barcode/printBarcode/', barcodeInput, config);
    }

}

export default new WSPicktickets();