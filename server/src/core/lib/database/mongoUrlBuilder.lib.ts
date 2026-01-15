// mongoUrlBuilder.lib.ts;
export function buildMongoUrl(params: {
  user: string;
  pass: string;
  db: string;
  appName: string;
}) {
  const { user, pass, db, appName } = params;

  if (!user || !pass || !db) {
    throw new Error("Missing MongoDB credentials");
  }

  return `mongodb+srv://${user}:${encodeURIComponent(pass)}@${
    process.env.MONGO_CLUSTER_HOST
  }/${db}?appName=${appName}&retryWrites=true&w=majority`;
}
