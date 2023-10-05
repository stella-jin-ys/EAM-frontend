import {connect} from 'react-redux'
import ChesslightIframe from './ChesslightIframe'

function mapStateToProps(state) {
    return {
        
        //edmsdoclightURL: 'http://localhost:3001/chessmobile'
        edmsdoclightURL: process.env.REACT_APP_PUBLIC_CHESS_LIGHT_URL
    }
}

const ChesslightIframeContainer = connect(mapStateToProps)(ChesslightIframe)

export default ChesslightIframeContainer