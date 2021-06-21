import React, {useState} from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import { gql } from '@apollo/client';

const Upload = ({client}) => {
    const userName:string | null = window.sessionStorage.getItem('userName');
    const password:string | null = window.sessionStorage.getItem('password');
    const token:string | null = window.sessionStorage.getItem('token');
    const [file, setFile] = useState<string>('');
    const [caption, setCaption] = useState<string>('');

    const handleFile = async (event) => {
        let data = new FormData();
        data.append('file', event.target.files[0]);

        fetch('http://localhost:5000/upload', {
            method: 'POST',
            headers: {
                username: userName!
            },
            body: data
        })
        .then(res => res.json())
        .then((res) => {
            setFile(res.newFile);
        })
        .catch((err) => {
            alert(err.toString());
        })
    }

    const addFile = async () => {
        try {
            const newPhoto = await client.mutate({
                mutation: gql`
                mutation AddUser {
                    addPost(userName:"${userName}", password:"${password}", token: "${token}" image:"${file}", caption:"${caption}") {
                        image,
                        caption
                    }
                }
                `
            });

            if(newPhoto.data.addPost) {
                window.location.href = '/profile'
            }

        } catch(err) {
            alert(err.toString())
        }
    }

    return (
        <Container>
            <Row className="centered-row">
                <Col>
                    <input type="file" onChange={(ev) => handleFile(ev)}></input>
                    <Button className="custom-button" onClick={() => addFile()}>Save</Button>
                </Col>
            </Row>
            {file !== '' ? 
            <Row>
                <Col/>
                <Col xs={6}>
                    <img className="image" src={file} alt="new-post" height="300" width="600"></img>
                </Col>
                <Col xs={4}>
                    <textarea className="input" rows={10} cols={50} onChange={(ev) => setCaption(ev.target.value)}></textarea>
                </Col>
                <Col/>
            </Row> : null}
        </Container>
    )
}

export default Upload;