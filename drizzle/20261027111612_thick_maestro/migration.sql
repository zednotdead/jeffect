CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"name" varchar NOT NULL,
	"age" integer NOT NULL,
	"email" varchar NOT NULL
);
