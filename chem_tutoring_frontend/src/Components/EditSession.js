import React, { useEffect, useState } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap'
import { useParams } from "react-router-dom";
import DayPicker, { DateUtils } from "react-day-picker";
import { axios_instance } from '..';
import Select from 'react-select'
import "../../node_modules/react-time-picker/dist/TimePicker.css";
import "../../node_modules/react-clock/dist/Clock.css";
import TimePicker from 'react-time-picker'


const EditSessionForm = (props) => {

  if (props.location.state) {
    let savedState = JSON.stringify(props.location.state.session);
    localStorage.setItem('session', savedState);
  }

  const [endTime, setEndTime] = useState('')
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

  const handleErrors = () => {
    if (!time || !endTime || time > endTime) {
      setErrors('Invalid time');
    }
    else {
      setErrors('')
    }
    return errors;
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    handleErrors();
    if(!errors){
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

      axios_instance.post(`/user/sessions/${session._id.$oid}/edit`, edited_session, config)
        .then((res) => {
          localStorage.setItem('session', JSON.stringify(res))
        })
        .catch((err) => {
          console.log(err)
        })
      }
  }


  const handleDayClick = (day, { selected }) => {
    const selectedDay = selected ? undefined : day;
    const updated_session = { ...session, date: selectedDay }
    setSession(updated_session);
  }

  const onTimeChange = (time) => {
    setTime(time);
  }

  const onEndTimeChange = (time) => {
    setEndTime(time);
  }
  const formatDateTime = (date, time) => {
    const hour = parseInt(time.substring(0, 1)) == 0 ? parseInt(time.substring(1, 2)) : parseInt(time.substring(0, 2))
    const minutes = time.substring(2)
    const amPM = hour < 12 ? 'AM' : 'PM'
    const formatted_hour = hour > 12 ? hour - 12 : hour;
    time = formatted_hour + minutes + " " + amPM
    console.log(date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + time)
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + time;
  }

  const onDropdownSelect = (eventKey) => {
    setSession({ ...session, subject: eventKey });
  }


  const handleChange = (e) => {
    const updated_session = {
      ...session,
      [e.target.id]: e.target.value
    }
    setSession(updated_session)
  }

  return (
    <div className="form-comp">
      <h1>Edit Session</h1>
      <span className="errors">{errors}</span>
      <Form onSubmit={handleSubmit}>

        <Dropdown onSelect={onDropdownSelect}>
          <Dropdown.Toggle variant="success" id="subject">
            Subjects
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="Math" >Math</Dropdown.Item>
            <Dropdown.Item eventKey="English">English</Dropdown.Item>
            <Dropdown.Item eventKey="Chemistry">Chemistry</Dropdown.Item>
            <Dropdown.Item eventKey="Computer Science">Computer Science</Dropdown.Item>
            <Dropdown.Item eventKey="History">History</Dropdown.Item>
            <Dropdown.Item eventKey="Physics">Physics</Dropdown.Item>
            <Dropdown.Item eventKey="Biology">Biology</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Form.Group controlId="tutor">
          <Form.Label>Tutor</Form.Label>
          <Form.Control type="text" value={session.tutor.username} />
        </Form.Group>

        <Form.Group controlId="student">
          <Form.Label>Student</Form.Label>
          <Form.Control type="text" value={session.student.username} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Date</Form.Label>
          <DayPicker
            className="calendar"
            // disabledDays={{ before: new Date() }}
            format="M/D/YYYY"
            name="date"
            id="date"
            onDayClick={handleDayClick}
            selectedDays={new Date(session.date)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className="block-label">Start Time</Form.Label>
          <TimePicker
            name="time"
            id="time"
            onChange={onTimeChange}
            value={time}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className="block-label">End Time</Form.Label>
          <TimePicker
            name="end_time"
            id="end_time"
            onChange={onEndTimeChange}
            value={endTime}
          />
        </Form.Group>

        <Button variant="primary" type="submit">Submit</Button>
      </Form>
    </div>);
}


export default EditSessionForm;