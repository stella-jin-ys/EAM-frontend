import WS from './WS';

/**
 * Handles all calls to REST Api
 */
class WSComments {

    
    //COMMENTS - these are copied from ui components package and shall be deleted after legacy comments are removed
    
    // readComments(entityCode, entityKeyCode, config = {}) {
    //     entityKeyCode = encodeURIComponent(entityKeyCode);
    //     return WS._get(`/comments?entityCode=${entityCode}&entityKeyCode=${entityKeyCode}`, config);
    // }

    // createComment(comment, config = {}) {
    //     return WS._post('/comments/', comment, config);
    // }

    // updateComment(comment, config = {}) {
    //     return WS._put('/comments/', comment, config);
    // }
    // ESS - User Defined Screen 
    readComments(entityCode, entityKeyCode, config = {}) {
        console.log("read service comment:",entityCode,entityKeyCode);
        entityKeyCode = encodeURIComponent(entityKeyCode);
        return WS._get(`/commentsess?entityCode=${entityCode}&entityKeyCode=${entityKeyCode}`, config);
    }

    createComment(comment, config = {}) {
        console.log("web service comment:",comment);
        return WS._post('/commentsess/', comment, config);
    }

    updateComment(comment, config = {}) {
        
        return WS._put('/commentsess/', comment, config);
    }
     readTaskInstructions(entityCode, entityKeyCode, config = {}) {
        entityKeyCode = encodeURIComponent(entityKeyCode);
        return WS._get(`/comments?entityCode=${entityCode}&entityKeyCode=${entityKeyCode}`, config);
    }
}

export default new WSComments();