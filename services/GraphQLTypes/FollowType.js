const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull
} = require('graphql');

const FollowType= new GraphQLObjectType({
    name: 'Following',
    description: 'List of followings',
    fields: () => ({
        name: {type: GraphQLNonNull(GraphQLString)},
        userName: {type: GraphQLNonNull(GraphQLString)}
    })
});

module.exports = FollowType;