import React from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import './TaskPlan.css'
import sanitizeHtml from 'sanitize-html';

/**
 * Display detail of a Task Plan
 */


function TaskPlan(props) {

  let { taskPlan } = props;
  // parse the html and convert it to a react component
  const clean = sanitizeHtml(taskPlan.text, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
  });
  //console.log("clean: " , clean);
  const html = { __html: clean };
  console.log("html: ", html);
  return (


    <div className="taskPlan" >
      <div className="content">

        <h3>TaskPlan: {taskPlan.entityKeyCode}</h3>

        <Grid container spacing={1} className="taskPlanDetails">

          <Grid item xs={6} md={6} lg={2}>text</Grid>
          <Grid item xs={6} md={6} lg={4}>
            <div className="taskplan__description">
              <div dangerouslySetInnerHTML={html} />
            </div>
          </Grid>

       {/*    <Grid item xs={6} md={6} lg={2}>Created</Grid>
          <Grid item xs={6} md={6} lg={4}>{taskPlan.creationDate}</Grid> */}

          <Grid item xs={6} md={6} lg={2}>User</Grid>
          <Grid item xs={6} md={6} lg={4}>{taskPlan.creationUserDesc + "(" + taskPlan.creationUserCode + ")"}</Grid>

        </Grid>

      </div>

      <Divider className="divider" />

    </div>
  );

  /* 
        return (
          <div className="taskplan">
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <div className="taskplan__title">
                  <h2>{taskPlan.title}</h2>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="taskplan__description">
                  <div dangerouslySetInnerHTML={html} />
                </div>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
             
            </Grid>
            <Divider className="divider"/>
          </div>
        ); */
}


export default React.memo(TaskPlan);

