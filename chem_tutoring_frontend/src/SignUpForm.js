import { React, useState } from 'react';
import { Form, Button } from 'react-bootstrap'
import DayPicker, {DateUtils} from "react-day-picker";
import {axios_instance} from '.'

const SignUpForm = () => {
  const [dates, setDates] = useState([])


  const handleSubmit = (e) => {
    //Consolidate form and only require required fields @ startup?
    e.preventDefault();
    const email = e.target.email.value;
    const full_name = e.target.full_name.value;
    const username = e.target.username.value;
    const password = e.target.password.value;
    const biography = e.target.biography.value;
    const roles = e.target.role.value;
    const us_phone_number = e.target.us_phone_number.value;

    const user = {
      email:email,
      full_name:full_name,
      username:username,
      password:password,
      biography:biography,
      roles:roles,
      availability: dates,
      us_phone_number: us_phone_number
    }

    const config = {
      headers: {
        'Content-Type': 'application/json'
    }
    }
    axios_instance.post('http://127.0.0.1:5000/user/sign_up', user, config)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
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

  
  return (
    <div>
      <h1>Sign Up</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" />
        </Form.Group>

        <Form.Group controlId="full_name">
          <Form.Label>Full Name</Form.Label>
          <Form.Control type="text" />
        </Form.Group>

        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" />
        </Form.Group>

        <Form.Group controlId="us_phone_number">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required />
        </Form.Group>

        <Form.Group controlId="biography">
          <Form.Label>Tell us about yourself!</Form.Label>
          <Form.Control as="textarea" rows={3} />
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
          disabledDays={{ before: new Date() }}
          format="MM/DD/YYYY"
          name="availability"
          onDayClick={handleDayClick}
          selectedDays={dates}
          />
          
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>);
}

export default SignUpForm;