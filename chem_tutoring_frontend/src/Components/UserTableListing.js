import { useState, useEffect } from 'react'
import { axios_instance } from '../index'
const UserTableListing = (props) => {
  const [hours, setHours] = useState(0);
  //state is setting, bleeding in to other states. Check if this is api failure or this failure. console.logs.. goodnight
  const getHours = async (username) => {
    const res = await axios_instance.get(`/user/${username}/tutoring_history?hours=true`)
    return res.data;
  }

  useEffect(() => {
    if (props.username) {
      getHours(props.username)
        .then((res) => {
          setHours(res.hours)
        })
    }
    else {
      console.log("NO USER FOUND")
    }
  }, [])

  return (
 
      <tr className="userListing">
        <td>{props.full_name}</td>
        <td>{props.username}</td>
        <td>{props.email}</td>
        <td>{props.us_phone_number}</td>
        <td>{props.roles}</td>
        <td>{props.tutor_subjects && props.tutor_subjects.length !== 0 ? props.tutor_subjects.join(", ") : "N/A"}</td>
        <td>{props.tutor_subjects && props.problem_subjects.length !== 0 ? props.problem_subjects : "N/A"}</td>
        <td>{hours}</td>
      </tr>

  );
}


export default UserTableListing;