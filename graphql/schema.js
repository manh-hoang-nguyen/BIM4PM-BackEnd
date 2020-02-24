const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Post {
        _id: Id!
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

    input UserInputData {
        email: String!
        name: String!
        password: String
    }

    type RootMutation {
        createUser(userInput: UserInputData ): User!
    }

    schema { 
        mutation: RootMutation
    }
`);
