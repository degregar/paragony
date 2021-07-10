import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import icon from '../assets/icon.svg';
import './App.global.css';

const Hello = () => {
  return (
    <div>
      <h1>Paragony</h1>

      <Link to="/paragony">PARAGONY</Link>
    </div>
  );
};

const Paragony = () => {
  return (
    <div>
      <h1>Paragony</h1>
      <Link to="/">BACK</Link>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/paragony" component={Paragony} />
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
