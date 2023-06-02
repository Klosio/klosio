import app from "./app"
import connectDB from "./db/conn"

const port = process.env.PORT || 3000

connectDB()
    .then(() =>
        app.listen(port, () =>
            console.log(
                `Database connection is ready and server is listening: http://localhost:${port}`
            )
        )
    )
    .catch((err) =>
        console.error(`Error while connecting to the database: ${err}`)
    )
