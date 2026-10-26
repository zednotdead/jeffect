import { Effect, Console, Logger } from "effect"
import { DatabaseLayer, DB } from "./connectors/db/index.js"
import { usersTable } from "./connectors/db/schema/user.js"
import { TracingLayer } from "./connectors/tracing/index.js"

const program = Effect.gen(function* () {
  const db = yield* DB

  const result = yield* db
    .insert(usersTable)
    .values({ name: "beep", age: 18, email: "me@zed.gay" })
    .returning({ id: usersTable.id })

  yield* Effect.logWarning("Hello world!", result)

  const name = yield* Effect.succeed("Balls")

  yield* Effect.logInfo(`Hello, ${name}`)

  return name
}).pipe(
  Effect.withSpan("program"),
  Effect.provide(Logger.layer([Logger.consoleLogFmt])),
  Effect.provide(DatabaseLayer),
  Effect.provide(TracingLayer)
)

await Effect.runPromise(program)
