import React, { useState, useEffect } from 'react';
import EISTable from 'eam-components/dist/ui/components/table';
import Button from '@material-ui/core/Button';
import BlockUi from 'react-block-ui';
import EISPanel from 'eam-components/dist/ui/components/panel';
import Grid from '@material-ui/core/Grid';

const buttonStyle = {
    position: 'relative',
    float: 'left',
    bottom: '-13px',
    left: '5px',
};

function WorkorderOfflineSyn(props) {

    let headers = ['Index', 'Wo Number', 'Description', 'Error'];
    let propCodes = ['index', 'number', 'description', 'ErrorMsg'];
    let linksMap = new Map([['partCode', { linkType: 'fixed', linkValue: 'part/', linkPrefix: '/' }]]);

    let [data, setData] = useState([]);
    let [dataChecklist, setDataChecklist] = useState([]);
    let [isDialogOpen, setIsDialogOpen] = useState(false);
    let [isLoading, setIsLoading] = useState([]);

    useEffect(() => {
        fetchData()
        fetchDataChecklist()
    }, [])


    let errorArray = [];

    let fetchData = () => {
        //read the error session map
        //var errorMap = sessionStorage.getItem('offlineErrorMap');
        var myMap = localStorage.myMap;
        console.log("myMap: 11111", myMap);
        if (myMap != null) {
            var errorMap = new Map(JSON.parse(localStorage.myMap));

            console.log("errorMap:", errorMap);
            var indexedDBOpenRequest = indexedDB.open("workorder", 1);
            indexedDBOpenRequest.onsuccess = function () {

                let db = this.result;
                console.log('db--11:', db);
                let transaction = db.transaction("workorder_requests", "readwrite");
                let storeObj = transaction.objectStore("workorder_requests");

                var cursorRequest = storeObj.openCursor();
                cursorRequest.onsuccess = function (evt) {
                    var cursor = evt.target.result;
                    //console.log('cursor--:', cursor);

                    if (cursor) {
                        //console.log("cursor.value", cursor.value);
                        const value = cursor.value;
                        if (errorMap != null) {
                            var valueJson = JSON.parse(cursor.value);
                            console.log("cursor.key:", "\"" + cursor.key + "\"");
                            var key = cursor.key + "";// to make it string otherwise it is not able to read the key from map
                            console.log("errorMap.get(cursor.key)", key, errorMap.get(key));
                            //JSON.parse(JSON.stringify(obj1))
                            valueJson.ErrorMsg = errorMap.get(key);
                            valueJson.index = key;
                            console.log("valueJson:", valueJson);
                            errorArray.push(valueJson);
                            console.log("array lentgh", errorArray.length);
                            cursor.continue();
                        }

                    }

                };
                setData(errorArray);
                console.log("errorArray:", errorArray);
                console.log("data:", data);
            };

            indexedDBOpenRequest.onerror = function (error) {
                console.error("IndexedDB error:", error);
            };
            sessionStorage.removeItem('offlineErrorMap');
        }
    };
    let fetchDataChecklist = () => {
        //read the error session map
        //var errorMap = sessionStorage.getItem('offlineErrorMap');
        var myMapChecklist = localStorage.myMapChecklist;
        console.log("myMapChecklist: 11111", myMapChecklist);
        if (myMapChecklist != null) {
            var errorMap = new Map(JSON.parse(localStorage.myMapChecklist));
            console.log("errorMap: 11111", errorMap.get("1"));
            console.log("errorMap:", errorMap);
            var indexedDBOpenRequest = indexedDB.open("checklist", 1);
            indexedDBOpenRequest.onsuccess = function () {

                let db = this.result;
                console.log('db--11:', db);
                let transaction = db.transaction("checklist_changes", "readwrite");
                let storeObj = transaction.objectStore("checklist_changes");

                var cursorRequest = storeObj.openCursor();
                cursorRequest.onsuccess = function (evt) {
                    var cursor = evt.target.result;
                    //console.log('cursor--:', cursor);

                    if (cursor) {
                        //console.log("cursor.value", cursor.value);
                        const value = cursor.value;
                        if (errorMap != null) {
                            var valueJson = JSON.parse(cursor.value);
                            console.log("cursor.key:", "\"" + cursor.key + "\"");
                            var key = cursor.key + "";// to make it string otherwise it is not able to read the key from map
                            console.log("errorMap.get(cursor.key)", key, errorMap.get(key));
                            //JSON.parse(JSON.stringify(obj1))
                            valueJson.ErrorMsg = errorMap.get(key);
                            valueJson.index = key;
                            console.log("valueJson:", valueJson);
                            errorArray.push(valueJson);
                            console.log("array lentgh", errorArray.length);
                            cursor.continue();
                        }

                    }

                };
                setDataChecklist(errorArray);
                console.log("errorArray:", errorArray);
                console.log("data:", data);
            };

            indexedDBOpenRequest.onerror = function (error) {
                console.error("IndexedDB error:", error);
            };
            sessionStorage.removeItem('offlineErrorMapChecklist');
        }
    };

    return (
        <div>
            <Grid container spacing={1}>
                <Grid item xs={12} >
                    <EISPanel heading="Syn error in Work Order">

                        <EISTable
                            data={data}
                            headers={headers}
                            propCodes={propCodes}
                        />


                    </EISPanel>
                    <EISPanel heading="Syn error in checklist">

                        <EISTable
                            data={dataChecklist}
                            headers={headers}
                            propCodes={propCodes}
                        />
                    </EISPanel>
                </Grid>
            </Grid>
        </div>
    )

}

export default WorkorderOfflineSyn;