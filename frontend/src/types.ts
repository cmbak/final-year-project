import React from "react";

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

export type Answer = {
  id: number;
  answer: string;
};

export type Question = {
  id: number;
  quizId: number;
  question: string;
  correct_answer: Answer;
  answers: Answer[];
};

type FormEntry = FormDataEntryValue | null; // Type return when calling FormData.get()
export type CreateQuizDetails = {
  category: FormEntry;
  title: FormEntry;
  userId: number | undefined;
  labels: number[];
  video: FormEntry;
};

export type FormError = string[];

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
