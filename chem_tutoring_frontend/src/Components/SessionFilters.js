import { useState, useEffect } from 'react';
import { Form, FormControl, Dropdown, Col, Row, Pagination } from 'react-bootstrap'

const SessionFilters = () => {
    const [studentFilter, setStudentFilter] = useState('');
    const [tutorFilter, setTutorFilter] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [timeFilter, setTimeFilter] = useState('');
    const [sessionSubjectFilter, setSessionSubjectFilter] = useState('');

    const inputChange = (e) => {
        hookUpdateFunctions[e.target.name](e.target.value)
    }

    const hookUpdateFunctions = {
        "setStudentFilter": setStudentFilter,
        "setTutorFilter": setTutorFilter,
        "setStartDateFilter": setStartDateFilter,
        "setSessionSubjectFilter": setSessionSubjectFilter,
    }

    useEffect(() => {
        const filtered = props.sessions.sessionList.filter((session) => {
            let allChecks = true;
            allChecks = tutorFilter ? (tutor.includes(session.tutor.username) ? allChecks : false) : allChecks;
            allChecks = studentFilter ? (student.includes(session.student.username) ? allChecks : false) : allChecks;
            allChecks = startDateFilter ? (startDate == session.date.$date ? allChecks : false) : allChecks;
            allChecks = sessionSubjectFilter ? (sessionSubject == session.subject ? allChecks : false) : allChecks;
            return allChecks;
        })

    }, [studentFilter, tutorFilter, startDateFilter, sessionSubjectFilter])


    return (
        <Form>
            <Form.Group>
                <Form.Label>Tutor Filter</Form.Label>
                <FormControl className="search-input" type="text" name="setTutorFilter" onChange={inputChange} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Student Filter</Form.Label>
                <FormControl className="search-input" type="text" name="setDateFilter" onChange={inputChange} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Subject Filter</Form.Label>
                <FormControl className="search-input" type="text" name="setSubjectFilter" onChange={inputChange} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Date Filter</Form.Label>
                <FormControl className="search-input" type="text" name="setSubjectFilter" onChange={inputChange} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Time Filter</Form.Label>
                <FormControl className="search-input" type="text" name="setTimeFilter" onChange={inputChange} />
            </Form.Group>
        </Form>
    )

}