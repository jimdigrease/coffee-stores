import { connectDB, insertDocument, findDocumentByFilter } from '../../utils/db-util';

async function createCoffeeStore(req, res) {
  if (req.method === 'POST') {
    const { id, name, neighbourhood, address, imgUrl, voting } = req.body;

    if (id) {
      let client;

      try {
        client = await connectDB();
      } catch (err) {
        res.status(500).json({ message: 'Connection to Database failed!', error: err });
        return;
      }

      try {
        const result = await findDocumentByFilter(client, 'coffee-stores', { id: id });

        if (result !== null && typeof(result._id) === 'object') {

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
  
              if (result) {
                res.status(201).json({ newCoffeeStore });
              } else {
                throw new Error();
              }
  
            } catch (err) {
              res.status(500).json({ message: 'Inserting data failed!', error: err });
            }
  
          } else {
            res.status(400);
            res.json({ message: 'Id or name is missing' });
          }
        }

      } catch (err) {
        res.status(500);
        res.json({ message: 'Error creating or finding a store', err });
      }

      client.close();

    } else {
      res.status(400);
      res.json({ message: 'Id is missing' });
    } 
  }
}

export default createCoffeeStore;
