declare namespace Express {
  export interface Request {
    user?: {
      _id: string;
      username: string;
      email: string;
    };
  }
}

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  user: string | User;
  isAudioNote: boolean;
  isFavorite: boolean;
  createdAt: Date;
}

interface AuthResponse {
  token: string;
  userId: string;
}

interface ErrorResponse {
  message: string;
  error?: any;
}

interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}
