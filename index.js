const express = require('express');
const cors = require('cors');
require("dotenv").config();
const port = 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.spi2p1g.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const usersCollection = client.db('eduvians').collection('users');
        const cgpaCollection = client.db('eduvians').collection('cgpa');
        app.post('/users', async (req, res) => {
            const user = req.body;

            const copiedUser = await usersCollection.findOne(user);
            if (!copiedUser) {

                await usersCollection.insertOne(user);
            }
            res.status(200).send({ acknowledged: 'successfull' })
        });
        app.post('/cgpa', async (req, res) => {
            try {
                const cgpa = req.body;
                const result = await cgpaCollection.insertOne(cgpa);
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: 'Internal Server Error' });
            }
        });
        app.get('/cgpa/:email', async (req, res) => {
            try {
                const email = req.params.email;
                const cgpa = await cgpaCollection.find({ email }).toArray();
                res.send(cgpa);
            } catch (error) {
                res.status(500).send({ error: 'Internal Server Error' });
            }
        })
        app.delete('/tasks/my-tasks/:id', async (req, res) => {
            const id = req.params.id;

            const filter = { _id: ObjectId(id) };
            const task = await cgpaCollection.deleteOne(filter);

            res.send(task);
        });
    }
    finally {

    }
}
run().catch(console.log);




app.get('/', async (req, res) => {
    res.send('EDUvians server is running');
})

app.listen(port, () => console.log(`EDUvians running on ${port}`))