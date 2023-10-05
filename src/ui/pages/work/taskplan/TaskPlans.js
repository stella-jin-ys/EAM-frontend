import React, { useEffect, useState } from 'react';
import WSWorkorders from "../../../../tools/WSWorkorders";
import WSTaskPlans from "../../../../tools/WSComments";
import TaskPlan from "./TaskPlan";
import BlockUi from 'react-block-ui'
import './TaskPlans.css';
import EAMSelect from "eam-components/dist/ui/components/muiinputs/EAMSelect";

/**
 * Panel Activities and Book labor
 */
function TaskPlans(props) {

    let [activities, setActivities] = useState([]);
    let [formValues, setFormValues] = useState({});
    let [isTaskPlanOpen, setIsTaskPlanOpen] = useState(false);
    let [loading, setLoading] = useState(false);
    let [taskPlans, setTaskPlans] = useState([]);

    useEffect(() => {
        readActivities(props.workorder);
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
    * Load all taskplanInstructions
    * @params entityCode, entityKeyCode 
    */
    let readTaskPlanInstructions = ((entityCode, entityKeyCode) => {
        setLoading(true)
        WSTaskPlans.readTaskInstructions(entityCode, entityKeyCode)
            .then(result => {
                setTaskPlans(result.body.data);
                setLoading(false);
            });
    });

    let updateFormValues = (key, value) => {

        const dataObject = activities.filter(activity => {
            return (activity.activityCode === value);
        })

        console.log("dataObject: ", dataObject);
        if (dataObject.length > 0) {
            console.log(dataObject[0].taskCode);
            let entityKeyCode = dataObject[0].taskCode + "#" + dataObject[0].taskRev;

            console.log("entityKeyCode: ", entityKeyCode);

            WSTaskPlans.readTaskInstructions("TASK", dataObject[0].taskCode + "#" + dataObject[0].taskRev)
                .then(result => {
                    setTaskPlans(result.body.data);
                    setLoading(false);
                    setIsTaskPlanOpen(true);
                });
        }

        console.log("readTaskPlanInstructions: ", taskPlans.length);

        console.log("readTaskPlan: ", taskPlans);

        //readTaskPlanInstructions("TASK", dataObject[0].taskCode+"#"+ dataObject[0].taskRev);


        setFormValues(prevFormValues => ({
            ...prevFormValues,
            //[key]: value
        }))
    };

    let check = (event) => {

        console.log("event: ", event.target);

    }

    if (loading || !props.workorder) {
        return (
            <div></div>
        );
    }

    return (
        <div id="taskPlans">
            <BlockUi tag="div" blocking={loading}>
                <EAMSelect
                    elementInfo={props.layout.booactivity}
                    valueKey="activityCode"
                    value={formValues['activityCode'] || ''}
                    values={activities.map(activity => {
                        return {
                            code: activity.activityCode,
                            desc: activity.activityNote
                            //desc: activity.tradeCode
                        }
                    })}
                    handleChange={check}
                    updateProperty={updateFormValues}

                />

                {taskPlans && taskPlans.length > 0 ?
                    <div id="activities">
                        {taskPlans.map((taskPlan, index) => {
                            return <TaskPlan
                                key={taskPlan.taskCode}
                                taskPlan={taskPlan}
                                //bookLabours={bookLaboursByActivity[activity.activityCode]}
                                layout={props.layout} />
                        })}
                    </div> :
                    <div></div>
                }

            </BlockUi>

        </div>

    )
}

export default React.memo(TaskPlans);