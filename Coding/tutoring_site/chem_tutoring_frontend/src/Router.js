import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import HomePage from "./Homepage";
import LoginForm from "./LoginForm";
import NavBar from "./NavBar";
import SignUpForm from "./SignUpForm";


const AppRouter = () => {
    return (
        <BrowserRouter>
          <div>
            <NavBar />
            <Switch>
                <Route path="/" component={HomePage} exact />
                <Route path="/sign_up" component={SignUpForm} />
                <Route path="/login" component={LoginForm} />
                <Route path="/dashboard" component={""} />
                <Route path="/profile" component={""} />
                <Route component={Error} />
            </Switch>
          </div>
        </BrowserRouter>
    )
}

export default AppRouter;