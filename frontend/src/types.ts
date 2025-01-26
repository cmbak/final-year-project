export type User = {
  id: number;
  email: string;
  username: string;
};

export type AnonymousUser = {};

export type Category = {
  id: number;
  name: string;
  user: number;
};
