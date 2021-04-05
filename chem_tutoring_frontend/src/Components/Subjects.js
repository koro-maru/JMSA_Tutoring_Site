import { Dropdown, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react"
import { subjectList } from "../utility";
import { axios_instance } from '../index'
//change to get thessse from db later

const Subjects = (props) => {
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    axios_instance.get("http://127.0.0.1:5000/subjects")
      .then((res) => {
        setSubjects(res.data);
      })
  }, [])

  const onDropdownSelect = (eventKey) => {
    if (eventKey == props.subject) {
      props.onSelect('')
    }
    else {
      props.onSelect(eventKey)
    }
  }


  //Maybe just add subjects to db?
  return (
    <div>
      { props.checkboxes ? (
        <div className="checkboxes">
         { subjects.map((element) =>  <Form.Check type="checkbox" value={element.subject} label={element.subject} name="setSubjectsFilter" onChange={props.inputChange} />)} 
        </div>
      ) : (<Dropdown onSelect={onDropdownSelect}>
        <Dropdown.Toggle variant="success" className="subject">
          <span> {props.subject ? props.subject : "Subject"}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {subjects.map(element => (<Dropdown.Item eventKey={element.subject}>{element.subject}</Dropdown.Item>),)}
        </Dropdown.Menu>
      </Dropdown>)
      }
    </div>
  )
}

export default Subjects;