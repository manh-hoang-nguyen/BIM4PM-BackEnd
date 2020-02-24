const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updateAt: String!
    }

    type User {
        _id: ID!
        name: String!
        password: String!
        status: String!
        posts: [Post!]!
    }

    type AuthData {
        token: String!
        userId: String!
    }


    input Name {
        firstName: String!
        lastName: String!
    }
    input UserInputData {
        email: String!
        name: Name!
        password: String!
    }
 
    type RootQuery {
        login(email: String!, password: String!): AuthData!
    }


    type RootMutation {
        createUser(userInput: UserInputData ): User!
    }

    schema { 
        query: RootQuery
        mutation: RootMutation
    }
`);
