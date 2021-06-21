const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const UserType = require('./UserType');
const PostType = require('./PostType');
const FollowType = require('./FollowType');
const fs = require("fs");

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addUser: {
            type: UserType,
            description: 'add a user',
            args: {
                userName: {type: GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLNonNull(GraphQLString)},
                password: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: async (parent, args) => {
                try {
                    const checkUser = await User.find({userName: args.userName});

                    if(checkUser.length > 0) {
                        throw new Error(`Username ${args.userName} already exists.`)
                    }

                    const newUser = new User({
                        userName: args.userName,
                        password: args.password,
                        name: args.name,
                        posts: [],
                        followers: [],
                        following: []
                    });
                    const user = await newUser.save();
                    const accessToken = jwt.sign({ userName: args.userName,  password: args.password }, 'secret');
                    user.token = accessToken;
                    return user;
                } catch (err) {
                    throw new Error(err);
                }
            }
        },
        addPost: {
            type: PostType,
            description: 'add a post',
            args: {
                userName: {type: GraphQLNonNull(GraphQLString)},
                password: {type: GraphQLNonNull(GraphQLString)},
                token: {type: GraphQLNonNull(GraphQLString)},
                image: {type: GraphQLNonNull(GraphQLString)},
                caption: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: async (parent, args) => {
                try {
                    const user = await User.find({userName: args.userName});

                    let maxId = 0;
    
                    jwt.verify(args.token, 'secret', (err, user) => {
                        if(user.userName !== args.userName || user.password !== args.password) {
                            throw new Error('Authentication Failed');
                        }
                    });
    
                    for(let i = 0; i < user[0].posts.length; i++) {
                        if(user[0].posts[i].id > maxId) {
                            maxId = user[0].posts[i].id
                        }
                    }
    
                    const newPosts = [...user[0].posts, {image: args.image, caption: args.caption, id: maxId+1}];
                    const updatedPost = await User.updateOne({userName: args.userName}, {
                        $set: {
                            posts: newPosts
                        }
                    });
    
                    if(updatedPost.nModified === 1) {
                        return {image: args.image, caption: args.caption};
                    }
                } catch(err) {
                    throw new Error(err);
                }
            }
        },
        deletePost: {
            type: UserType,
            description: 'delete a post',
            args: {
                userName: {type: GraphQLNonNull(GraphQLString)},
                password: {type: GraphQLNonNull(GraphQLString)},
                token: {type: GraphQLNonNull(GraphQLString)},
                postId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: async (parent, args) => {
                try {
                    const user = await User.find({userName: args.userName});

                    jwt.verify(args.token, 'secret', (err, user) => {
                        if(user.userName !== args.userName || user.password !== args.password) {
                            throw new Error('Authentication Failed');
                        }
                    });

                    for(let i = 0; i < user[0].posts.length; i++) {
                        if(user[0].posts[i].id === args.postId) {
                            const imageId = user[0].posts[i].image.split('imageId=')[1];
                            const path = `./uploads/${args.userName}/${imageId}.png`

                            fs.unlinkSync(path);
                            user[0].posts.splice(i, 1);
                        }
                    }

                    const updatedPost = await User.updateOne({userName: args.userName}, {
                        $set: {
                            posts: user[0].posts
                        }
                    });

                    if(updatedPost.nModified === 1) {
                        return {
                            posts: user[0].posts
                        }
                    }
                } catch(err) {
                    throw new Error(err);
                }
            }
        },
        addFollowing: {
            type: FollowType,
            description: 'add a following',
            args: {
                userName: {type: GraphQLNonNull(GraphQLString)},
                password: {type: GraphQLNonNull(GraphQLString)},
                token: {type: GraphQLNonNull(GraphQLString)},
                followingUserName: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: async (parent, args) => {
                try {
                    if(args.userName === args.followingUserName) {
                        throw new Error('Cannot follow user');
                    }
    
                    const user = await User.find({userName: args.userName});
                    const follow = await User.find({userName: args.followingUserName});
    
                    if(user.length === 0) {
                        throw new Error(`User ${args.userName} does not exist`);
                    } else if(follow.length === 0) {
                        throw new Error(`User ${args.followingUserName} does not exist`);
                    }
    
                    jwt.verify(args.token, 'secret', (err, user) => {
                        if(user.userName !== args.userName || user.password !== args.password) {
                            throw new Error('Authentication Failed');
                        }
                    });
    
                    for(let i = 0; i < user[0].following.length; i++) {
                        if(user[0].following[i].userName === follow[0].userName) {
                            throw new Error(`${user[0].userName} already following ${follow[0].userName}`)
                        }
                    }
    
                    const newFollowing = [...user[0].following, {name: follow[0].name, userName: args.followingUserName}];
                    const newFollower = [...follow[0].followers, {name: user[0].name, userName: args.userName}];
    
                    const updatedFollowing = await User.updateOne({userName: args.userName}, {
                        $set: {
                            following: newFollowing
                        }
                    });
    
                    const updatedFollower = await User.updateOne({userName: args.followingUserName}, {
                        $set: {
                            followers: newFollower
                        }
                    });
    
                    if(updatedFollowing.nModified === 1 && updatedFollower.nModified === 1) {
                        return {
                            userName: args.followingUserName,
                            name: follow[0].name
                        }
                    } else {
                        throw new Error("No follow created");
                    }
                } catch(err) {
                    throw new Error(err);
                }
            }
        }
    })
});

module.exports = RootMutationType;