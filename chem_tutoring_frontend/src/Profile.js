import React, { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import { axios_instance } from './index'
import DayPicker from "react-day-picker";
//View for viewing own profile and someone else viewing profile
const Profile = (props) => {
    let { username } = useParams();
    const [user, set_user] = useState('');

    useEffect(() => {
        const config = {
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
            }
        }

        axios_instance.get(`/user/${username}`, config)
            .then((res) => {
                const parsed_dates = res.data.availability.map((date) => {
                    const milliseconds = date.$date;
                    const parsed_date = new Date(milliseconds)
                    return parsed_date;
                })
                res.data.availability = parsed_dates;
                return res.data
            }).then((res) => {
                set_user(res);
            }).then(console.log(user))
    }, [])



    //I fear my edit check may be vulnerable...what if someone uses inspect element to change the user
    return (
        <div>
            <html>
                <body>
                    <div>
                        <h1>{user.full_name}</h1>
                        <h2 className="subtitle">@{username}</h2>
                        {
                            username == props.username && (
                                <Link to={{
                                    pathname: `/user/${username}/edit`,
                                    state: {
                                        user: {
                                            ...user
                                        }
                                    }
                                }}>Edit
                                </Link>)
                        }
                        <div className="about-div">

                            <p className="bio">{user.biography}</p>
                        </div>
                        <hr />

                        <section>
                            <h3>Availability</h3>
                            <DayPicker
                                format="MM/DD/YYYY"
                                selectedDays={user.availability}
                                name="availability"
                            />
                        </section>
                    </div>
                </body>
            </html>
        </div>
    )

}

export default Profile;