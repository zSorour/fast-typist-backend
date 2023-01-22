// import AppError from '@errors/AppError';
// import HTTPError from '@errors/HTTPError';
// import AuthService from '@features/auth/Auth.service';
// import { NextFunction, Request, Response } from 'express';
// import { TokenExpiredError } from 'jsonwebtoken';

// type AuthRequest = Request & {
//   username: string;
// };

// const isAuthenticated = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authService = new AuthService();
//   const authorizationHeader = req.headers.authorization;
//   if (!authorizationHeader) {
//     throw new HTTPError('Unauthorized', 401, ['No JWT is provided']);
//   }
//   const token = authorizationHeader.split(' ')[1];
//   try {
//     console.log(token);
//     const { username } = await authService.verifyAccessToken(token);
//     req.username = username;
//     next();
//   } catch (error) {
//     if (error instanceof TokenExpiredError) {
//       throw new HTTPError('Token Expired', 401);
//     }
//     if (error instanceof AppError) {
//       res.status(401);
//     }
//     next(error);
//   }
// };

// export default isAuthenticated;
