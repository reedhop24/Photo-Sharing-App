const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');
const PostType = require('./PostType');
const FollowType = require('./FollowType');

const UserType = new GraphQLObjectType({
    name: "User",
    description: 'User username pw',
    fields: () => ({
        userName: {type: GraphQLNonNull(GraphQLString)},
        name: {type: GraphQLNonNull(GraphQLString)},
        password: {type: GraphQLNonNull(GraphQLString)},
        posts: {type: GraphQLList(PostType)},
        followers: {type: GraphQLList(FollowType)},
        following: {type: GraphQLList(FollowType)},
        token: {type: GraphQLString}
    })
});

module.exports = UserType;