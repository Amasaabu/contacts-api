const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const {initializeJSONFile} = require('./services/file');
app.use(express.json());

//make frontend files available and static
app.use(express.static('public'))

//serve the frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.use("/api", require('./routes/contacts.routes'));


const startApp=async()=>{
    await initializeJSONFile();
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}


startApp();
