const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull
} = require('graphql');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const UserType = require('./UserType');

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        users: {
            type: UserType,
            decription: 'User',
            args: {
                userName: {type: GraphQLNonNull(GraphQLString)},
                password: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: async (parent, args) => {
                try {
                    const user = await User.find({userName: args.userName});
                    if(user.length === 0) {
                        throw new Error('No user found')
                    }
                    const accessToken = jwt.sign({ userName: args.userName,  password: args.password }, 'secret');
                    
                    if(user[0].password === args.password) {
                        user[0].token = accessToken;
                        return user[0];
                    } else {
                        throw new Error('Invalid Password')
                    }
                } catch(err) {
                    throw new Error(err);
                }
            }
        }, 
        posts: {
            type: UserType,
            description: 'Posts',
            args: {
                userName: {type: GraphQLNonNull(GraphQLString)},
                password: {type: GraphQLNonNull(GraphQLString)},
                token: {type: GraphQLNonNull(GraphQLString)},
                viewUserName: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: async (parent, args) => {
                try {
                    const viewUser = await User.find({userName: args.viewUserName});

                    if(viewUser.length === 0) {
                        throw new Error('No user found');
                    }

                    jwt.verify(args.token, 'secret', (err, user) => {
                        if(user.userName !== args.userName || user.password !== args.password) {
                            throw new Error('Authentication Failed');
                        }
                    });

                    return {
                        userName: args.viewUserName,
                        followers: viewUser[0].followers,
                        following: viewUser[0].following,
                        posts: viewUser[0].posts
                    }
                } catch(err) {
                    throw new Error(err);
                }
            }
        }
    })
});

module.exports = RootQueryType;