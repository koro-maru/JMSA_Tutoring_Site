import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import {useParams } from "react-router-dom";
import DayPicker, {DateUtils} from "react-day-picker";
import { axios_instance } from '.';


const EditUser = (props) => {
let { username } = useParams();

const [dates, setDates] = useState([])
if(props.location.state){
  let savedState =  JSON.stringify(props.location.state);
  localStorage.setItem('user', savedState);
}  

const [user, set_user] = useState(
    JSON.parse(localStorage.getItem('user'), function (key, value) {
        if (key === 'availability') {
            return value.map((date)=>{
                return new Date(date)
            })
        } else {
        return value;
        }
    }).user || {});

// useEffect(()=>{
//     if(props.location.state){
//       let savedState =  JSON.stringify(props.location.state);
//       localStorage.setItem('user', savedState);
//     }  
// },[])

const handleChange =  (e) => {
    const updated_user =  {
        ...user,
        [e.target.id]: e.target.value
    }
    set_user(updated_user)
}

const handleDayClick = (day, {selected})  => {
    const arr = [...dates]
    if(selected){
      const selectedIndex = arr.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      );
      arr.splice(selectedIndex, 1)
      setDates(arr)
    }
    else{
      setDates([...dates, day])
    }
  }

  const parse_dates = (date_list) =>{
    console.log(date_list)
    return date_list.map((date)=>{
      return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear()
    })
  }
const handleSubmit = (e) => {
    e.preventDefault();
    const parsed_availability = parse_dates(user.availability);
    const edited_user = {
      email:user.email,
      full_name:user.full_name,
      username: user.username,
      password:user.password,
      biography:user.biography,
      roles:user.roles,
      availability: parsed_availability,
      us_phone_number: user.us_phone_number
    }
    const config = {
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
        }
    }
    axios_instance.post(`http://127.0.0.1:5000/user/${username}/edit`, edited_user, config)
    .then(function (res) {
      localStorage.setItem('user', JSON.stringify(res));
    })
    .catch(function (error) {
      console.log(error);
    });
  }

return (
    <div>
      <h1>Edit</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" value={user.email || ' '} onChange={handleChange}/>
        </Form.Group>

        <Form.Group controlId="full_name">
          <Form.Label>Full Name</Form.Label>
          <Form.Control type="text" value={user.full_name || ' '} onChange={handleChange}/>
        </Form.Group>

        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" value={user.username || ' '} onChange={handleChange}/>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={user.username || ' '} onChange={handleChange}/>
        </Form.Group>

        <Form.Group controlId="us_phone_number">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required value={user.us_phone_number || ' '} onChange={handleChange}/>
        </Form.Group>

        <Form.Group controlId="biography">
          <Form.Label>Tell us about yourself!</Form.Label>
          <Form.Control as="textarea" rows={3} value={user.biography || ' '} onChange={handleChange}/>
        </Form.Group>

        <Form.Group controlId="role">
          <Form.Check
            inline
            value="tutor"
            name="role"
            label="Tutor"
            type="radio"
            id="tutor"
          />
          <Form.Check
            inline
            value="student"
            name="role"
            label="Student"
            type="radio"
            id="student"
          />
        </Form.Group>

        <Form.Group controlId="availability">
          <Form.Label>Availability</Form.Label>
          <DayPicker
          
          format="MM/DD/YYYY"
          name="availability"
          onDayClick={handleDayClick}
          selectedDays={user.availability}
          />
          
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>);
}

export default EditUser;

