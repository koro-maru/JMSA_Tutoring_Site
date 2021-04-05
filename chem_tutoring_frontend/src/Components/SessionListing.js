import React, {useState} from 'react';
import { Link } from 'react-router-dom'
import { Card, Button } from 'react-bootstrap';
import { parseDate, parseTime, verifyJWT } from '../utility'
import {axios_instance} from '../index'
const SessionListing = (props) => {
  const mode = props.mode;
  const jwt = verifyJWT();
  const [confirmed, setConfirmed] = useState(false);

  const confirmSession = () => {
    let confirmation = {};
    if(jwt.username==props.session.tutor.username){
      confirmation.tutor_confirmed = true;
    }
    else if(jwt.username==props.session.student.username){
      confirmation.student_confirmed = true;
    }
    axios_instance.post(`/user/sessions/${props.session._id.$oid}/edit`, confirmation)
    .then(()=>{
     setConfirmed(true);
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  return (
    props.mode === "card" ?
      (<div className="center card-session-container">
        <Card className="card wide-card session">
          <Card.Body>
            <Card.Title className="card-title">Session with {props.session.student.username}</Card.Title>
            <Card.Text>
              <span id="tutor">Tutor: @{props.session.tutor.username}</span>
              <span id="subject">{props.session.subject}</span>
              <p id="date">{
                parseDate(props.session.date.$date)
              } to <span id="end_time">{parseTime(props.session.end_time.$date)}</span></p>
              <p>Confirmation Status: {(props.session.tutor_confirmed && props.session.student_confirmed || confirmed) ? "Confirmed" : "Not Confirmed"} </p>

              {
                (jwt.username==props.session.tutor.username && !props.session.tutor_confirmed|| jwt.username==props.session.student.username && !props.session.student_confirmed) && <a className="delete-link" onClick={confirmSession}>Confirm</a>
              }
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
      </div>) : (
        <tr>
          <td>{props.session.student.username}</td>
          <td>{props.session.tutor.username}</td>
          <td>{props.session.subject}</td>
          <td>{parseDate(props.session.date.$date)}</td>
          <td>{parseTime(props.session.end_time.$date)}</td>
        </tr>)
  )

}

export default SessionListing;