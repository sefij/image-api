import app from "./app";
import * as dotenv from "dotenv";

dotenv.config();
let configPath;
if (process.env.NODE_ENV === "dev") {
    configPath = '.env.development';
    dotenv.config({ path: configPath });
}


const PORT = normalizePort(process.env.PORT || '3000')
app.set('port', PORT);

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})

function normalizePort(value: any) {
    let port = parseInt(value, 10);

    if (isNaN(port)) {
        return value;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}