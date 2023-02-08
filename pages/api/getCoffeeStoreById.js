import { connectDB, findDocumentByFilter } from '../../utils/db-util';

async function getCoffeeStoreById(req, res) {
  
  if (req.method === 'GET') {
    const { id } = req.query;

    try {
      if (id) {
        let client;

        try {
          client = await connectDB();
        } catch (err) {
          res.status(500).json({ message: 'Connection to Database failed!', error: err });
          return;
        }

        const result = await findDocumentByFilter(client, 'coffee-stores', { id: id });

        if (result !== null && typeof(result._id) === 'object') {
          res.json(result);
        } else {
          res.json({ message: `id "${id}" could not be found` });
        }
  
        client.close();

      } else {
        res.json({ message: 'Id is missing' });
      }
    } catch (error) {
      res.status(500);
      res.json({ message: 'Something went wrong', error });
    }  
  }
}

export default getCoffeeStoreById;
