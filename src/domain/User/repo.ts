import { Array, Context, Effect, Layer, Option, Schema } from "effect"
import { User, type UserCreate } from "./schema.js"
import { DatabaseLayer, DB } from "../../connectors/db/index.js"
import { usersTable } from "../../connectors/db/schema/user.js"
import { eq } from "drizzle-orm"
import { CouldNotCreateUser } from "./error.js"

export class UserRepo extends Context.Service<
  UserRepo,
  {
    create(newUser: typeof UserCreate.Type): Effect.Effect<User, CouldNotCreateUser>
  }
>()("app/UserRepo") {
  static readonly layer = Layer.effect(
    UserRepo,
    Effect.gen(function* () {
      const db = yield* DB

      const create = Effect.fn("UserRepo.create")(function* (newUser: typeof UserCreate.Type) {
        const results = yield* db
          .insert(usersTable)
          .values(newUser)
          .returning({ id: usersTable.id })
          .pipe(Effect.catch(() => Effect.fail(new CouldNotCreateUser({ status: 500 }))))

        const id = yield* Array.head(results).pipe(
          Option.match({
            onNone: () => Effect.fail(new CouldNotCreateUser({ status: 500 })),
            onSome: ({ id }) => Effect.succeed(id),
          }),
        )

        const [newlyCreatedUser] = yield* db
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, id))
          .pipe(Effect.catch(() => Effect.fail(new CouldNotCreateUser({ status: 500 }))))

        const user = yield* Schema.decodeUnknownEffect(User)(newlyCreatedUser).pipe(
          Effect.catch(() => Effect.fail(new CouldNotCreateUser({ status: 500 }))),
        )

        return user
      })

      return UserRepo.of({
        create,
      })
    }),
  ).pipe(Layer.provide(DatabaseLayer))
}
