import { MongoClient } from 'mongodb';

export async function connectDB() {
  const client = await MongoClient.connect(
    `mongodb+srv://Jim:${process.env.MONGO_DB_PASS}@cluster0.jrvsz.mongodb.net/coffee-store?retryWrites=true&w=majority`
  );
  return client;
}

export async function insertDocument(client, collection, document) {
  const db = client.db();
  const result = await db.collection(collection).insertOne(document);
  return result;
}

export async function findDocumentByFilter(client, collection, filter) {
  const db = client.db();
  const document = await db.collection(collection).findOne(filter);

  return document;
};
