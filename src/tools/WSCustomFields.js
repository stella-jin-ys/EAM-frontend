import WS from './WS';

/**
 * Handles all calls to REST Api
 */
class WSCustomFields {

    //
    //CUSTOM FIELDS SUPPORT
    //

    getCustomFieldsLookupValues(entity, inforClass, config = {}) {
        return WS._get('/customfields/lookupvalues?entity=' + entity + '&inforClass=' + inforClass, config);
    }

    autocompleteCustomFieldRENT = (rentity, filter, config = {}) => {
        return WS._get('/customfields/autocomplete/' + rentity + '/' + filter, config);
    };

    autocompleteCustomFieldRENTESS = (rentity, filter, config = {}) => {
        return WS._get('/customfieldsess/autocomplete/' + rentity + '/' + filter, config);
    };
    getCustomFields(entity, classCode, config = {}) {
        return WS._get(`/customfields/data?entity=${entity}&inforClass=${classCode}`, config);
    }
}

export default new WSCustomFields();