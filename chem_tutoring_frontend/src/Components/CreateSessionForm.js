import React, { useEffect, useState } from 'react'
import { Form, Button, Dropdown } from 'react-bootstrap'
import DayPicker from "react-day-picker";
import TimePicker from 'react-time-picker'
import { axios_instance } from '..';
import Select from 'react-select'
import "../../node_modules/react-time-picker/dist/TimePicker.css";
import "../../node_modules/react-clock/dist/Clock.css";
const CreateSessionForm = (props) => {

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [subject, setSubject] = useState('')
  const [user_list, set_user_list] = useState([])
  const [other_user, setOtherUser] = useState({})
  const [errors, setErrors] = useState('')

  useEffect(() => {
    if (props.roles.includes('tutor')) {
      axios_instance.get('http://127.0.0.1:5000/user/students')
        .then(function (response) {
          console.log(response)
          set_user_list([...user_list, ...response.data])
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    if (props.roles.includes('student')) {
      axios_instance.get('http://127.0.0.1:5000/user/tutors')
        .then(function (response) {
          console.log(response)
          set_user_list([...user_list, ...response.data])
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const session = {
      subject: subject,
      date: formatDateTime(date, time),
      end_date: formatDateTime(date, endTime),
      other_user: other_user
    }
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    axios_instance.post('http://127.0.0.1:5000/user/sessions/new', session, config)
      .then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })


  }

  const onDropdownSelect = (eventKey) => {
    setSubject(eventKey);
  }

  const handleDayClick = (day, { selected }) => {
    const selectedDay = selected ? undefined : day;
    setDate(selectedDay)
  }

  const handleSelect = (selected) => {
    setOtherUser(selected)
  }

  const onTimeChange = (time) => {
    setTime(time)
  }

  const onEndTimeChange = (time) => {
    setEndTime(time)
  }
  const formatDateTime = (date, time) => {
    const hour = parseInt(time.substring(0, 1)) == 0 ? parseInt(time.substring(1, 2)) : parseInt(time.substring(0, 2))
    const minutes = time.substring(2)
    const amPM = hour < 12 ? 'AM' : 'PM'
    const formatted_hour = hour > 12 ? hour - 12 : hour;
    time = formatted_hour + minutes + " " + amPM
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + time;
  }



  return (
    <div className="form-comp">
      <h1>Set up a Session</h1>
      <Form onSubmit={handleSubmit}>
        <Dropdown onSelect={onDropdownSelect}>
            <Dropdown.Toggle variant="success" className="subject">
              <span> {subject ? subject : "Subject"}</span>
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

        <Form.Group controlId="session_attendee">
          <Form.Label>{props.roles.includes('tutor') ? 'Student' : 'Tutor'}</Form.Label>
          <Select
            className="select center"
            onChange={handleSelect}
            options={user_list}
            getOptionLabel={(option) => option.username}
            getOptionValue={(option) => option._id}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label classname="block-label">Date</Form.Label>
          <div>
            <DayPicker
              className="calendar"
              disabledDays={{ before: new Date() }}
              format="M/D/YYYY"
              name="date"
              id="date"
              onDayClick={handleDayClick}
              selectedDays={date}
            />
          </div>
        </Form.Group>

        <Form.Group>
          <Form.Label className="block-label">Start Time: </Form.Label>
          <TimePicker
            name="time"
            id="time"
            onChange={onTimeChange}
            value={time}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className="block-label">End Time: </Form.Label>
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

export default CreateSessionForm;