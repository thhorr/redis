const connect = require("./configs/db");

const app = require("./index");





app.listen(3000, async function() {
    await connect();



    console.log("Listening on port 3000");
})

