import React from 'react';
import { Link } from 'react-router-dom'
import { Card, Button } from 'react-bootstrap';
import { parseDate, parseTime } from '../utility'
const SessionListing = (props) => {
  const mode = props.mode;

  console.log(props)
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