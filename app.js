require('dotenv').config();
const app = require('express')();

app.get('/', (req, res) => {
    res.send({
        message: 'docker is  successfully running the server on port 8080',
        success: true
    }).status(200);
})

app.listen(process.env.PORT, process.env.HOST, () => {
    console.log("Server is listening on port 8080");
})