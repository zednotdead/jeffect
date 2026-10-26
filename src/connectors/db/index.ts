import * as PgDrizzle from "drizzle-orm/effect-postgres"
import * as relations from "./relations/index.js"
import { Context, Effect, Layer, Redacted } from "effect"
import { PgClient } from "@effect/sql-pg"

const dbEffect = PgDrizzle.make({ relations }).pipe(Effect.provide(PgDrizzle.DefaultServices))

export class DB extends Context.Service<DB, Effect.Success<typeof dbEffect>>()("DB") {}

export const DBLive = Layer.effect(
  DB,
  Effect.gen(function* () {
    return yield* dbEffect
  }),
)

export const PGClientLive = PgClient.layer({
  url: Redacted.make(process.env.DATABASE_URL!),
})

export const DatabaseLayer = Layer.provideMerge(DBLive, PGClientLive)
