import React, {useState, useEffect} from 'react'
import {axios_instance} from '.'
import UserCard from './UserCard'

//Add support for som1 who is tutor + student
const Dashboard = (props) => {
    const [userList, setUserList] = useState([])

    useEffect(()=>{
     if (props.roles.includes('tutor')) {
      axios_instance.get('http://127.0.0.1:5000/user/students')
        .then(function (response) {
          console.log(response)
          setUserList([...userList, ...response.data])
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    if (props.roles.includes('student')) {
      axios_instance.get('http://127.0.0.1:5000/user/tutors')
        .then(function (response) {
          console.log(response)
          setUserList([...userList, ...response.data])
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    }, [])

const userDash = userList.map((user)=>{
   return <UserCard key={user._id.$oid} full_name={user.full_name} username={user.username} />
})
    return (
        <div>
           <h1>Users</h1>
           {userDash}
        </div>
    )
}

export default Dashboard;