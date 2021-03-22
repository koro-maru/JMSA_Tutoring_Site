import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";
import CreateSessionForm from "./CreateSessionForm";
import Dashboard from "./Dashboard";
import HomePage from "./Homepage";
import LoginForm from "./LoginForm";
import NavBar from "./NavBar";
import Profile from "./Profile";
import SignUpForm from "./SignUpForm";
import EditUser from './EditUser'
import jwt from 'jsonwebtoken';
import EditSessionForm from "./EditSession";
import Chat from "./Chat"
import EmailRegistration from "./EmailRegistration";
import PasswordReset from "./PasswordReset";
import AdminPortal from "./AdminPortal";
import Errors from "./Errors"

const AppRouter = () => {
  let user = localStorage.getItem('token');
  let decoded;
  if(user){
    try{
      decoded = jwt.verify(user, '/NJIBYUGHBYUHIKNBJBYBTGYIUJNBGFB/')
    }
    catch(e){
      console.log(e);
    }
    console.log(decoded)
  }

    return (
        <BrowserRouter>
          <div>
            <NavBar username={decoded && decoded.username}/>
            <Switch>
                <Route path="/" component={HomePage} exact />
                <Route path="/finalize_registration" component={EmailRegistration} exact />
                <Route exact path="/reset_password" component={PasswordReset} />
                <Route path="/sign_up" component={SignUpForm} exact/>
                <Route  path="/sign_in" component={LoginForm} exact/>
                <Route path="/dashboard" exact>
                 {decoded && decoded.rls ? <Dashboard roles={decoded && decoded.rls} username={decoded && decoded.username}/> : <Errors error={401}/>}
                </Route>
                <Route path="/user/create_session" exact>
                {decoded && decoded.rls ? <CreateSessionForm roles={decoded && decoded.rls} username={decoded && decoded.username}/> :  <Errors error={401} />}
                </Route>
                <Route exact path="/user/sessions/:session/edit" component={EditSessionForm}/>
                <Route exact path="/user/:username" render={({match})=>{
                  return (
                    <div>
                    {decoded && decoded.rls ? <Profile username={decoded.username}/>:  <Errors error={401} />}
                    </div>
                  )
                }}/>
                <Route exact path="/user/:username/edit" render={({match})=>{
                  return (
                    <div>
                    {decoded && decoded.rls && match.params.username==decoded.username ?  <EditUser username={decoded.username}/> :  <Errors error={401} />}
                    </div>
                  )
                }}/>
                <Route exact path="/user/:username/chat" render={({match})=>{
                  return (
                    <div>
                    {decoded && decoded.rls && match.params.username==decoded.username ?  <Chat roles={decoded && decoded.rls}/> :  <Errors error={401} />}
                    </div>
                  )
                }}/>
                <Route exact path="/admin">
                  <AdminPortal />
                </Route>
                <Route>
                <Errors error={404}/>
                </Route>
            </Switch>
          </div>
        </BrowserRouter>
    )
}

export default AppRouter;