const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect('mongodb://localhost/furry_friends', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));




// Define a user schema and models
const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    type: String
}));


// Handle form submission
app.use(express.urlencoded({ extended: true }));

app.post('/signup', async (req, res) => {
    try {
        const { username, email, password, type } = req.body;

        // Create a new user instance
        const newUser = new User({ username, email, password, type });
        await newUser.save();

        // Determine where to redirect based on user type
        if (type === 'client') {
            res.redirect('/store.html'); // Redirect to client.html for clients
        } else if (type === 'vet') {
            res.redirect('/vet.html'); // Redirect to vet.html for vets
        } else {
            res.redirect('/abc_copy.html'); // Redirect to a default page if type is unknown
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error signing up');
    }
});






const vetRecordSchema = new mongoose.Schema({
    petType: String,
    petName: String,
    ownerName: String,
    ownerPhone: String,
    petAge: String,
    purposeOfVisit: String
});

const vetrecords = mongoose.model('vetrecords', vetRecordSchema);

app.post('/vet', async (req, res) => {
    try {
        const { petType, petName, ownerName, ownerPhone, petAge, purposeOfVisit } = req.body;

        const newVetRecord = new vetrecords({ petType, petName, ownerName, ownerPhone, petAge, purposeOfVisit });
        await newVetRecord.save();

        res.status(200).send('Vet record saved successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving vet record');
    }
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}/abc_copy.html`);
});
