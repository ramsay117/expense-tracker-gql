const userTypeDef = `#graphql
  type User {
    _id: ID!
    username: String!
    name: String!
    password: String!
    profilePicture: String
    gender: String!
  }

  type Query {
    authUser: User
    user(userId: ID!): User
  }

  type Mutation {
    signup(input: SignupInput!): User
    login(input: LoginInput!): User
    logout: LogoutResponse
  }

  input SignupInput {
    name: String!
    username: String!
    password: String!
    gender: String!
  }

  input LoginInput {
    username: String!,
    password: String!
  }

  type LogoutResponse {
    message: String!
  }
`;

export default userTypeDef;
