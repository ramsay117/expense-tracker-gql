const userResolver = {
  Query: {
    users: () => [],
    authUser: () => {},
    user: (_, args) => {
      return {};
    },
  },
  Mutation: {},
};

export default userResolver;
