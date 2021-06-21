import React from 'react';
import {Nav, Navbar, Form, Button} from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Profile from './components/Profile';
import Followers from './components/Followers';
import Following from './components/Following';
import Auth from './components/Auth';
import { ApolloClient, InMemoryCache} from '@apollo/client';
import Upload from './components/Upload';

function App():JSX.Element {

  const client = new ApolloClient({
    uri: 'http://localhost:5000/graphql',
    cache: new InMemoryCache()
  });

  const isAuthorized = ():boolean => {
    const token = window.sessionStorage.getItem('token');

    if(!token) {
      return false;
    } else {
      return true;
    }
  }

  const logout = ():void => {
    window.sessionStorage.clear();
    window.location.href = "/auth";
  }

  return (
      <Router>
      <Navbar expand="lg" className="nav nav-custom">
        <Navbar.Brand className="nav-header" style={{color:'#212221', fontWeight: "bold"}}>Photo Sharing App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="nav-link">
            <Link to="/followers" className="nav-text">Followers</Link>
          </Nav>
          <Nav className="nav-link">
            <Link to="/following" className="nav-text">Following</Link>
          </Nav>
          <Nav className="nav-link">
            <Link to="/profile" className="nav-text">Profile</Link>
          </Nav>
          <Form inline className="ml-auto" style={{marginRight:"10px"}}>
            <Button className="custom-button" href="/upload">Post Photo</Button>
          </Form>
          <Form inline>
            <Button className="custom-button" onClick={() => logout()}>Log Out</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <Switch>
          <Route path="/auth">
            <Auth client={client} next="profile" />
          </Route>
          <Route path="/followers">
            {isAuthorized() ? <Followers client={client}/> : <Redirect to="/auth"/> }
          </Route>
          <Route path="/following">
            {isAuthorized() ? <Following client={client}/> : <Redirect to="/auth"/>  }
          </Route>
          <Route path="/profile">
            {isAuthorized() ? <Profile client={client} user={null}/> : <Redirect to="/auth"/>  }
          </Route>
          <Route path="/upload">
            {isAuthorized() ? <Upload client={client} /> : <Redirect to="/auth"/>  }
          </Route>
      </Switch>
    </Router>
  );
}

export default App;
