const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');

const PostType = new GraphQLObjectType({
    name: "Post",
    description: 'User username pw',
    fields: () => ({
        image: {type: GraphQLNonNull(GraphQLString)},
        caption: {type: GraphQLNonNull(GraphQLString)},
        id: {type: GraphQLNonNull(GraphQLInt)}
    })
});

module.exports = PostType