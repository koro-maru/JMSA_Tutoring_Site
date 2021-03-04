import React, { useState, useEffect } from 'react'
import { axios_instance } from '..'
import UserCard from './UserCard'
import { Container, Row, Col } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import { Form, FormControl, Dropdown } from 'react-bootstrap'
import { NonceProvider } from 'react-select'
//Add support for som1 who is tutor + student
const Dashboard = (props) => {
  const [data, setData] = useState({
    data: [],
    filtered: [],
    displayed: []
  })

  const [filters, setFilters] = useState({
    username:'',
    fullName: '',
    subject:'',
    type:''
  })

  const perPage = 20;
  const pageCount = Math.ceil(data.data.length) / perPage;

 
  useEffect(()=> {
   const filtered =  data.data.filter((user)=>{
      const usernameCheck = user.username.toLowerCase().includes(filters.username);
      const subjectCheck = user.roles.includes("tutor") && user.tutoring_subjects ? user.tutoring_subjects.includes(filters.subject) : user.problem_subjects ? user.problem_subjects.includes(filters.subject) : false;
      const typeCheck = user.roles.includes(filters.typeCheck);
      const fullNameCheck = user.full_name.toLowerCase().includes(filters.fullName.toLowerCase());
      let allChecks = true;

      if(filters.username){
        allChecks = allChecks && usernameCheck;
      }
      if(filters.subject){
        allChecks = allChecks && subjectCheck;
      }
      if(filters.fullName){
        allChecks = allChecks && fullNameCheck;
      }
      if(filters.type){
        allChecks = allChecks && typeCheck;
      }
      return allChecks
    })

    setData({...data, filtered: filtered, displayed:filtered.slice(0,perPage)})
  }, [filters])


  useEffect(() => {
    if (props.roles.includes('tutor')) {
      axios_instance.get('http://127.0.0.1:5000/user/students')
        .then(function (response) {
          setData({ ...data, data: response.data, filtered:response.data, displayed: response.data.slice(0, perPage) })
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    if (props.roles.includes('student')) {
      axios_instance.get('http://127.0.0.1:5000/user/tutors')
        .then(function (response) {
          setData({ ...data, data: response.data, filtered:response.data, displayed: response.data.slice(0, perPage) })
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [])



  const handlePageClick = (e) => {
    let selected = e.selected;
    let offset = Math.ceil(selected * perPage);
    setData({ ...data, displayed: perPage >= data.filtered.length ? data.filtered.slice(offset, data.filtered.length) : data.filtered.slice(offset, offset + 2) })
  };


  const userDash = data.displayed.map((user) => {
    return (
        <UserCard className="user_card" key={user._id.$oid} full_name={user.full_name} username={user.username} bio={user.biography} />
    )
  })

  const setUsernameFilter = (e) => {
    setFilters({...filters, username: e.target.value})
  }
  const setNameFilter = (e) => {
    setFilters({...filters, fullName: e.target.value})
  }

  const onDropdownSelect = (eventKey) => {
    setFilters({...filters, subject: eventKey});
  }

  return (
    <div>
      <h1>Users</h1>
      <div className="user_username">
        <Form className="form-comp">
          <FormControl className="user-username" type="text" name="username" placeholder="Username" onChange={setUsernameFilter}/>

          <FormControl className="user-fullname" type="text" name="fullname" placeholder="Name" onChange={setNameFilter}/>
          {//filter by student/tutor option if you're both a student & tutor
            props.roles.includes("tutor") && props.roles.includes("student") ? (
              <Form.Group controlId="role">
                <Form.Check
                  inline
                  value="tutors"
                  name="role"
                  label="Tutor"
                  type="radio"
                  id="tutor"
                />
                <Form.Check
                  inline
                  value="students"
                  name="role"
                  label="Student"
                  type="radio"
                  id="student"
                />
              </Form.Group>) : null}
          <Dropdown onSelect={onDropdownSelect}>
            <Dropdown.Toggle variant="success" className="subject">
            <span> {filters.subject ? filters.subject : "Subject"}</span>
          </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="Math" >Math</Dropdown.Item>
              <Dropdown.Item eventKey="English">English</Dropdown.Item>
              <Dropdown.Item eventKey="Chemistry">Chemistry</Dropdown.Item>
              <Dropdown.Item eventKey="Computer Science">Computer Science</Dropdown.Item>
              <Dropdown.Item eventKey="History">History</Dropdown.Item>
              <Dropdown.Item eventKey="Physics">Physics</Dropdown.Item>
              <Dropdown.Item eventKey="Biology">Biology</Dropdown.Item>
              <Dropdown.Item eventKey="">None</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Form>
      </div>

      {userDash.length != 0 ? <div className="userdash">{userDash}</div>:<h3>No matching users found</h3>}


      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={5}
        marginPagesDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
      />

    </div >
  )
}


export default Dashboard;