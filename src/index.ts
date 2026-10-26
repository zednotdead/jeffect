import { Effect, Console } from "effect"
import { DatabaseLayer, DB } from "./connectors/db/index.js"
import { usersTable } from "./connectors/db/schema/user.js"

const program = Effect.gen(function* () {
  const db = yield* DB

  const result = yield* db
    .insert(usersTable)
    .values({ name: "beep", age: 18, email: "me@zed.gay" })
    .returning({ id: usersTable.id })

  yield* Console.log("Hello world!", result)

  const name = yield* Effect.succeed("Balls")

  yield* Console.log(`Hello, ${name}`)

  return name
})

await Effect.runPromise(program.pipe(Effect.provide(DatabaseLayer)))
