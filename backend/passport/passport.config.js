import passport from 'passport';
import bcrypt from 'bcryptjs';
import { GraphQLLocalStrategy } from 'graphql-passport';
import User from '../models/user.model.js';

export const configurePassport = () => {
  passport.serializeUser((user, done) => done(null, user._id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error('User not found');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error('Incorrect password');
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }),
  );
};
