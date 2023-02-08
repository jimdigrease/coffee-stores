import { connectDB, findDocumentByFilter, updateDocument } from '../../utils/db-util';

const upVoteCoffeeStore = async (req, res) => {
  if (req.method === 'PUT') {
    const { id } = req.body;

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
          const incrementedVoting = parseInt(result.voting) + 1;

          try {
            const result = await updateDocument(
              client, 
              'coffee-stores', 
              { id: id },
              { $set: { voting: incrementedVoting } }
            );

            if (result) {
              res.status(201).json(result);
            } else {
              throw new Error()
            }

          } catch (err) {
            res.status(500).json({ message: 'Updating voiting failed!', error: err });
          }

        } else {
          res.json({ message: 'Coffee store id doesn\'t exist in DB', id });
        }

      } catch (err) {
        res.status(500);
        res.json({ message: 'Upvoting coffee store failed!', err });
      }

      client.close();
      
    } else {
      res.status(400);
      res.json({ message: "Id is missing" });
    }
  }
};

export default upVoteCoffeeStore;
