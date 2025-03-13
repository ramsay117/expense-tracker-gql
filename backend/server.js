import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import passport from 'passport';
import session from 'express-session';
import ConnectMongo from 'connect-mongodb-session';
import { buildContext } from 'graphql-passport';
import mergedTypeDefs from './typeDefs/index.js';
import mergedResolvers from './resolvers/index.js';
import connectToMongoDB from './db/connectToMongoDB.js';
import { configurePassport } from './passport/passport.config.js';

dotenv.config();
const __dirname = path.resolve();

const app = express();
const httpServer = http.createServer(app);
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.NODE_ENV !== 'production'
    ? ['http://localhost:5173', 'http://localhost:3000']
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

// const mongoDBStore = ConnectMongo(session);
// const store = new mongoDBStore({
//   uri: process.env.MONGODB_URI,
//   collection: 'sessions',
// });
// store.on('error', (error) => console.error('Session store error:', error.message));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      httpOnly: true,
    },
    // No store specified - will use in-memory store which is better for serverless
  })
);

app.use(passport.initialize());
app.use(passport.session());
configurePassport();

const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    const server = new ApolloServer({
      typeDefs: mergedTypeDefs,
      resolvers: mergedResolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    app.use(
      '/graphql',
      expressMiddleware(server, {
        context: async ({ req, res }) => buildContext({ req, res }),
      }),
    );

    const staticPath = path.join(__dirname, 'frontend', 'dist');
    app.use(express.static(staticPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(staticPath, 'index.html'));
    });

    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    await connectToMongoDB();
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  } catch (error) {
    console.error('Failed to start server:', error.message);
  }
}

startServer();
