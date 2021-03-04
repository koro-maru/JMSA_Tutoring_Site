import React from 'react';
import {Link} from 'react-router-dom'
import { Card, Button } from 'react-bootstrap';
const SessionListing = (props) => {   

  const parseDate = (dateInput) => {
    const date = new Date(dateInput);
    return  date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear();
   }
   
  return (
<div className="center card-session-container">
<Card className="card wide-card session">
    <Card.Body>
      <Card.Title className="card-title">Session with {props.session.student.username}</Card.Title>
      <Card.Text>
      <span id="tutor">Tutor: @{props.session.tutor.username}</span> 
       <span id="subject">{props.session.subject}</span>
       <span id="date">{
       parseDate(props.session.date.$date)
       }</span>
      </Card.Text>
      <Link to={{
                       pathname: `/user/sessions/${props.session._id.$oid}/edit`,
                       state: {
                           session: props.session
                       }
                    }}>Edit
        </Link>
    </Card.Body>
  </Card>
    </div>
)}

export default SessionListing;