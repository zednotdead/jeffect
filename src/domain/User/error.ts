import { Schema } from "effect";

export class CouldNotCreateUser extends Schema.TaggedError<CouldNotCreateUser>()("app/CouldNotCreateUser", {
  status: Schema.Number
}) {};
