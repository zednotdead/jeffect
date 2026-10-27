import { Effect, Layer, Logger, Schema } from "effect"
import { DatabaseLayer, DB } from "./connectors/db/index.js"
import { TracingLayer } from "./connectors/tracing/index.js"
import { HttpRouter, HttpServerRequest, HttpServerResponse } from "effect/http"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { createServer } from "node:http"
import { sql } from "drizzle-orm"

const HelloRoute = HttpRouter.add(
  "GET",
  "/",
  Effect.gen(function* () {
    const hostHeadersSchema = Schema.Struct({ host: Schema.String });
    const headers = yield* HttpServerRequest.schemaHeaders(hostHeadersSchema);
    const db = yield* DB;

    const result = yield* db.execute<{ id: number }>(sql`SELECT 1 as "id";`);
    yield* Effect.log(result.rows)

    return yield* HttpServerResponse.json({ host: headers.host }, { status: 200 })
  }).pipe(Effect.withSpan("GET / HANDLER")),
)

const Routes = Layer.mergeAll(HelloRoute)

const ServerLayer = HttpRouter.serve(Routes).pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 }))
)

Layer.launch(ServerLayer).pipe(
  Effect.withSpan("program"),
  Effect.provide(Logger.layer([Logger.consoleLogFmt])),
  Effect.provide(DatabaseLayer),
  Effect.provide(TracingLayer),
  NodeRuntime.runMain
)
