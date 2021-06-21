import React, {useEffect, useState} from 'react';
import {Container, Row, Col, Table, Button, Modal} from 'react-bootstrap';
import Profile from './Profile';
import { gql } from '@apollo/client';
import {v4 as uuidv4} from 'uuid';

const Following = ({client}):JSX.Element => {
    const [newFollow, setNewFollow] = useState<string>('');
    const [following, setFollowing] = useState<Array<Object>>([]);
    const userName:string | null = window.sessionStorage.getItem('userName');
    const password:string | null = window.sessionStorage.getItem('password');
    const token:string | null = window.sessionStorage.getItem('token');
    const [currView, setCurrView] = useState<string>('');

    useEffect(() => {
        client.query({
            query: gql`
            query GetUsers {
                users(userName:"${userName}", password:"${password}") {
                    following {
                      name, 
                      userName
                    }
                  }
            }
            `
        })
        .then((res) => {
            setFollowing(res.data.users.following);
        })
        .catch((err) => {
            alert(err.toString());
        })
    }, [])

    const addNewFollow = async () => {
        try {
            const follow = await client.mutate({
                mutation: gql`
                    mutation {
                        addFollowing(userName:"${userName}", token: "${token}", password:"${password}" followingUserName:"${newFollow}") {
                            userName,
                            name
                        }
                    }
                `
            })

            setFollowing([...following, follow.data.addFollowing]);
        } catch (err) {
            alert(err);
        }
    }

    const handleCurrView = async (target) => {
        setCurrView(target.innerHTML);
    }

    return(
        <Container>
            <div className="view-div">
                <Row className="centered-row">
                    <Col>
                        <h1>Following</h1>
                    </Col>
                </Row>
                <Row className="centered-row">
                    <Col/>
                    <Col xs={5}>
                        <Table>
                            <tbody>
                                {following ? following.map((x) => {
                                    return (
                                            <tr key={uuidv4()}>
                                                <td>{x['name']}</td>
                                                <td className="user-name" onClick={(ev) => handleCurrView(ev.target)}>{x['userName']}</td>
                                            </tr>
                                        )
                                }) : null}  
                            </tbody> 
                        </Table>
                    </Col>
                    <Col/>
                </Row>
                <Row className="centered-row">
                    <Col/>
                        <Col xs={5}>
                            <input className="input" placeholder="Search for Users" onChange={(ev) => setNewFollow(ev.target.value)}/> <Button className="custom-button" style={{marginLeft: "30px"}} onClick={() => addNewFollow()}>Follow</Button>
                        </Col>
                    <Col/>
                </Row>
            </div>
            <Modal show={currView !== ''} size="xl">
                <Modal.Body className="centered-row">
                    <Profile client={client} user={currView}/>
                    <i onClick={() => setCurrView('')} className="fa fa-close" style={{fontSize:"36px"}}></i>
                </Modal.Body>
            </Modal>
        </Container>
    )
}

export default Following;