import WS from "../tools/WS";
import queryString from "query-string"
import { 
        TAB_CODES, 
        TAB_CODES_ASSETS, 
        TAB_CODES_LOCATIONS, 
        TAB_CODES_POSITIONS, 
        TAB_CODES_SYSTEMS, 
        TAB_CODES_WORK_ORDERS, 
        TAB_CODES_PARTS,
        TAB_CODES_PICKTICKET,
        TAB_CODES_PERMITTOWORK
    } from "../ui/components/entityregions/TabCodeMapping"
export const UPDATE_APPLICATION = 'UPDATE_APPLICATION';

export function updateApplication(value) {
    return {
        type: UPDATE_APPLICATION,
        value: value
    }
}

export function getUserInfo() {
    return (dispatch) => {
        //Get URL parameters
        const values = queryString.parse(window.location.search)
        const screenCode = values.screen;
        const currentScreen = window.location.pathname.replace(process.env.REACT_APP_PUBLIC_URL,'').split('/')[1];
      
        return WS.getUserData(currentScreen, screenCode)
            .then(response => {
                console.log("response:",response);
                let userdata = response.body.data;
                Promise.all(createPromiseArray(userdata)).then(values => {
                    console.log("value:",values);
                    let serviceAccounts;
                    try {
                        serviceAccounts = values[0].body.data.EL_SERVI && Object.keys(JSON.parse(values[0].body.data.EL_SERVI));
                    } catch (err) {
                        serviceAccounts = [];
                    }
                    dispatch(updateApplication({
                        userData: response.body.data,
                        applicationData: {
                            ...values[0].body.data,
                            serviceAccounts
                        },
                       
                        assetLayout: values[1] ? values[1].body.data : null,
                        positionLayout: values[2] ? values[2].body.data : null,
                        systemLayout: values[3] ? values[3].body.data : null,
                        partLayout: values[4] ? values[4].body.data : null,
                        workOrderLayout: values[5] ? values[5].body.data : null,
                        locationLayout: values[6] ? values[6].body.data : null,
                        pickTicketLayout: values[7] ? values[7].body.data : null,
                        permitToWorkLayout: values[8] ? values[8].body.data : null,
                    }))
                })
            })
            .catch(response => {
                if (response && response.response.status === 403) {
                    dispatch(updateApplication({userData: {invalidAccount: true}}));
                }
                else {
                    dispatch(updateApplication({userData: {}}));
                }
            })
    }
}

export function updateScreenLayout(entity, entityDesc, systemFunction, userFunction, tabs) {
    return (dispatch, getState) => {
        let userData = getState().application.userData;
        WS.getScreenLayout(userData.eamAccount.userGroup, entity, systemFunction, userFunction, tabs)
            .then(response => {
                dispatch(updateApplication({
                    [entityDesc + 'Layout']: response.body.data,
                    userData: {
                        ...userData,
                        [entityDesc + 'Screen']: userFunction
                    }
                }))
            })
    }
}

export function updateWorkOrderScreenLayout(screenCode) {
    return updateScreenLayout('EVNT', 'workOrder', 'WSJOBS', screenCode, TAB_CODES_WORK_ORDERS)
}
export function updateAssetScreenLayout(screenCode) {
    return updateScreenLayout('OBJ', 'asset', 'OSOBJA', screenCode, TAB_CODES_ASSETS);
}

export function updatePositionScreenLayout(screenCode) {
    return updateScreenLayout('OBJ', 'position', 'OSOBJP', screenCode, TAB_CODES_POSITIONS);
}

export function updateSystemScreenLayout(screenCode) {
    return updateScreenLayout('OBJ', 'system', 'OSOBJS', screenCode, TAB_CODES_SYSTEMS);
}

export function updatePartScreenLayout(screenCode) {
    return updateScreenLayout('PART', 'part', 'SSPART', screenCode, TAB_CODES_PARTS);
}

export function updateLocationScreenLayout(screenCode) {
    return updateScreenLayout('OBJ', 'location', 'OSOBJL', screenCode, TAB_CODES_LOCATIONS)
}
export function updatePickTicketScreenLayout(screenCode) {
    return updateScreenLayout('PICK', 'pickticket', 'SSPICK', screenCode,TAB_CODES_PICKTICKET);
}
export function updatePermitToWorkScreenLayout(screenCode) {
    return updateScreenLayout('PTW', 'permittowork', 'WSPMTW', screenCode,TAB_CODES_PICKTICKET);
}

/**
 * Create promise array with layout information for main screens
 *
 * @param userdata
 * @returns {*[]}
 */
function createPromiseArray(userdata) {
    //
    let applicationDataPromise = WS.getApplicationData();
    //
    let assetScreenPromise = Promise.resolve(false);
    if (userdata.assetScreen) {
        assetScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup, 'OBJ', 'OSOBJA',
            userdata.assetScreen, TAB_CODES_ASSETS);
            //console.log("asset assetScreenPromise:",assetScreenPromise);
    }
    //
    let positionScreenPromise = Promise.resolve(false);
    if (userdata.positionScreen) {
        positionScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup,'OBJ', 'OSOBJP',
            userdata.positionScreen, TAB_CODES_POSITIONS)
    }
    //
    let systemScreenPromise = Promise.resolve(false);
    if (userdata.systemScreen) {
        systemScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup,'OBJ', 'OSOBJS',
            userdata.systemScreen, TAB_CODES_SYSTEMS)
    }
    //
    let partScreenPromise = Promise.resolve(false);
    if (userdata.partScreen) {
        partScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup,'PART', "SSPART",
            userdata.partScreen, TAB_CODES_PARTS)
    }
    //
    let woScreenPromise = Promise.resolve(false);
    if (userdata.workOrderScreen) {
        woScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup,'EVNT', "WSJOBS",
            userdata.workOrderScreen, TAB_CODES_WORK_ORDERS)
            //console.log("woScreenPromise:",woScreenPromise);
    }

     //
     let locationScreenPromise = Promise.resolve(false);
     if (userdata.locationScreen) {
        locationScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup,'LOC', "OSOBJL",
             userdata.locationScreen, TAB_CODES_LOCATIONS)
     }

    let pickTicketScreenPromise = Promise.resolve(false);
    if (userdata.pickTicketScreen) {
        pickTicketScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup,'PICK', "SSPICK",
             userdata.pickTicketScreen, TAB_CODES_PICKTICKET)
    }
    let permitToWorkTicketScreenPromise = Promise.resolve(false);
    console.log("userdata",userdata);
    if (userdata.permitToWorkScreen) {
        permitToWorkTicketScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup,'PTW', "WSPMTW",
             userdata.permitToWorkScreen, TAB_CODES_PERMITTOWORK)
    }
    return [applicationDataPromise,
        assetScreenPromise,
        positionScreenPromise,
        systemScreenPromise,
        partScreenPromise,
        woScreenPromise,
        locationScreenPromise,
        pickTicketScreenPromise,
        permitToWorkTicketScreenPromise]
}