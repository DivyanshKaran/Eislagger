declare namespace Express {
  export interface Request {
    user?: {
      message: string;
      user: {
        id: string;
        role: string;
      };
    };
  }
}
