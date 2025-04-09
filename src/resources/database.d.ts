import { Collection, ObjectId, WithoutId } from "mongodb";

export type AuthRules =
  | "create-data"
  | "read-data"
  | "update-data"
  | "delete-data"
  | "create-user"
  | "read-user"
  | "update-user"
  | "delete-user";

export type UserSchema = {
  name: string; // Username
  userId: string; // User identifier (email, enterprise id etc)
  hash: string; // User password hash
  rules: Array<AuthRules>; // Access Token Rule List
};

export type DataSchema = {
  userRef: ObjectId; //  User Collection _id reference
  answers: number[]; // Asnwer ranges (0-1) list
  surveyRef: ObjectId; // Survey Collection _id reference
};

export type SurveySchema = {
  created_at: Date; // Timestamp relative to Survey Creation
  active: boolean; // Survey active status
  questions: string[]; // List of Survey questions
};

export type AuthSchema = {
  token: string; // Hashed Access Token
  userId: UserSchema["userId"]; //  User Collection userId reference
  expires: Date; // Expiration Timestamp (to auto-delete)
};

export type Client = {
  user: Collection<UserSchema>;
  survey: Collection<SurveySchema>;
  data: Collection<DataSchema>;
  auth: Collection<AuthSchema>;
};

export type AutoId<G> = WithoutId<G>;
