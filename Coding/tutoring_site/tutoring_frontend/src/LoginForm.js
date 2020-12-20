
import {Form, Button} from 'react-bootstrap'
import axios from 'axios'
const LoginForm = () => {
   

    const handleSubmit = (e) => {
      e.preventDefault()
      const username = e.target.username.value;
      const password = e.target.password.value;

      const user = {
        username,
        password
      }

      const config = {
        dataType: 'json',
        xhrFields: {
           withCredentials: true
        },
        crossDomain: true,
        headers: {
          'Content-Type': 'application/json',
      }
      }

      axios.post('http://127.0.0.1:5000/user/sign_in', user, config)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    return (
        <div>
            <h1>Log in </h1>
    <Form onSubmit={handleSubmit}>

        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Username" />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>

        <Button variant="primary" type="submit">
    Submit
  </Button>
      </Form>
      </div>);
}

export default LoginForm;