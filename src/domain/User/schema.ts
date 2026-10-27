import { Schema } from "effect";

export const UserId = Schema.Int.pipe(Schema.brand("UserId"))
export type UserId = typeof UserId.Type

export class User extends Schema.Class<User>("User")({
  id: UserId,
  name: Schema.String,
  age: Schema.Number,
  email: Schema.String,
}){}

export const UserCreate = Schema.Struct({
  name: Schema.String,
  age: Schema.Number.check(Schema.isGreaterThanOrEqualTo(18)),
  email: Schema.String,
})
