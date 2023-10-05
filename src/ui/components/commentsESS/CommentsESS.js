import React, {Component} from 'react';
import './Comments.css';

class CommentsESS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            actualEntity: {},
            src: "",
        };
    }
    refreshComponent = () => {
        this.setState({ state: this.state });
        this.init(this.props);
    };

    componentDidMount() {
        this.init(this.props);
        console.log("props -----", this.props);
    }
    init = (props) => {
        // first we check if request is from eam web, if yes we need to fetch the required parameters needed to build the page

        //below is common code for web or eam mobile
        /* let entitiesObjectDetails = queryString.parse(this.props.location.search);
        console.log("entities---entitiesObjectDetails--", entitiesObjectDetails);
        console.log("from eamweb:", "eamweb" in entitiesObjectDetails === true);
        console.log("from eamweb::", entitiesObjectDetails.eamweb == "true");
        //if request is from eam web
        if (
            "eamweb" in entitiesObjectDetails === true && entitiesObjectDetails.eamweb == "true"
        ) {
        } */
    }
    render() {

        return (

            <div >test </div>
        //    /*  {/* <Comments
        //         ref={comments => this.comments = comments}
        //         entityCode='EVNT'
        //         entityKeyCode={!layout.newEntity ? workorder.number : undefined}
        //         userCode={userData.eamAccount.userCode}
        //         handleError={handleError}
        //         allowHtml={true} /> */} */
                
               
                                  
        );

    }
}
export default CommentsESS;