import React from 'react'
import { Card, Button } from 'react-bootstrap';

const UserCard = (props)  => {
    return (
<Card className="card user_card wide_card" >
    <Card.Img variant="top" src="holder.js/100px180" />
    <Card.Body>
      <Card.Title>{props.full_name}</Card.Title>
      <Card.Text>
        {props.bio.length >=20 ? <span className="card-body-text">{props.bio.substring(20)}...</span>: <span className="card-body-text">{props.bio}</span>}
      </Card.Text>
      <Button variant="primary" href={`/user/${props.username}`}>Profile</Button>
    </Card.Body>
  </Card>)
}

export default UserCard;