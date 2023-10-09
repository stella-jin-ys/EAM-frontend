import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    height: 600,
  },
  main: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "50px",
  },
});

export default function App() {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            component="img"
            alt="warehouse"
            height="350"
            image="https://images.unsplash.com/photo-1565891741441-64926e441838?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHdhcmVob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Warehouse management
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              The ESS Neutron Chopper Group has successfully produced the first
              fast triplet chopper, for the instrument MAGIC.
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <a href="/warehouse">
            <Button size="small" color="primary">
              Learn More
            </Button>
          </a>
        </CardActions>
      </Card>
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            component="img"
            alt="kiosk"
            height="350"
            image="https://images.unsplash.com/photo-1620809512199-f3b59ef956f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8a2lvc2t8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Store kiosk
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              The ESS Neutron Chopper Group has successfully produced the first
              fast triplet chopper, for the instrument MAGIC.
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <a href="/kiosk">
            <Button size="small" color="primary">
              Learn More
            </Button>
          </a>
        </CardActions>
      </Card>
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            component="img"
            alt="rapid request"
            height="350"
            image="https://images.unsplash.com/photo-1503551723145-6c040742065b-v2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTh8fHNpdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Rapid request
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              The ESS Neutron Chopper Group has successfully produced the first
              fast triplet chopper, for the instrument MAGIC.
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <a href="/rapidrequest">
            <Button size="small" color="primary">
              Learn More
            </Button>
          </a>
        </CardActions>
      </Card>
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            component="img"
            alt="accelerator review"
            height="350"
            image="https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmV2aWV3fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Accelerator Review
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              The ESS Neutron Chopper Group has successfully produced the first
              fast triplet chopper, for the instrument MAGIC.
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <a href="/acceleratorreview">
            <Button size="small" color="primary">
              Learn More
            </Button>
          </a>
        </CardActions>
      </Card>
    </div>
  );
}
