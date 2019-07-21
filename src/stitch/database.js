import { Stitch, RemoteMongoClient } from "mongodb-stitch-browser-sdk";

const APP_ID = "resp-nqkab";

const stitchClient = Stitch.hasAppClient(APP_ID)
  ? Stitch.getAppClient(APP_ID)
  : Stitch.initializeDefaultAppClient(APP_ID);

const mongoClient = stitchClient.getServiceClient(
  RemoteMongoClient.factory,
  "mongodb-atlas"
);

const db = mongoClient.db("sample_disaster");

export { stitchClient, db }
