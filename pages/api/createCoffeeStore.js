import { connectDB, insertDocument, findDocumentByFilter } from '../../utils/db-util';

async function createCoffeeStore(req, res) {
  if (req.method === 'POST') {
    const { id, name, neighbourhood, address, imgUrl, voting } = req.body;

    let client;

    try {
      client = await connectDB();
    } catch (err) {
      res.status(500).json({ message: 'Connection to Database failed!', error: err });
      return;
    }

    if (id) {
      const result = await findDocumentByFilter(client, 'coffee-stores', { id: id });
      console.log(result);

      if (result !== null) {

        res.json(result);

      } else {
        //create a record
        if (name) {
          const newCoffeeStore = {
            id,
            name,
            address,
            neighbourhood,
            voting,
            imgUrl
          };
        
          try {
            const result = await insertDocument(client, 'coffee-stores', newCoffeeStore);
            console.log(result);
            if (result) {
              res.status(201).json({ newCoffeeStore });
            } else {
              throw new Error()
            }
          } catch (err) {
            res.status(500).json({ message: 'Inserting data failed!', error: err });
            client.close();
          }

        } else {
          res.status(400);
          res.json({ message: 'Id or name is missing' });
          client.close();
        }
      }

    } else {
      res.status(400);
      res.json({ message: 'Id is missing' });
      client.close();
    }
    client.close();
  }
};

export default createCoffeeStore;
