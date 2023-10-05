import React, { Component, useState, createRef, useCallback } from 'react';
import './Comments.css';
import CommentBar from "./CommentBar";
import CommentAvatar from "./CommentAvatar"
import TextareaAutosize from 'react-autosize-textarea';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from "@material-ui/core/styles/index";
import WS from "../../../tools/WS";
import EAMSelect from 'eam-components/dist/ui/components/muiinputs/EAMSelect'
import { Wordpress } from 'mdi-material-ui';

const initialContainerStyle = { opacity: 1.0, pointerEvents: 'all' };

const styles = {
    root: {
        alignItems: "start",
        paddingTop: 6,
        paddingBottom: 6
    }
};

class CommentNew extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayBar: false,
            loading: false,
            hasSuggestions: false,
            comment: this.initNewComment(this.props),
            containerStyle: initialContainerStyle,
            formValues: {},
            dataValues: {},
            data: "",
            empList: {},
        }
       
    }

    componentWillReceiveProps(nextProps) {
        //Display bar
        const displayBar = nextProps.newCommentText !== '' && !!this.props.entityKeyCode;
        this.updateState(displayBar, this.initNewComment(nextProps), initialContainerStyle);
    }

    initNewComment = (props) => {
        return {
            entityCode: this.props.entityCode,
            entityKeyCode: this.props.entityKeyCode,
            text: props.newCommentText,
        };
    };

    updateEmployee = (key, value) => {
        let setValue = "[@" + value + "]";
        this.setState({ data : setValue})
    };

    handleOnChange = e => {
        const { value } = e.target;
       //const  check  = "^@[A-Za-z0-9]*$";
        const check = "^[A-Za-z0-9]*$";
        //show all employee suggestions
        if (value.startsWith("@") && value.length >= 2) {
               let s = value.substring(1);
               WS.autocompleteEmployee(s).then(response => {
                
                this.setState({
                    empList: response.body.data,
                    data: s,
                    hasSuggestions: true,
                })
              
            }).catch(error => {
                console.log("error value: ", error);
            });
           
        //} else if (value.includes("@") && value.length > 1) {
        } else if(value.match(check) && value.length >= 1) {
            WS.autocompleteEmployee(value).then(response => {

               this.setState({
                   empList: response.body.data,
                   data: value,
                   hasSuggestions: true,
               })

            }).catch(error => {
               console.log("error value: ", error);
           }); 
        }
        //display no users if they do not use the @ symbol
        else {
            this.setState({
                data: value,
                empList: [],
                hasSuggestions: false
            });
        }


    };

    inputTextArea = (event) => {
        let element = event.target;
        /*let word = document.getElementById("textId").value;

        let matches = (word.match(/@\w+/g));
        let str = document.getElementById("textId").innerHTML; 
        let ch ;

        if(str.startsWith("[") && str.endsWith(["]"])) {
            ch = str;
            let res = str.replace(ch, "<span style='color:red'>ch</span>");
            document.getElementById("textId").innerHTML = res;
        } */

        const displayBar = element.value !== '' && !!this.props.entityKeyCode;
        //The text

        let comment = this.state.comment;
        comment.text = element.value;
           
        this.updateState(displayBar, comment);
        //Value
        this.props.updateNewCommentText(comment.text);
    };

    showUpdating = () => {
        this.setState(() => ({
            containerStyle: { opacity: 0.4, pointerEvents: 'none' }
        }));
    };

    updateState = (displayBar, comment, containerStyle) => {
        this.setState(() => ({
            displayBar,
            comment,
            containerStyle
        }));
    };

    onKeyDownHandler = (event) => {
         if (event.keyCode === 13 || event.keyCode === 121) {
               event.stopPropagation();
        } 
    }

    updateFormValues = (key, value) => {
        this.setState(prevFormValues => ({
            ...prevFormValues,
            [key]: value
        }))
    };

    render() {
        const { disabled, layout } = this.props;
        const placeholder = disabled ? 'Commenting is disabled' : 'Enter new com';
        return (
            <ListItem classes={{ root: this.props.classes.root }}>
                <CommentAvatar name={this.props.userCode} />

                <div className="commentContainer" style={this.state.containerStyle}>

                    <div className="triangle" />
                    <div className="innerTriangle" />

                    {this.state.displayBar &&
                        <div className="commentInfoContainer">

                            <div style={{ height: 60 }}></div>

                            <CommentBar saveCommentHandler={this.props.createCommentHandler}
                                displayBar={this.state.displayBar}
                                comment={this.state.comment}
                                displayClosingCheck={this.props.entityCode === 'EVNT'}
                                displayPrivateCheck={this.props.displayPrivateCheck}
                                showUpdatingHandler={this.showUpdating} />
                        </div>}
                    <div className="commentTextContainer" onKeyDown={this.onKeyDownHandler(this)}>
                       
                        <TextareaAutosize id="textId" className="commentText"
                            placeholder={placeholder}
                            value={this.state.data}
                           // value={this.props.newCommentText}
                            onInput={this.inputTextArea}
                            onFocus={this.inputTextArea}
                            onChange={this.handleOnChange}
                            disabled={disabled}
                        />
                        {this.state.hasSuggestions &&
                            <div className="commentInfoDropDown">
                                <EAMSelect
                                    elementInfo={layout.BOO.fields['employee']}
                                    valueDesc="desc"
                                    value={this.state.empList.desc || ''}
                                    values={this.state.empList}
                                    updateProperty={this.updateEmployee}
                                    children={this.props.children}
                                />
                            </div>}
                    </div>
                </div>

            </ListItem>
        );
    }
}

export default withStyles(styles)(CommentNew)

