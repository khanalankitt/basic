const express = require('express');
const mongoose = require('mongoose');
const Fact = require('./models/blog'); 
const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const url = process.env.URL;

mongoose.connect(url)
    .then(() => {
        console.log('Connected to db')
        app.listen(3000, () => {
            console.log(`Server is running on port 3000`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

app.get('/', (req, res) => {
    Fact.find()
        .then(result => res.render('home', { facts: result }))
        .catch(err => {
            console.error('Error fetching facts:', err);
            res.status(500).send('Internal Server Error');
        });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.get('/modify/:id', (req, res) => {
    const id = req.params.id;
    Fact.findById(id)
        .then(result => res.render('modify', { fact: result }))
        .catch(err => {
            console.error('Error fetching fact:', err);
            res.status(500).send('Internal Server Error');
        });
});

app.post('/modify/:id', (req, res) => {
    const id = req.params.id;
    Fact.findByIdAndUpdate(id, {
        name: req.body.name,
        fact: req.body.textarea
    })
        .then(() => res.redirect('/'))
        .catch(err => {
            console.error('Error updating fact:', err);
            res.status(500).send('Internal Server Error');
        });
});

app.post('/facts', (req, res) => {
    const fact = new Fact(req.body);
    fact.save()
        .then(() => res.redirect('/'))
        .catch(err => {
            console.error('Error saving fact:', err);
            res.status(500).send('Internal Server Error');
        });
});

app.get('/facts/:id', (req, res) => {
    const id = req.params.id;
    Fact.findById(id)
        .then(result => res.render('details', { fact: result }))
        .catch(err => {
            console.error('Error fetching fact details:', err);
            res.status(500).send('Internal Server Error');
        });
});

app.delete('/facts/:id', (req, res) => {
    const id = req.params.id;
    Fact.findByIdAndDelete(id)
        .then(() => res.json({ redirect: '/' }))
        .catch(err => {
            console.error('Error deleting fact:', err);
            res.status(500).send('Internal Server Error');
        });
});

app.use((req, res) => {
    res.status(404).render('error');
});



module.exports = app;