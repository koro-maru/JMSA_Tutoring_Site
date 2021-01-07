import React, { useEffect } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import CreateSessionForm from "./CreateSessionForm";
import Dashboard from "./Dashboard";
import HomePage from "./Homepage";
import LoginForm from "./LoginForm";
import NavBar from "./NavBar";
import Profile from "./Profile";
import SignUpForm from "./SignUpForm";
import EditUser from './EditUser'
import jwt_decode from 'jwt-decode'
import UserSessions from "./UserSessions";
import EditSessionForm from "./EditSession";

const AppRouter = () => {
  
  let user = localStorage.getItem('token');

  if(user){
    if (jwt_decode(user).exp < Date.now() / 1000) {
      localStorage.clear();
    }
    else {
      user = jwt_decode(user)
    }
  }

 

    return (
        <BrowserRouter>
          <div>
            <NavBar username={user && user.username}/>
            <Switch>
                <Route path="/" component={HomePage} exact />
                <Route path="/sign_up" component={SignUpForm} exact/>
                <Route  path="/sign_in" component={LoginForm} exact/>
                <Route path="/dashboard" exact>
                  <Dashboard roles={user && user.rls} />
                </Route>
                <Route path="/user/create_session" exact>
                  <CreateSessionForm roles={user && user.rls} />
                </Route>
                <Route exact path="/user/sessions/:session/edit" component={EditSessionForm}/>
                <Route exact path="/user/:username/sessions" component={UserSessions}/>
                <Route exact path="/user/:username/edit" component={EditUser}/>
                <Route exact path="/user/:username">
                  <Profile username={user!=null && user.username}/>
                </Route>
                <Route component={Error} />
            </Switch>
          </div>
        </BrowserRouter>
    )
}

export default AppRouter;