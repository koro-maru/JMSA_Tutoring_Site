import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { axios_instance } from '..';
import Select from 'react-select';
import jwt_decode from 'jwt-decode'
import ReactLoading from 'react-loading';
import ReactPaginate from 'react-paginate';
import {parseDate} from '../utility'
const Chat = (props) => {
  const { username } = useParams();
  const [messages, set_messages] = useState({
    displayed: [],
    messages: []
  });
  const [user_list, set_user_list] = useState([]);
  const [recipient, set_recipient] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const perPage = 10;
  let pageCount = Math.ceil(messages.messages.length) / perPage;


  useEffect(()=>{
    console.log(messages.messages, messages.messages.slice(offset, offset + perPage))
   set_messages({
     ...messages,
     displayed: (offset + perPage >= messages.messages.length ? messages.messages.slice(offset, messages.messages.length) : messages.messages.slice(offset, offset + perPage))
   })
  }, [offset])

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
    //Two ifs do not work? Must call axios twice in one if or else one is not considered? 
    if (props.roles.includes('student') && props.roles.includes('tutor')) {
      axios_instance.get('http://127.0.0.1:5000/user')
        .then(function (response) {
          return response.data.filter(user => user.username != username)
        })
        .then((res) => {
          set_user_list([...user_list, ...res])
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    else if (props.roles.includes('tutor')) {
      axios_instance.get('http://127.0.0.1:5000/user/students')
        .then(function (response) {
          return response.data.filter(user => user.username != username)
        })
        .then((res) => {
          set_user_list([...user_list, ...res])
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    else if (props.roles.includes('student')) {
      axios_instance.get('http://127.0.0.1:5000/user/tutors')
        .then(function (response) {
          return response.data.filter(user => user.username != username)
        })
        .then((res) => {
          set_user_list([...user_list, ...res])
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [])

  useEffect(() => {
    if (recipient && recipient.username != undefined) {
      new Promise((resolve, reject) => {
        resolve(setLoading(true))
        setOffset(0);
      })
        .then
        (() => axios_instance.get(`http://127.0.0.1:5000/user/${username}/chat/${recipient._id.$oid}`, config))
        .then((res) => {
          if (res.data) {
            set_messages({displayed: (offset + perPage >= res.data.length ? res.data.slice(offset, res.data.length) : res.data.slice(offset, offset + perPage)), messages: [...res.data]});
          }
        })
        .then(() => {
          setLoading(false);
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

    axios_instance.post(`http://127.0.0.1:5000/user/${username}/chat/${recipient._id.$oid}`, message, config)
      .then((res) => {
        const newArr = [...messages.messages, res.data]
        set_messages({
          displayed: (offset + perPage >= newArr.length ? newArr.slice(offset, newArr.length) : newArr.slice(offset, offset + perPage)),
          messages: newArr});
      })
      .catch((err) => {
        console.log(err)
      })

  }

  const handleSelect = (selected) => {
    set_recipient(selected)
    set_messages({
      displayed: [],
      messages: []
    })
  }

  const handlePageClick = (e) => {
    let selected = e.selected;
    let offset = Math.ceil(selected * perPage);
    setOffset(offset);
  };

  const message_list = messages.displayed.map((message) => {

    let message_class = recipient._id.$oid == message.sender.$oid ? "recieved" : "sent";

    const date = new Date(message.timestamp.$date);

    const timestamp = parseDate(date)

    return (
      <div className={`message ${message_class}`}>
        <span className="message_text">{message.body}</span>
        <span className="message_time">{timestamp}</span>

      </div>)
  })


  return (
    <Form onSubmit={handleSubmit} className="message_form">
      {recipient ? <div>
        <h2 class="username">{recipient.username}</h2>
        {loading && <ReactLoading type={"spin"} color={"white"} height={'10%'} width={'10%'} className="loading_spinner" />}
        <div >{message_list.length !== 0 ?
          <div className="message_list">
            {message_list}
            < ReactPaginate
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
          </div> :
          <span class="flavor-text">Start a conversation</span>}</div>
      </div>
        : <div> <h2>Chat</h2><span class="flavor-text">Select someone to chat with.</span></div>}

      <div className="message_form_input">
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