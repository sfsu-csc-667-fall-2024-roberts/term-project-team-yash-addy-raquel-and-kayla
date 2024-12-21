import connectPgSimple from "connect-pg-simple";
import type { Express, RequestHandler } from "express";
import flash from "express-flash";
import session from "express-session";

let sessionMiddleware: RequestHandler | undefined = undefined;

export default (app: Express): RequestHandler => {
  if (sessionMiddleware === undefined) {
    sessionMiddleware = session({
      store: new (connectPgSimple(session))({
        createTableIfMissing: true,
        conObject: {
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          database: process.env.DB_NAME || 'sequence_game',
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || ''
        }
      }),
      secret: process.env.SESSION_SECRET!,
      resave: true,
      saveUninitialized: true,
      cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true, // Prevent client-side access
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      },
    });

    app.use(sessionMiddleware);
    app.use(flash());
  }

  // for debugging
  app.use((req, res, next) => {
    console.log("Session Middleware Invoked:");
    console.log("Session Data Before Route:", req.session);
    next();
  });

  // for debugging
  app.use((req, res, next) => {
    console.log("Session Store Check:", req.sessionStore);
    next();
  });



  return sessionMiddleware;
};
