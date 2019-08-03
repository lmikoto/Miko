import React, { Component } from 'react';
import Floder from '../components/floder';
import './App.scss';
import Editor from '../components/editor';

class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="floder-container">
          <div className="b" />
          <Floder />
        </div>
        <div className="editor-container">
          <Editor />
        </div>
      </div>
    );
  }
}

export default App;
