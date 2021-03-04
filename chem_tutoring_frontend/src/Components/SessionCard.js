import React from 'react'
import { Card, Button } from 'react-bootstrap';

const SessionCard = (props)  => {
    return (
<Card>
    <Card.Img variant="top" src="holder.js/100px180" />
    <Card.Body>
      <Card.Title>{props.other_user.username}</Card.Title>
      <Card.Text>
        Hello world
      </Card.Text>
      <Button variant="primary" href={`/user/${props.username}`}>Profile</Button>
    </Card.Body>
  </Card>)
}

export default SessionCard;