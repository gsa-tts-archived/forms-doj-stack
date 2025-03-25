import { createInMemoryDatabaseContext, createPostgresDatabaseContext } from '@gsa-tts/forms-database/context';
import { getAWSSecretsManagerVault } from '@gsa-tts/forms-infra-core';

import { createCustomServer } from './server.js';
import type { DatabaseContext } from '@gsa-tts/forms-database';

const port = process.env.PORT || 4321;

const dbUri = await getDatabaseUri();
let db: DatabaseContext;
if (dbUri) {
  console.log('Using Postgres database...');
  db = await createPostgresDatabaseContext(dbUri, true);
} else {
  console.log("Using in-memory (test) database...");
  db = await createInMemoryDatabaseContext();
}
const server = await createCustomServer(db);
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

async function getDatabaseUri() {
  if (process.env.DATABASE_URI) {
    return process.env.DATABASE_URI;
  }

  const secrets = {
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    dbSecret: process.env.DB_SECRET,
    dbSecretArn: process.env.DB_SECRET_ARN,
  };
  if (
    secrets.dbHost === undefined ||
    secrets.dbPort === undefined ||
    secrets.dbName === undefined ||
    (secrets.dbSecret === undefined && secrets.dbSecretArn === undefined)
  ) {
    return;
  }

  const vault = getAWSSecretsManagerVault();
  /*
  const dbSecret = await vault.getSecret(secrets.dbSecretArn);
  if (dbSecret === undefined) {
    console.error("Error getting secret:", secrets.dbSecretArn);
    return;
  }
  */
  const secret = JSON.parse(secrets.dbSecret || '{}');
  return `postgresql://${secret.username}:${secret.password}@${secret.host}:${secret.port}/${secret.dbname}`;
};
