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
            userSelected: "",
            data: "",
            empList: {},
            codeName: {},
        }

    }
 
    componentWillReceiveProps(nextProps) {
        //Display bar
        console.log("componentWillReceiveProps called");
        const displayBar = nextProps.newCommentText !== '' && !!this.props.entityKeyCode;
        this.updateState(displayBar, this.initNewComment(nextProps), initialContainerStyle);
        // while updating the properties of this compoenent we see if any user has been added, if not we
        // we set state to blank
        console.log("userSelected:",this.state.userSelected);
        if (!nextProps.newCommentText.includes("[")) {
            this.setState({
                userSelected: ''
            })
        }
        
    }

    initNewComment = (props) => {
        return {
            entityCode: this.props.entityCode,
            entityKeyCode: this.props.entityKeyCode,
            text: props.newCommentText,
            user: props.newCommentUser
        };
    };
    updateEmployee = (key, value) => {
        
        let employeeName = "";

        // Get display name of the person
        this.state.empList.map(emp => {
            if (emp.code === value) {
                employeeName = emp.desc;
            }
        })
        let previousData = this.state.data;
        let previousUsers = this.state.userSelected;
        console.log("update employee called previousUsers:",previousUsers);
        //for first time, these will not be set in state
        if (previousUsers === undefined)
            previousUsers = "";

        //remove @char
        previousData = previousData.substring(0, previousData.indexOf("@"));

        var setValue = null;
        let selectedUsers = null;
        key = key.replaceAll(" ", "");
        if (employeeName != '') {
            setValue = previousData + "[" + employeeName + "]";
            selectedUsers = previousUsers + "::" + value;
        } else {
            setValue = previousData;
            selectedUsers = previousUsers;
        }
        
        let comment = this.state.comment;
        //text
        comment.text=setValue;
        const displayBar = value !== '' && !!this.props.entityKeyCode;
        comment.user=selectedUsers;
        this.updateState(displayBar, comment);
        this.setState({
            data: setValue,
            userSelected: selectedUsers,
            hasSuggestions: false,
        })
        
        this.props.updateNewCommentText(comment.text);
        this.props.updateNewCommentUser(comment.user);
    };

    inputTextArea = (event) => {

        let element = event.target;
        let value = element.value;
        //show all employee suggestions
        if (value.indexOf("@") != -1) {
            let textPart = value.substring(0, value.indexOf("@"));

            //let textPart = value.substring(1, value.indexOf("@"));
            let personSubString = value.substring(value.indexOf("@"), value.length);
            let personSearch = personSubString;
            //to check if there are no spaces in the entered word
            if (personSubString.indexOf(" ") != -1) {
                personSearch = personSubString.substring(1, personSubString.indexOf(" "));
            } else {
                personSearch = personSubString.substring(1, personSubString.length);
            }

            if (personSearch != "" && value.length >= 1) {
                WS.autocompleteEmployee(personSearch).then(response => {
                    this.setState({
                        empList: response.body.data,
                        data: textPart + personSubString,
                        hasSuggestions: true,
                    })
                }).catch(error => {
                    console.log("error value: ", error);
                });
            } else {
                this.setState({
                    data: value,
                })
            }
        }

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
        console.log("pros:",this.props);
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
                            //value={this.state.data}
                            value={this.props.newCommentText}
                            userSelected={this.props.newCommentUser}
                            onInput={this.inputTextArea}
                            onFocus={this.inputTextArea}
                            //onChange={this.inputTextArea}
                            //disabled={disabled}
                        />
                        {this.state.hasSuggestions &&
                            <div className="commentInfoDropDown">
                                <EAMSelect
                                    elementInfo={layout.BOO.fields['employee']}
                                    //valueDesc="desc"
                                    valueKey="code"
                                    value={this.state.empList.desc || ''}
                                    values={this.state.empList}
                                    updateProperty={this.updateEmployee}
                                    //onChange= {this.updateEmployee}
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

