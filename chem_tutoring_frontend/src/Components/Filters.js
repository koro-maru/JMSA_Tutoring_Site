import { useState, useEffect } from 'react';
import { Form, FormControl, Dropdown, Col, Row, Pagination } from 'react-bootstrap'
const Filters = (props) => {
    const [nameFilter, setNameFilter] = useState('');
    const [emailFilter, setEmailFilter] = useState('');
    const [usernameFilter, setUsernameFilter] = useState('');
    const [phoneFilter, setPhoneFilter] = useState('');
    const [role, setRole] = useState('');
    const [subjectsFilter, setSubjectsFilter] = useState([]);

    const [studentFilter, setStudent] = useState('');
    const [tutorFilter, setTutor] = useState('');
    const [startDateFilter, setStartDate] = useState('');
    const [sessionSubjectFilter, setSessionSubject] = useState('');

//Horrid practices, will clean up hopefulyl
    const inputChange = (e) => {
        hookUpdateFunctions[e.target.name](e.target.value)
    }


    useEffect(() => {
        const filtered = props.users.userList.filter((user) => {
            let allChecks = true;
            allChecks = nameFilter ? (user.full_name.toLowerCase().includes(nameFilter.toLowerCase()) ? allChecks : false) : allChecks;
            allChecks = emailFilter ? (user.email.toLowerCase().includes(emailFilter.toLowerCase()) ? allChecks : false) : allChecks;
            allChecks = phoneFilter ? (user.us_phone_number.includes(phoneFilter) ? allChecks : false) : allChecks;
            allChecks = subjectsFilter.length !== 0 ? ((user.tutor_subjects &&
                subjectsFilter.every((element) => user.tutor_subjects.includes(element)))
                || (user.problem_subjects && subjectsFilter.every((element) => user.problem_subjects.includes(element))) ? allChecks : false) : allChecks;
            allChecks = usernameFilter ? (user.username.toLowerCase().includes(usernameFilter.toLowerCase()) ? allChecks : false) : allChecks;
            allChecks = role ? (user.roles.includes(role) ? allChecks : false) : allChecks;
            return allChecks;
        })


        props.setUsers({ ...props.users, filtered: filtered, displayed: (props.offset + props.perPage >= filtered.length ? filtered.slice(props.offset, filtered.length) : filtered.slice(props.offset, props.offset + props.perPage)) })

    }, [nameFilter, emailFilter, usernameFilter, phoneFilter, role, subjectsFilter])

 
    const setCheckFilter = (value) => {
        if (subjectsFilter.includes(value)) {
            setSubjectsFilter(subjectsFilter.filter(element => element != value));
        }
        else {
            setSubjectsFilter([...subjectsFilter, value])
        }
    }

    const setRoleFilter = (e) => {
        if (e.target.value === role) {
            e.target.checked = false;
            setRole("");
        }
        else {
            setRole(e.target.value);
        }
    }

    const hookUpdateFunctions = {
        "setNameFilter": setNameFilter,
        "setEmailFilter": setEmailFilter,
        "setUsernameFilter": setUsernameFilter,
        "setPhoneFilter": setPhoneFilter,
        "setRoleFilter": setRoleFilter,
        "setSubjectsFilter": setCheckFilter,
        "setModeFilter": props.setMode
    }

    const subjectsFilterRender = (problem) => {
        const subjectsFilter = ['Math', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Computer Science']
        let id = problem ? "problem" : "best"
        return (
            <div className="checkboxes">
                <Form.Group controlId={`math ${id}`}>
                    <Form.Check type="checkbox" value="Math" label="Math" name="setSubjectsFilter" onChange={inputChange} />
                </Form.Group>
                <Form.Group controlId={`physics ${id}`}>
                    <Form.Check type="checkbox" value="Physics" label="Physics" name="setSubjectsFilter" onChange={inputChange} />
                </Form.Group>
                <Form.Group controlId={`chemistry ${id}`}>
                    <Form.Check type="checkbox" value="Chemistry" label="Chemistry" name="setSubjectsFilter" onChange={inputChange} />
                </Form.Group>
                <Form.Group controlId={`biology ${id}`}>
                    <Form.Check type="checkbox" value="Biology" label="Biology" name="setSubjectsFilter" onChange={inputChange} />
                </Form.Group>
                <Form.Group controlId={`english ${id}`}>
                    <Form.Check type="checkbox" value="English" label="English" name="setSubjectsFilter" onChange={inputChange} />
                </Form.Group>
                <Form.Group controlId={`history ${id}`}>
                    <Form.Check type="checkbox" value="History" label="History" name="setSubjectsFilter" onChange={inputChange} />
                </Form.Group>
                <Form.Group controlId={`compsci ${id}`}>
                    <Form.Check type="checkbox" value="Computer Science" name="setSubjectsFilter" label="Computer Science" onChange={inputChange} />
                </Form.Group>
            </div>
        )
    }


    return (
        <div className="filtering">
            <Form>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <FormControl className="search-input" type="text" name="setNameFilter" onChange={inputChange} />
                            <Form.Label>Email</Form.Label>
                            <FormControl className="search-input" type="text" name="setEmailFilter" onChange={inputChange} />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Label>Username</Form.Label>
                        <FormControl className="search-input" type="text" name="setUsernameFilter" onChange={inputChange} />
                        <Form.Label>Phone # (Stored in format xxx-xxx-xxxx)</Form.Label>
                        <FormControl className="search-input" type="text" name="setPhoneFilter" onChange={inputChange} />
                    </Col>
                </Row>
                <Row>
                    {subjectsFilterRender()}
                </Row>
                <Row>
                    <Form.Group className="radios" controlId="role">
                        <Form.Check
                            inline
                            value="tutor"
                            name="setRoleFilter"
                            label="Tutor"
                            type="radio"
                            id="tutor"
                            onClick={setRoleFilter}
                        />
                        <Form.Check
                            inline
                            value="student"
                            name="setRoleFilter"
                            label="Student"
                            type="radio"
                            id="student"
                            onClick={setRoleFilter}
                        />
                        <Form.Check
                            inline
                            value="student,tutor"
                            name="setRoleFilter"
                            label="Both"
                            type="radio"
                            id="both"
                            onClick={setRoleFilter}
                        />
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group className="radios">
                        <Form.Check
                            inline
                            value="user"
                            name="setModeFilter"
                            label="User View"
                            type="radio"
                            id="mode"
                            checked={(props.mode === "user")}
                            onClick={inputChange}
                        />
                        <Form.Check
                            inline
                            value="session"
                            name="setModeFilter"
                            label="Session View"
                            type="radio"
                            id="mode"
                            onClick={inputChange}
                        />
                    </Form.Group>
                </Row>
            </Form>
        </div>)
}


export default Filters;