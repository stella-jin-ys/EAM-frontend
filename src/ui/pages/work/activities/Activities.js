import React, {useEffect, useState} from 'react';
import WSWorkorders from "../../../../tools/WSWorkorders";
import Activity from "./Activity";
import './Activities.css';
import Button from '@material-ui/core/Button';
import AddActivityDialogContainer from "./dialogs/AddActivityDialogContainer";
import AddBookLabourDialogContainer from "./dialogs/AddBookLabourDialogContainer";

/**
 * Panel Activities and Book labor
 */
function Activities(props) {

    let [activities, setActivities] = useState([]);
    let [bookLaboursByActivity, setBookLaboursByActivity] = useState({});
    let [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    let [isBookLaborModalOpen, setIsBookLaborModalOpen] = useState(false);
    let [loading, setLoading] = useState(false);
   
    useEffect(() => {
        readActivities(props.workorder);
        readBookLabours(props.workorder);
    }, [props.workorder])

    /**
     * Load all activities
     * @param workOrderNumber
     */
    let readActivities = workOrderNumber => {
        setLoading(true)
        WSWorkorders.getWorkOrderActivities(workOrderNumber)
            .then(result => {
                setActivities(result.body.data);
                setLoading(false);
            });
    }

    /**
     * Load all book labours
     * @param workOrderNumber
     */
    let readBookLabours = workOrderNumber => {
        WSWorkorders.getBookingLabours(workOrderNumber)
            .then(result => {

                // Creation of a "map" to store book labours by activity
                let bookLaboursByActivity = {};
                result.body.data.forEach(bookLabour => {
                    if (bookLaboursByActivity[bookLabour.activityCode] === undefined) {
                        bookLaboursByActivity[bookLabour.activityCode] = [];
                    }
                    bookLaboursByActivity[bookLabour.activityCode].push(bookLabour);
                });

                setBookLaboursByActivity(bookLaboursByActivity);
            });
    }

    if (loading || !props.workorder) {
        return (
            <div></div>
        );
    }
    console.log("props for activities:", props);
    //ESS
    let activityModelOpen = () => {
        if (!navigator.onLine) {
            console.log("Offline Mode in activity");
            props.showError('Activity can not be saved in offline mode.');
            console.log("Offline Mode in activity 1111");
            
        } else {
            setIsActivityModalOpen(true)
            console.log("Offline Mode in activity 1111 else");
        }
    }

    return (
        <div id="activities">
            {activities.map((activity, index) => {
                return <Activity
                    key={activity.activityCode}
                    activity={activity}
                    bookLabours={bookLaboursByActivity[activity.activityCode]}
                    layout={props.layout}/>
            })}

            <div id="actions">
                <Button onClick={() => activityModelOpen()} color="primary">
                    Add activity
                </Button>

                <Button onClick={() => setIsBookLaborModalOpen(true)} color="primary">
                    Book Labor
                </Button>
            </div>
           
            <AddActivityDialogContainer
                open={isActivityModalOpen}
                workorderNumber={props.workorder}
                onChange={() => readActivities(props.workorder)}
                onClose={() => setIsActivityModalOpen(false)}
                postAddActivityHandler={props.postAddActivityHandler}/>
            
            <AddBookLabourDialogContainer
                open={isBookLaborModalOpen}
                activities={activities}
                workorderNumber={props.workorder}
                department={props.department}
                departmentDesc={props.departmentDesc}
                defaultEmployee={props.defaultEmployee}
                defaultEmployeeDesc={props.defaultEmployeeDesc}
                updateCount={props.updateCount}
                updateEntityProperty={props.updateEntityProperty}
                startDate={props.startDate}
                onChange={() => readBookLabours(props.workorder)}
                onClose={() => setIsBookLaborModalOpen(false)}/>
        </div>
    )
}

export default React.memo(Activities);