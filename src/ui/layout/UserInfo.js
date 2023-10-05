import React, { Component } from 'react';
import { Account, Logout } from "mdi-material-ui"
import { IconButton } from "@material-ui/core";
import Wifi from "@material-ui/icons/Wifi";
import WifiOff from "@material-ui/icons/WifiOff";



window.addEventListener("offline", (event) => {
    const statusDisplay = document.getElementById("status");
    statusDisplay.textContent = "OFFLINE MODE";
    statusDisplay.style.color = "RED";
});

window.addEventListener("online", (event) => {
    const statusDisplay = document.getElementById("status");
    statusDisplay.textContent = "";
});

export default class UserInfo extends Component {

    userInfoStyle = {
        color: "rgba(255, 255, 255, 0.8)",
        flexGrow: 1,
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: 'flex-end'
    }

    accountIcon = {
        fontSize: 20,
        margin: 5
    }

    logoutIcon = {
        color: "rgba(255, 255, 255, 0.8)",
        paddingRight: 9,
        fontSize: 18,
        lineHeight: '22px'
    }

    separatorStyle = {
        borderLeft: "1px solid rgba(255, 255, 255, 0.8)",
        width: 1,
        height: 22,
        marginLeft: 14
    }

    iconActiveStyle = {
        color: "rgb(0, 128, 0,0.0)",
        flexGrow: 1,
        height: 48,
        display: "flex",
        alignItems: "right",
        justifyContent: 'flex-end'
    }
    iconInActiveStyle = {
        color: "rgba(255, 0, 0,0.8)",
        flexGrow: 1,
        height: 48,
        display: "flex",
        alignItems: "right",
        justifyContent: 'flex-end'
    }

    deleteFromIndexdbChecklist(index) {
        var indexedDBOpenRequest = indexedDB.open("checklist", 1);
        indexedDBOpenRequest.onsuccess = function () {
            let db = this.result;
            let transaction = db.transaction("checklist_changes", "readwrite");
            let storeObj = transaction.objectStore("checklist_changes");
            storeObj.delete(index);
        };
    }
    logoutHandler() {
        console.log("called logout");

        //ESS we clear the indexdb data
        var logout = true;
        var indexedDBOpenCountWO = window.indexedDB.open('workorder', 1)

        indexedDBOpenCountWO.onsuccess = function () {
            let db = this.result;
            console.log("db.objectStoreNames.length:", db.objectStoreNames.length);
            if (db.objectStoreNames.length > 0) {
                let transaction = db.transaction("workorder_requests", "readonly");
                let store = transaction.objectStore("workorder_requests");
                var count = store.count();
                console.log("count ", count);
                count.onsuccess = function () {
                    console.log("count initial", count.result);
                    var totalCount = count.result;
                    //compare with error
                    if (count.result > 0) {
                        this.props.showNotification("There are objects to syn, wait till all the syned")
                        logout = false;
                    }
                }
            }
        }

        var indexedDBOpenRequestWO = window.indexedDB.open('workorder', 1)
        indexedDBOpenRequestWO.onsuccess = function () {
            let db = this.result;
            console.log("db:", db);
            try {
                let transaction = db.transaction("workorder_requests", "readwrite");
                let storeObj = transaction.objectStore("workorder_requests");
                console.log("size:", storeObj, storeObj.length, storeObj.getAll.length, storeObj.count);
                //storeObj.clear();
                console.log("cleared");
            } catch (e) {
                console.log("Store workorder_requests doesn't exists:", e);
            }
        };

        //checklist store
        var indexedDBOpenRequestCL = window.indexedDB.open("checklist", 1);

        indexedDBOpenRequestCL.onsuccess = function () {
            let db = this.result;
            try {
                let transaction = db.transaction("checklist_changes", "readwrite");
                let storeObj = transaction.objectStore("checklist_changes");
                console.log("size 1:", storeObj.getAllKeys.length);
                //storeObj.clear();
            } catch (e) {
                console.log("Store checklist_changes doesn't exists:", e);
            }

        };
        //Below is CERN code
        if (logout) {
            if (this.props.scannedUser) {
                this.props.updateScannedUser(null);
                return;
            }
            if (process.env.REACT_APP_LOGIN_METHOD === 'STD') {
                this.props.updateInforContext(null);
                this.props.updateApplication({ userData: null })
                sessionStorage.removeItem('inforContext');
            }
            if (process.env.REACT_APP_LOGIN_METHOD === 'CERNSSO') {
                window.location.href = "https://espace.cern.ch/authentication/_layouts/15/SignOut.aspx";
            }
        }
    }

    render() {
        const { scannedUser } = this.props;

        const usernameDisplay = this.props.userData.eamAccount.userCode + (scannedUser ? ` (${scannedUser.userCode})` : '');
        // if(navigator.onLine) {
        //     this.props.showNotification("You are offline") 
        // }
        return (
            <div style={this.userInfoStyle}>

                <span id="status" style={{ fontWeight: 'bold' }}></span>
                <Account style={this.accountIcon} />
                {usernameDisplay}
                <span style={this.separatorStyle} />
                <IconButton onClick={this.logoutHandler.bind(this)} style={this.logoutIcon}>
                    <Logout style={{ fontSize: 20 }} />
                </IconButton>
            </div>
        )
    }
}