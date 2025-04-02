import React from "react";

export type User = {
  id: number;
  email: string;
  username: string;
};

export type AnonymousUser = {};

type videoTypeKey = "YT" | "UP";

export type Quiz = {
  id: number;
  title: string;
  user: number;
  type: videoTypeKey;
  colour: string;
  embed_url: string;
};

export type Answer = {
  id: number;
  answer: string;
  correct_answer_for: number;
};

export type Question = {
  id: number;
  quizId: number;
  question: string;
  answers: Answer[];
  timestamp: string;
};

type FormEntry = FormDataEntryValue | null; // Type return when calling FormData.get()

export type CreateQuizDetails = {
  title: FormEntry;
  userId: number | undefined;
  video: FormEntry;
  url: FormEntry | null;
  videoType: videoTypeKey;
};

export type FormError = string[];

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
