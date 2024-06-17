const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
})
.then(() => console.log('Conetado ao banco '))
.catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server rodando na porta: ${PORT}`));
