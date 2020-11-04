const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typeDef');
const resolvers = require('./graphql/resolvers');

const myPlugin = {
    requestDidStart() {
      return {
        parsingDidStart() {
          return (err) => {
            if (err) {
              console.error(err);
            }
          }
        },
        validationDidStart() {
          // This end hook is unique in that it can receive an array of errors,
          // which will contain every validation error that occurred.
          return (errs) => {
            if (errs) {
              errs.forEach(err => console.error(err));
            }
          }
        },
        executionDidStart() {
          return (err) => {
            if (err) {
              console.error(err);
            }
          }
        }
      }
    }
  }

const server = new ApolloServer({
    typeDefs, resolvers, context: ({ req }) => ({ req }), plugins: [myPlugin]
})

mongoose.connect('mongodb://localhost/socialapp', {useNewUrlParser:true})
        .then(() => server.listen({port:5000})
        .then(res => console.log(`Server running at ${res.url}`))
);

