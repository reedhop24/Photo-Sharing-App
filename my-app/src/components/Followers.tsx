import React, {useEffect, useState} from 'react';
import {Container, Row, Col, Table, Modal, Button} from 'react-bootstrap';
import Profile from './Profile';
import { gql } from '@apollo/client';
import {v4 as uuidv4} from 'uuid';

const Followers = ({client}):JSX.Element => {

    const [followers, setFollowers] = useState<Array<Object>>([]);
    const userName:string | null = window.sessionStorage.getItem('userName');
    const password:string | null = window.sessionStorage.getItem('password');
    const [currView, setCurrView] = useState<string>('');

    useEffect(() => {
        client.query({
            query: gql`
            query GetUsers {
                users(userName:"${userName}", password:"${password}") {
                    followers {
                      name, 
                      userName
                    }
                  }
            }
            `
        })
        .then((res) => {
            setFollowers(res.data.users.followers);
        })
        .catch((err) => {
            alert(err.toString());
        })
    }, []);

    const handleCurrView = async (target) => {
        setCurrView(target.innerHTML);
    }

    return(
        <Container>
            <div className="view-div">
                <Row className="centered-row">
                    <Col>
                        <h1>Followers</h1>
                    </Col>
                </Row>
                <Row className="centered-row">
                    <Col/>
                    <Col xs={5}>
                        <Table>
                            <tbody>
                                {followers.map((x) => {
                                    return (
                                            <tr key={uuidv4()}>
                                                <td>{x['name']}</td>
                                                <td className="user-name" onClick={(ev) => handleCurrView(ev.target)}>{x['userName']}</td>
                                            </tr>
                                        )
                                })} 
                            </tbody>  
                        </Table>
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

export default Followers;