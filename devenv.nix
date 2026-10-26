{
  pkgs,
  lib,
  config,
  inputs,
  ...
}: let
  db = {
    name = "jeff";
    user = "jeff";
    pass = "jeff";
  };
in {
  env.DATABASE_URL = "postgres://${db.user}:${db.pass}@localhost:5432/${db.name}";

  languages.javascript = {
    enable = true;
    pnpm.enable = true;
  };
  languages.typescript.enable = true;

  services.adminer.enable = true;

  services.postgres = {
    enable = true;
    listen_addresses = "*";
    initialDatabases = [db];
  };
}
