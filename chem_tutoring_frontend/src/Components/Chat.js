import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { axios_instance } from '..';
import Select from 'react-select';
import jwt_decode from 'jwt-decode'

const Chat = (props) => {
  const { username } = useParams();
  const [messages, set_messages] = useState([]);
  const [user_list, set_user_list] = useState([]);
  const [recipient, set_recipient] = useState(undefined);
  const config = {
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    headers: {
      'Content-Type': 'application/json',
    }
  }

  useEffect(() => {
    if (props.roles.includes('tutor')) {
      axios_instance.get('http://127.0.0.1:5000/user/students')
        .then(function (response) {
          set_user_list([...user_list, ...response.data])
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    if (props.roles.includes('student')) {
      axios_instance.get('http://127.0.0.1:5000/user/tutors')
        .then(function (response) {
          set_user_list([...user_list, ...response.data])
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [])

  useEffect(() => {
    if (recipient && recipient.username != undefined) {

      axios_instance.get(`http://127.0.0.1:5000/user/${username}/chat/${recipient._id.$oid}`, config)
        .then((res) => {
          if (res.data) {
            set_messages(res.data);
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [recipient])


  const handleSubmit = (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const message = {
      recipient: recipient._id.$oid,
      body: e.target.message.value,
      sender: jwt_decode(localStorage.getItem("token")).id
    }

    console.log(jwt_decode(localStorage.getItem("token")).id)
    axios_instance.post(`http://127.0.0.1:5000/user/${username}/chat/${recipient._id.$oid}`, message, config)
      .then((res) => {
        set_messages([...messages, res.data]);
      })
      .catch((err) => {
        console.log(err)
      })

  }

  const handleSelect = (selected) => {
    set_recipient(selected)
  }


  const message_list = messages.map((message) => {

    let message_class = recipient._id.$oid == message.sender.$oid ? "recieved" : "sent";

    const date = new Date(message.timestamp.$date);

    const timestamp = date.getHours() + ":" + date.getMinutes();

    return (
      <div className={`message ${message_class}`}>
        <span className="message_text">{message.body}</span>
        <span className="message_time">{timestamp}UTC</span>

      </div>)
  })


  return (
    <Form onSubmit={handleSubmit} className="message_form">
      {recipient ? <div>
        <h2 class="username">{recipient.username}</h2>
        <div className="message_list">{message_list.length !== 0 ? message_list : <span class="flavor-text">Start a conversation</span>}</div>
      </div>
       : <div> <h2>Chat</h2><span class="flavor-text">Select someone to chat with.</span></div>}

      <div className ="message_form_input">
        <div>
        <Select
          menuPortalTarget={document.querySelector('body')}
          maxMenuHeight={220}
          classNamePrefix="react-select"
          className="select center"
          onChange={handleSelect}
          options={user_list}
          getOptionLabel={(option) => option.username}
          getOptionValue={(option) => option._id}
        />
        </div> 
        {recipient && (
          <div>
            <Form.Group controlId="message">
              <Form.Control type="text" placeholder="Message" />
            </Form.Group>
            <Button type="submit">Send</Button>
          </div>)}
      </div>
    </Form>
  )
}

export default Chat;