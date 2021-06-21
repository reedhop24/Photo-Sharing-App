import { Container, Row, Col } from "react-bootstrap"

const Post = ({post}):JSX.Element => (
    <>
        { post ? <Container>
                    <Row>
                        <Col xs={3}>
                            <img src={post.image} height="200" width="400"></img> 
                        </Col>
                        <Col xs={5} style={{marginLeft:"250px"}}>
                            <p>{post.caption}</p>
                        </Col>
                    </Row>
                </Container> : null }
    </>
)

export default Post