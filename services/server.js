const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const app = express();
const {GraphQLSchema} = require('graphql');
const Mutation = require('./GraphQLTypes/RootMutation');
const Query = require('./GraphQLTypes/RootQuery');
const cors = require('cors');
const upload = require('./routes/upload');
const getImage = require('./routes/getImage');
const mongoose = require('mongoose');
require('dotenv/config');

const schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});

app.use(cors());
app.use('/', upload);
app.use('/', getImage);
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

mongoose.connect(
    process.env.DB_CONNECTION, 
    {useNewUrlParser: true, useUnifiedTopology: true }, 
    () => console.log('Connected to db')
);

app.listen(5000, () => console.log('Server Running'));

module.exports = app;