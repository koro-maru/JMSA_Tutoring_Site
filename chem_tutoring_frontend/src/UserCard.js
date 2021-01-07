import React from 'react'
import { Card, Button } from 'react-bootstrap';

const UserCard = (props)  => {
    return (
<Card style={{ width: '18rem' }}>
    <Card.Img variant="top" src="holder.js/100px180" />
    <Card.Body>
      <Card.Title>{props.full_name}</Card.Title>
      <Card.Text>
        Hello world
      </Card.Text>
      <Button variant="primary" href={`/user/${props.username}`}>Profile</Button>
    </Card.Body>
  </Card>)
}

export default UserCard;