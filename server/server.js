const app = require('./app')

apiPort = 5000

app.listen(apiPort, () => {
    console.log(`app listening on port ${apiPort}`);
})