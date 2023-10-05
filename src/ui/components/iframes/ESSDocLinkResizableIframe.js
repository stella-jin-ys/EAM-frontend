import React, { Component } from 'react';
import { iframeResizer } from 'iframe-resizer';

class ESSDocLinkResizableIframe extends Component {
    componentWillUnmount() {
        const mountedIframe = this.refs.frame.iFrameResizer
        if(!mountedIframe) return;
        mountedIframe.removeListeners();
    }

    resize = () => {
        const frame = this.refs.frame;
        const { iframeResizerOptions } = this.props;
        if (!frame) return;
        iframeResizer(iframeResizerOptions, frame);
    }

    render() {
        const { src, id, className, style, title } = this.props;
        return (
        <iframe
            ref="frame"
            title={title}
            src={src}
            id={id}
            className={className}
            style={style}
            onLoad={this.resize}
            width="100%"
            height="100%"
            scrolling="auto"
            overflow="auto"
        />
        );
    }
}

ESSDocLinkResizableIframe.defaultProps = {
    iframeResizerOptions: {}
}

export default ESSDocLinkResizableIframe;