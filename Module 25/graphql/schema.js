const { buildSchema } = require("graphql");

module.exports = buildSchema(`

    type Post {
    
        _id: ID!
        title: String!
        content: String!
        imageUrl: String
        creator: User!

    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String!
        status: String!
        posts: [Post!]!
    }
    
    
    input UserInputData {
        
    email: String!
    password: String!
    name: String!
    
    }   

    input PostInputData {
    
        title: String!
        content: String!
        imageUrl: String!
    
    }
    
    type MutationQueryDefinition {
        
    createUser(userInput: UserInputData): User!
    createPost(postInput: PostInputData): Post!
    updatePost(postId: String!, postInput: PostInputData): Post!
    deletePost(postId: String!): String!
    updateUserStatus(status: String!): User!  
    
    }

    type AuthData {
    
        token: String!
        userId: String!
    
    }

    type PostData {

        posts: [Post!]!
        totalPosts: Int!
    
    }

    type singlePost {
    
        post: Post!

    }

    type rootQuery {
        login(email: String!, password: String!): AuthData!
        getPosts(pageNumber: Int): PostData!
        getPost(postId: String): singlePost!
        user: User!
    }

    schema {
        query: rootQuery,
        mutation: MutationQueryDefinition
    }
    
    `);
