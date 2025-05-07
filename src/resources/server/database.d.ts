import { ClientSession, Collection, ObjectId, WithoutId } from "mongodb";

export type UserSchema = {
  user_hash: string;
  password_hash: string;
  private: {
    name: string;
    team: PrivateUserMember[];
  };
  public: {
    team: PublicUserMember[];
  };
};

export type EncrypedUserSchema = Omit<UserSchema, "private"> & {
  private: string;
};

export type UserMember = {
  name: string;

  tags: {
    [type: string]: string;
  };

  user: string;
  password: string;
  user_hash: string;
  password_hash: string;
  members?: UserMember[];
};

export type PrivateUserMember = Omit<UserMember, "user_hash" | "password_hash" | "members"> & {
  members: PrivateUserMember[];
};

export type PublicUserMember = Omit<UserMember, "user" | "password" | "tags" | "name" | "members"> & {
  members: PublicUserMember[];
};

export type DataSchema = {
  member_ref: string;
  answers: { [qid: string]: number };
  survey_ref: ObjectId;
};

export type SurveySchema = {
  created_at: Date;
  active: boolean;
  questions: {
    [qid: string]: MultipleChoice | LikertScale;
  };
};

export type MultipleChoice = {
  question: string;
  type: "multiple_choice";
  options: string[];
  required: boolean;
};

export type LikertScale = {
  question: string;
  type: "likert_scale";
  range: {
    minLabel: string;
    maxLabel: string;
    steps: number;
  };
  required: boolean;
};

export type AuthSchema = {
  token: string;
  payload: string;
  expires: Date;
};

export type TransactionSchema = {
  user_hash: string;
  type: string;
  meta: string;
  tasks: {
    name: string;
    done: boolean;
    meta?: string;
  }[];
  expires: Date;
  attemps: number;
};

export type Client = {
  user: Collection<EncrypedUserSchema>;
  survey: Collection<SurveySchema>;
  data: Collection<DataSchema>;
  auth: Collection<AuthSchema>;
  transaction: Collection<TransactionSchema>;
  session: (callback: (session: ClientSession) => Promise<void>) => Promise<void>;
};

/**
 * @typedef {WithoutId<G>} AutoId
 */
export type AutoId<G> = WithoutId<G>;
