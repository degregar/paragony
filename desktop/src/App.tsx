import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import './App.global.css';

const Paragony = () => {
  return (
    <div>
      <h1>Paragony</h1>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Paragony} />
      </Switch>
    </Router>
  );
}
