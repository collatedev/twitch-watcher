require('dotenv').config();
const app = require('express')();

app.get('/', (req, res) => {
    res.send({
        message: 'docker is now successfully running the server on port 8080',
        success: true
    }).status(200);
})

app.listen(process.argv[2], () => {
    console.log(`Server is listening on port ${process.argv[2]}`);
})