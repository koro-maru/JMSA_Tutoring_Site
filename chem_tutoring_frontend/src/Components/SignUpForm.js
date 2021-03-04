import { React, useState } from 'react';
import { Form, Button } from 'react-bootstrap'
import DayPicker, { DateUtils } from "react-day-picker";
import { axios_instance } from '..'

const SignUpForm = () => {
  const [dates, setDates] = useState([]);
  const [errors, setErrors] = useState([]);
  const [role, setRole] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [bestSubjects, setBestSubjects] = useState([]);
  const [problemSubjects, setProblemSubjects] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const full_name = e.target.full_name.value;
    const username = e.target.username.value;
    const password = e.target.password.value;
    const biography = e.target.biography ? e.target.biography.value : '';
    const us_phone_number = e.target.us_phone_number.value;
    const meeting_link = e.target.meeting_link ? e.target.meeting_link.value : ' ';
    const profile_picture = e.target.profile_picture.files[0];
    const user = {
      email: email,
      full_name: full_name,
      username: username,
      password: password,
      biography: biography,
      roles: role,
      profile_picture: profile_picture,
      availability: dates.map((date) => {
        return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
      }),
      us_phone_number: us_phone_number
    }

    if (role.includes("tutor")) {
      user.meeting_link = meeting_link;
      user.tutor_subjects = bestSubjects;
    }

    if (role.includes("student")) {
      user.problem_subjects = problemSubjects;
    }

    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }

    var bodyFormData = new FormData();
    bodyFormData.append('username', username)
    setSubmitted(true);
    axios_instance.post('http://127.0.0.1:5000/user/sign_up', user,config)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const updateRole = (e) => {
    setRole(e.target.value)
  }

  const handleDayClick = (day, { selected }) => {
    const arr = [...dates];
    if (selected) {
      const selectedIndex = arr.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      );
      arr.splice(selectedIndex, 1);
      setDates(arr);
    }
    else {
      setDates([...dates, day]);
    }
  }

  const conditionalSubjectType = () => {
    let returnedTypes = [];
    const tutor = (
      <div>
        <Form.Group controlId="conditional">
          <Form.Group controlId="meeting_link">
            <Form.Label>*Meeting Link</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
          <Form.Group controlId="subjects">
            <Form.Label>Best Subjects</Form.Label>
            {subjects(false)}
          </Form.Group>
        </Form.Group>
      </div>
    )

    const student =
      (<Form.Group controlId="problem_subjects">
        <Form.Label>Problem Subjects</Form.Label>
        {subjects(true)}
      </Form.Group>)

    if (role.includes("tutor")) {
      returnedTypes.push(tutor);
    }

    if (role.includes("student")) {
      returnedTypes.push(student);
    }

    return returnedTypes;

  }

  const conditionalCheck = (problem) => {
    let onCheckChange;
    if (!problem) {
      onCheckChange = (e) => {
        if (bestSubjects.includes(e.target.value)) {
          setBestSubjects(bestSubjects.filter(element => element != e.target.value));
          console.log(bestSubjects);
        }
        else {
          setBestSubjects([...bestSubjects, e.target.value])
          console.log(bestSubjects);
        }

      }
    }
    else {
      onCheckChange = (e) => {
        if (problemSubjects.includes(e.target.value)) {
          setProblemSubjects(problemSubjects.filter(element => element != e.target.value));
          console.log(problemSubjects);
        }
        else {
          setProblemSubjects([...problemSubjects, e.target.value]);
          console.log(problemSubjects);
        }
      }
    }

    return onCheckChange;
  }

  const subjects = (problem) => {
    const subjects = ['Math', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Computer Science']
    let id = problem ? "problem" : "best"
    return (
      <div>
        <Form.Group controlId={`math ${id}`}>
          <Form.Check type="checkbox" value="Math" label="Math" onChange={conditionalCheck(problem)} />
        </Form.Group>
        <Form.Group controlId={`physics ${id}`}>
          <Form.Check type="checkbox" value="Physics" label="Physics" onChange={conditionalCheck(problem)} />
        </Form.Group>
        <Form.Group controlId={`chemistry ${id}`}>
          <Form.Check type="checkbox" value="Chemistry" label="Chemistry" onChange={conditionalCheck(problem)} />
        </Form.Group>
        <Form.Group controlId={`biology ${id}`}>
          <Form.Check type="checkbox" value="Biology" label="Biology" onChange={conditionalCheck(problem)} />
        </Form.Group>
        <Form.Group controlId={`english ${id}`}>
          <Form.Check type="checkbox" value="English" label="English" onChange={conditionalCheck(problem)} />
        </Form.Group>
        <Form.Group controlId={`history ${id}`}>
          <Form.Check type="checkbox" value="History" label="History" onChange={conditionalCheck(problem)} />
        </Form.Group>
        <Form.Group controlId={`compsci ${id}`}>
          <Form.Check type="checkbox" value="Computer Science" label="Computer Science" onChange={conditionalCheck(problem)} />
        </Form.Group>
      </div>
    )
  }

  return (
    <div className="form-comp">
      <h1>Sign Up</h1>

      {errors ? <span className="form-error">{errors}</span> : null}
      {submitted && errors.length === 0 ? <span className="form-text">Please check your email to finish activating your account.</span> : null}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control name="email" type="email" />
        </Form.Group>

        <Form.Group controlId="full_name">
          <Form.Label>Full Name</Form.Label>
          <Form.Control name="full_name" type="text" />
        </Form.Group>

        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control name="username" type="text" />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control name="password" type="password" />
        </Form.Group>

        <Form.Group controlId="us_phone_number">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control name="us_phone_number" type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required />
        </Form.Group>

        <Form.Group controlId="biography">
          <Form.Label>Tell us about yourself!</Form.Label>
          <Form.Control name="biography" as="textarea" rows={3} />
        </Form.Group>

        {conditionalSubjectType()}
        <Form.Group controlId="role">
          <Form.Check
            inline
            value="tutor"
            name="role"
            checked={role === "tutor"}
            label="Tutor"
            type="radio"
            id="tutor"
            onClick={updateRole}
          />
          <Form.Check
            inline
            value="student"
            name="role"
            checked={role === "student"}
            label="Student"
            type="radio"
            id="student"
            onClick={updateRole}
          />
          <Form.Check
            inline
            value="student,tutor"
            name="role"
            checked={role === "student,tutor"}
            label="Both"
            type="radio"
            id="both"
            onClick={updateRole}
          />
        </Form.Group>

        <Form.Label>Profile Picture</Form.Label>
        <input type="file" name="profile_picture" />

        <Form.Group controlId="availability">
          <Form.Label>*Availability</Form.Label>

          <DayPicker
            className="calendar"
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