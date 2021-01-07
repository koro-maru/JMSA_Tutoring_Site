import React from 'react';
import {Link} from 'react-router-dom'
const SessionListing = (props) => {   console.log(props.session);return (
 
    <div background-color="white">
        <h1>Tutor: {props.session.tutor.username}</h1> 
        <h1>Student: {props.session.student.username}</h1>
        <br />
        <span>{props.session.subject}</span> <br />
        <span>DATE: {props.session.date.$date}</span>

        <Link to={{
                       pathname: `/user/sessions/${props.session._id.$oid}/edit`,
                       state: {
                           session: props.session
                       }
                    }}>Edit
        </Link>
    </div>
)}

export default SessionListing;