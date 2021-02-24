import React from 'react';

// Components.
import Title from './components/title/title.component';
import LiveData from './components/live-data/live-data.component';
import Copyright from './components/copyright/copyright.component';

// Styles.
import './main.css';


class App extends React.Component {
  
  constructor() {
    super();
    this.versionNumber = "4.0.5";
  }

  render() {
    return (

      <React.Fragment>

        <Title />
        <LiveData />
        <Copyright versionNumber={this.versionNumber} />

      </React.Fragment>

    )
  }

}

export default App;

