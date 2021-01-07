import React, {useEffect, useState} from 'react';
import { Form, Button } from 'react-bootstrap'
import {useParams } from "react-router-dom";
import DayPicker, {DateUtils} from "react-day-picker";
import { axios_instance } from '.';
import Select from 'react-select'
import "../node_modules/react-time-picker/dist/TimePicker.css";
import "../node_modules/react-clock/dist/Clock.css";
import TimePicker from 'react-time-picker'


const EditSessionForm = (props) => {

  if(props.location.state){
    let savedState =  JSON.stringify(props.location.state.session);
    localStorage.setItem('session', savedState);
  }  

  const [time, setTime] = useState('')
  const [session, setSession] = useState(
  JSON.parse(localStorage.getItem('session'), function (key, value) {
    if (key === 'date') {
        return new Date(value.$date)
    } else {
    return value;
    }
}) || {})

  const [errors, setErrors] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = e.target.subject.value;
    const edited_session = {
      ...session,
      subject: subject,
      date: formatDateTime(session.date, time),
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

      axios_instance.post(`/user/sessions/${session._id.$oid}/edit`, edited_session, config )
      .then((res)=>{
        localStorage.setItem('session', JSON.stringify(res))
      })
      .catch((err)=>{
        console.log(err)
      })
    }


  const handleDayClick = (day, { selected }) => {
    const selectedDay = selected ? undefined : day;
    const updated_session = {...session, date: selectedDay}
    setSession(updated_session)
  }

  const onTimeChange = (time) => {
    setTime(time)
  }

  const formatDateTime = (date, time) => {
    const hour = parseInt(time.substring(0, 1)) == 0 ? parseInt(time.substring(1, 2)) : parseInt(time.substring(0, 2))
    const minutes = time.substring(2)
    const amPM = hour < 12 ? 'AM' : 'PM'
    const formatted_hour = hour > 12 ? hour - 12 : hour;
    time = formatted_hour + minutes + " " + amPM
    console.log(date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + time)
    return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + time;
  }



  return (
    <div>
      <h1>Edit Session</h1>
      <Form onSubmit={handleSubmit}>

        <Form.Group controlId="subject">
          <Form.Label>Subject</Form.Label>
          <Form.Control type="text" value={session.subject}/>
        </Form.Group>

        <Form.Group controlId="subject">
          <Form.Label>Tutor</Form.Label>
          <Form.Control type="text" value={session.tutor.username}/>
        </Form.Group>

        <Form.Group controlId="subject">
          <Form.Label>Student</Form.Label>
          <Form.Control type="text" value={session.student.username}/>
        </Form.Group>

        <Form.Group>
          <Form.Label>Date</Form.Label>
          <DayPicker
            // disabledDays={{ before: new Date() }}
            format="M/D/YYYY"
            name="date"
            id="date"
            onDayClick={handleDayClick}
            selectedDays={new Date(session.date)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Time</Form.Label>
          <TimePicker
            name="time"
            id="time"
            onChange={onTimeChange}
            value={time}
          />
        </Form.Group>

        <Button variant="primary" type="submit">Submit</Button>
      </Form>
    </div>);
}


export default EditSessionForm;