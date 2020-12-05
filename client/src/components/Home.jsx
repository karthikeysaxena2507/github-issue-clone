/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import edit from "../images/edit.png";
import trash from "../images/trash.png";


function Home() {

    var [issues,setIssues] = useState([]);

    var [open,setOpen] = useState(false);
    var [close,setClose] = useState(false);

    useEffect(function() {
        axios.get("/issues") 
            .then(function(response) {
                if(open && !close) {
                    setIssues(response.data.reverse().filter(function(issue) {
                        return (issue.status === "open")
                    }));
                }
                else if(!open && close) {
                    setIssues(response.data.reverse().filter(function(issue) {
                        return (issue.status === "closed")
                    }));
                }
                else {
                    setIssues(response.data.reverse());
                }
            });
    });

    function changeopen() {
        setOpen(!open);
    }

    function changeclose() {
        setClose(!close);
    }


    function createIssue(props, index) {

        function update() {
            window.location = "/update/" + props._id;
        }       

        function remove() {
            axios.delete("/issues/delete/" + props._id);
        }

        function changeStatus() {
            axios.post("/issues/status/" + props._id, props)
                .then(function(response) {
                    console.log(response.data);
                });
        }

        const link = "/list/"+props._id;
        
        return(<div key={index} className="container margin post"> 
        <div className="post-title"> <h2> {props.title} </h2> </div>
        <div className="post-content"> {props.content.substring(0,100)} ...<a href={link}> Read More </a> </div>
        <div className="post-info">
            <div className="status1">
                <span className="one expand" onClick={changeStatus} > Close </span> 
                <span onClick={changeStatus} className="expand"> Open </span> 
            </div>
            <img src={edit} onClick={update} className="one expand"/>
            <img src={trash} onClick={remove} className="one expand"/>
            <div className="status2">
                <p> {props.status} </p>
            </div>
        </div>
        </div>);
    }
        

    return(<div>
    <div>
        <h1> Issues Page </h1>
    </div>
    <div >
    <Link to="/add">
        <button className="btn btn-dark expand margin" > Create </button> 
    </Link>
    <div className="margin">
        <input type="checkbox" onClick={changeopen}/> <span className="one"> Show Open Issues </span>
        <input type="checkbox" onClick={changeclose}/> <span className="one"> Show Closed Issues </span>
    </div>
    </div>
    <div className="container">
        {issues.map(createIssue)}
    </div>
    </div>)
};

export default Home;