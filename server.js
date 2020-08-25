const express = require('express');
const mongoose = require('mongoose');
const db = require('./config/apiKey').mongoURI;
const ShrunkUrl = require('./models/shrunkUrl');
const app = express();

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error(err));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const shrunkUrls = await ShrunkUrl.find();
    res.render('index', { shrunkUrls: shrunkUrls })
});

app.post('/shorturls', async (req, res) => {
   await ShrunkUrl.create({
        full: req.body.fullUrl
    })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shrunkUrl = await ShrunkUrl.findOne({
        short: req.params.shortUrl
    })

    if (shrunkUrl == null) return res.sendStatus(404)

    shrunkUrl.clicks++
    shrunkUrl.save()
    res.redirect(shrunkUrl.full)
})

app.listen(process.env.PORT||5000);