import React, {useEffect, useState} from 'react';
import {Container, Row, Col, Modal} from 'react-bootstrap';
import {v4 as uuidv4} from 'uuid';
import { gql } from '@apollo/client';
import Post from './PostView';

const Profile = ({client, user}):JSX.Element => {
    let [formatted, setFormatted] = useState<Array<Array<Object>>>([]);
    let [name, setName] = useState<String>('');
    const userName:string | null = window.sessionStorage.getItem('userName');
    const password:string | null = window.sessionStorage.getItem('password');
    const token:string | null = window.sessionStorage.getItem('token');
    const [posts, setPosts] = useState<Array<Object>>([]);
    const [view, setView] = useState<Object>();

    useEffect(() => {
        if(user !== '') {
            client.query({
                query: gql`
                query GetUsers {
                    posts(userName:"${userName}", password:"${password}", token:"${token}", viewUserName:"${user === null ? userName: user}") {
                        posts {
                          image, 
                          caption,
                          id
                        },
                        userName
                    }
                }
            `})
            .then((res) => { 
                if(res.data) {
                    format(res.data.posts.posts);
                    setName(res.data.posts.userName);
                }
            })
            .catch((err) => {
                alert(err.toString());
            })
        }
    }, [user]);

    const format = (posts) => {
        let outer : Array<Array<Object>> = [];
        let inner : Array<Object> = [];

        setPosts(posts);
        for(let i = 0; i < posts.length; i++) {
            if(i % 3 === 0 && i > 0) {
                outer.push(inner);
                inner = [];
            }
            inner.push(posts[i]);
        }

        if(inner.length !== 0) {
            outer.push(inner);
        }

        setFormatted(outer);
    }

    

    const handleView = (image) => {
        posts.forEach((x) => {
            if(x['image'] === image) {
                setView(x);
            }
        })
    }

    const deletePost = async () => {
        try {
            const deleted = await client.mutate({
                mutation: gql`
                mutation{
                    deletePost(userName:"${userName}", password:"${password}", token: "${token}", postId: ${view!['id']}) {
                      posts {
                          image
                          caption
                          id
                      }
                    }
                  }
                `
            });
    
            if(deleted.data) {
                setView(undefined);
                format(deleted.data.deletePost.posts);
            }
        } catch(err) {
            alert(err);
        }
    }

    return (
        <Container>
            <div className="view-div">
                <Row className="centered-row">
                    <Col>
                        <h1>{name}</h1>
                    </Col>
                </Row>
                <div className="divider-1"> <span></span> </div>
                {formatted.map((x) => {
                    return (
                        <Row key={uuidv4()} className="centered-row">
                            {x.map((y) => {
                                return <Col xs={4} key={uuidv4()} onClick={(ev) => handleView(y["image"])}>
                                    <div className="image-container">
                                        <img className="image" alt="user" src={y["image"]} height="200" width="400"></img>
                                        <div className="middle">
                                            <i className="fa fa-arrows"></i>
                                        </div>
                                    </div>
                                </Col>
                            })}
                        </Row>
                    )
                })}
            </div>
            <Modal show={view !== undefined} size="lg">
                <Modal.Body className="centered-row">
                    <Post post={view}/>
                    <div style={{marginTop:"60px"}}>
                        <i onClick={() => setView(undefined)} className="fa fa-close" style={{fontSize:"36px"}}></i>
                        <div style={{display: "inline-block", marginLeft:"30px"}}>
                            <p className="user-name" onClick={() => deletePost()}>delete post</p>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </Container>
    )
}

export default Profile;