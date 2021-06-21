const chai = require('chai');
const chaiHttp = require("chai-http");
const server = require('./server');

chai.should();
chai.use(chaiHttp);

describe('Testing Root Mutation', () => {
    it('Should Add User', (done) => {
        chai.request()
        const mutation = 'mutation{\
            addUser(userName:"reed26", name:"Reed Hopkins" password: "Bushums24") {\
              userName,\
              password,\
              token\
            }\
        }'
        chai.request(server)
            .post('/graphql')
            .send({query:mutation})
            .end((err, response) => {
                if(err) console.log(err);
                response.body.data.addUser.should.have.property('userName').eq('reed26');
                response.body.data.addUser.should.have.property('password').eq('Bushums24');
                response.body.data.addUser.should.have.property('token');
                done();
            })
    })

    it('Should Add A Following', (done) => {
        chai.request()
        const mutation = `mutation{\
            addFollowing(userName:"reed1", token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InJlZWQxIiwicGFzc3dvcmQiOiJCdXNodW1zMjQiLCJpYXQiOjE2MjM5NjEwMDV9.HwBXalYKQ1KQwm6BQ48T4OHmpjnBG-U7OJ_ZLRZB-U8", password:"Bushums24" followingUserName:"reed123") {\
              userName\
            }\
          }`
        chai.request(server)
            .post('/graphql')
            .send({query:mutation})
            .end((err, response) => {
                
                response.body.data.addFollowing.should.have.property('userName').eq('reed123');
                done();
            })
    })

    it('Should Add a Post', (done) => {
        chai.request()
        const mutation = `mutation{
            addPost(userName:"reed1", password:"Bushums24", token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InJlZWQxIiwicGFzc3dvcmQiOiJCdXNodW1zMjQiLCJpYXQiOjE2MjM5NjEwMDV9.HwBXalYKQ1KQwm6BQ48T4OHmpjnBG-U7OJ_ZLRZB-U8", image:"image", caption:"caption") {
              image,
              caption
            }
        }`
        chai.request(server)
            .post('/graphql')
            .send({query:mutation})
            .end((err, response) => {
                response.body.data.addPost.should.have.property('image').eq('image');
                response.body.data.addPost.should.have.property('caption').eq('caption');
                done();
            })
    });

    it('Should delete a Post', (done) => {
        chai.request()
        const mutation = `mutation{
            deletePost(userName:"reed1", password:"Bushums24", token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InJlZWQxIiwicGFzc3dvcmQiOiJCdXNodW1zMjQiLCJpYXQiOjE2MjM5NjEwMDV9.HwBXalYKQ1KQwm6BQ48T4OHmpjnBG-U7OJ_ZLRZB-U8", postId: 4) {
              posts {
                image
                caption
              }
            }
          }
          `
        chai.request(server)
            .post('/graphql')
            .send({query:mutation})
            .end((err, response) => {
                response.body.data.deletePost.should.have.deep.property('posts');
                done();
            })
    });
});

describe('Testing Root Query', () => {
    it('Should Returns Posts Followers, and Following', (done) => {
        chai.request()
        const query = `{ 
            posts(userName:"reed1", password:"Bushums24", token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InJlZWQxIiwicGFzc3dvcmQiOiJCdXNodW1zMjQiLCJpYXQiOjE2MjM5NjEwMDV9.HwBXalYKQ1KQwm6BQ48T4OHmpjnBG-U7OJ_ZLRZB-U8", viewUserName:"reed1") { 
              posts { 
                image, 
                caption,
                id
              },
              following {
                name, 
                userName
              },
              followers {
                name, 
                userName
              }
            }
        }`
        chai.request(server)
            .post('/graphql')
            .send({query: query})
            .end((err, response) => {

                response.should.have.status(200);
                response.body.data.posts.should.have.deep.property('posts');
                response.body.data.posts.should.have.deep.property('following');
                response.body.data.posts.should.have.deep.property('followers');
                done();
            });
    });

    it('Should Returns Queried User', (done) => {
        chai.request()
        const query = `{
            users(userName: "reed1", password:"Bushums24") {
              userName,
              password,
              token
            }
          }`
        chai.request(server)
            .post('/graphql')
            .send({query: query})
            .end((err, response) => {
                if(err) console.log(err);
                response.should.have.status(200);
                response.body.data.users.should.have.property('userName').eq('reed1');
                response.body.data.users.should.have.property('password').eq('Bushums24');
                response.body.data.users.should.have.property('token');
                done();
            });
    });
});
