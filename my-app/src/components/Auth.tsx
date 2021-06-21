import React, {useState} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import { gql } from '@apollo/client';

const Auth = ({client, next}):JSX.Element => {

    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [newUser, setNewUser] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [verifyPassword, setVerifyPassword] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');

    const queryUser = async () => {

        if(userName === '' || password === '') {
            return;
        }

        try {
            const user = await client.query({
                query: gql`
                query GetUsers {
                    users(userName:"${userName}", password:"${password}") {
                        userName,
                        password,
                        posts {
                          image, 
                          caption
                        },
                        following {
                          name, 
                          userName
                        },
                        followers {
                          name, 
                          userName
                        }
                        token
                      }
                }
                `
            });

            window.sessionStorage.setItem('token', user.data.users.token);
            window.sessionStorage.setItem('userName', user.data.users.userName);
            window.sessionStorage.setItem('password', user.data.users.password);
            window.location.pathname = next;

        } catch(err) {
            alert(err.toString());
        }
    }

    const addUser = async (ev) => {

        ev.preventDefault();

        if(newUser === '' || newPassword === '' || fullName === '' || verifyPassword === '') {
            return;
        } else if(newPassword !== verifyPassword) {
            alert('passwords do not match');
        }

        try {
            const user = await client.mutate({
                mutation: gql`
                mutation AddUser {
                        addUser(userName:"${newUser}", name:"${fullName}" password: "${newPassword}") {
                          userName,
                          password,
                          token
                    }
                }
                `
            });
    
            window.sessionStorage.setItem('token', user.data.addUser.token);
            window.sessionStorage.setItem('userName', user.data.addUsers.userName);
            window.sessionStorage.setItem('password', user.data.addUsers.password);
            window.location.pathname = next;
        } catch(err) {
            alert(err.toString());
        }
    }

    return (
        <Container>
            <Row className="centered-row">
                <Col>
                    <h3>Existing User</h3>
                </Col>
            </Row>
            <Row>
                <Col/>
                <Col xs={5}>
                    <Form>
                        <Form.Group>
                            <Form.Control className="input" type="email" required={true} placeholder="Enter User Name" onChange={(ev) => setUserName(ev.target.value)}/>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Control className="input" type="password" required={true} placeholder="Password" onChange={(ev) => setPassword(ev.target.value)}/>
                        </Form.Group>
                        <Button className="custom-button" variant="primary" onClick={() => queryUser()}>
                            Submit
                        </Button>
                    </Form>
                </Col>
                <Col/>
            </Row>
            <Row className="centered-row">
                <Col>
                    <h3>New User</h3>
                </Col>
            </Row>
            <Row style={{marginBottom: "30px"}}>
                <Col/>
                <Col xs={5}>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control className="input" required={true} placeholder="Enter User Name" onChange={(ev) => setNewUser(ev.target.value)}/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Control className="input" required={true} placeholder="Full Name" onChange={(ev) => setFullName(ev.target.value)}/>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Control className="input" type="password" required={true} placeholder="Password" onChange={(ev) => setNewPassword(ev.target.value)}/>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Control className="input" type="password" required={true} placeholder="Re-Enter Password" onChange={(ev) => setVerifyPassword(ev.target.value)}/>
                        </Form.Group>
                        <Button className="custom-button" variant="primary" type="submit" onClick={(ev) => addUser(ev)}>
                            Submit
                        </Button>
                    </Form>
                </Col>
                <Col/>
            </Row>
        </Container>
    )
}

export default Auth;