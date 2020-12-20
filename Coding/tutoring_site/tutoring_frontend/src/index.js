import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import HomePage from './Homepage';
import reportWebVitals from './reportWebVitals';
import './main.scss'
import './App.css'
import AppRouter from './Router'
ReactDOM.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://it.ly/CRA-vitals
reportWebVitals();
