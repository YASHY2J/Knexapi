const express = require('express');
const bodyParser = require('body-parser');
const { Model } = require('objection');
const Knex = require('knex');
const jwt = require('jsonwebtoken');
const knexConfig = require('./db/knexfile');
const User = require('./db/models/user');

const knex = Knex(knexConfig.development);
Model.knex(knex);

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
const JWT_SECRET_KEY = 'SECRET';

app.post('/register', async (req, res) => {
    try {
        const { name, password, email } = req.body;
        const newUser = await User.query().insert({ name, password, email });
        res.json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.query().findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isValidPassword = await user.verifyPassword(password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET_KEY, {
            expiresIn: '1h',
        });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.query();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
