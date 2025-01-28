export type User = {
  id: number;
  email: string;
  username: string;
};

export type AnonymousUser = {};

type HasIdNameUser = {
  id: number;
  name: string;
  user: number;
};

export type Category = HasIdNameUser;
export type Label = HasIdNameUser;

export type Quiz = {
  id: number;
  title: string;
  user: number;
  category: number;
  labels: Label[];
};
