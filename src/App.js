import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Navbar from './components/Navbar'
import Shopping from './components/Shopping'


class App extends Component {
  render() {
    return (
       <BrowserRouter>
            <div className="App">            
              <Navbar/>
                <Switch>
                    <Route exact path="/" component={Shopping}/>                    
                </Switch>
             </div>
       </BrowserRouter>
      
    );
  }
}

export default App;