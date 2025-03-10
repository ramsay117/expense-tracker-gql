import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

const userResolver = {
  Query: {
    authUser: (_, __, context) => {
      try {
        const user = context.getUser(); // checks req.user
        return user;
      } catch (error) {
        throw error;
      }
    },
    user: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    signup: async (_, { input }, context) => {
      try {
        const { username, fullName, password, gender } = input;
        if (!username || !fullName || !password || !gender) {
          throw new Error('All fields are required');
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error('User already exists');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
          username,
          fullName,
          password: hashedPassword,
          gender,
          profilePicture: gender === 'male' ? boyProfilePic : girlProfilePic,
        });
        await newUser.save();
        await context.login(newUser); // triggers Passport.js to log in the user, creates a session for that user (req.session)
        return newUser;
      } catch (error) {
        throw error;
      }
    },
    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;
        if (!username || !password) {
          throw new Error('All fields are required');
        }
        const { user } = await context.authenticate('graphql-local', {
          username,
          password,
        });
        await context.login(user);
        return user;
      } catch (error) {
        throw error;
      }
    },
    logout: async (_, __, context) => {
      try {
        await context.logout(); // remove the user from the req.user
        context.req.session.destroy((error) => {
          // to remove the entire session from the session store
          if (error) throw new Error(error);
        });
        await context.res.clearCookie('connect.sid'); // clears the session cookie from the client
        return { message: 'Logout successful' };
      } catch (error) {
        throw error;
      }
    },
  },
};

export default userResolver;
