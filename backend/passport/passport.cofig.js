import passport from 'passport';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { GraphQLLocalStrategy } from 'graphql-passport';

export const configurePassport = async () => {
  passport.serializeUser((user, done) => {
    console.log(`Serializing user: ${user._id}`);
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      console.log(`Deserializing user: ${id}`);
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
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
};
