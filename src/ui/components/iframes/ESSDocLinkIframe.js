import React, { Component } from 'react';
import queryString from "query-string"
import ESSDocLinkResizableIframe from "./ESSDocLinkResizableIframe";

class ESSDocLinkIframe extends Component {
    docLightStyle = {
        width: "1px",
        minWidth: "100%",
        border: "none",
        boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)"
    }

    render() {
        let src = ""
        if(this.props.location !== undefined) {
            let pathName = this.props.location.pathname;
            let url = pathName.split("\~")[1];
            src =  url
        } else {
            src = this.props.value
        }
        //const { objectType, objectID, mode, profile, collapsible } = this.props;       
        return (
            <ESSDocLinkResizableIframe
                iframeResizerOptions={{
                    scrolling: true,
                    checkOrigin: false, // CHECK: disable this option or list allowed origins
                    heightCalculationMethod: 'bodyOffset'
                }}
                src={src}
                style={this.docLightStyle}/>
        )
    }
}

ESSDocLinkIframe.defaultProps = {
    mode: 'write',
    profile: 'EAMLIGHT',
    collapsible: true,
}

export default ESSDocLinkIframe;
