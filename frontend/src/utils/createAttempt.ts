import { instance } from "../axiosConfig";

type CreateAttemptArgs = {
  date: string;
  score: number;
  quiz: number;
  user: number | undefined;
};

export const createAttempt = async ({
  date,
  score,
  quiz,
  user,
}: CreateAttemptArgs) => {
  await instance.postForm(
    "/api/attempts/",
    { date, score, quiz, user },
    { withXSRFToken: true },
  );
};
