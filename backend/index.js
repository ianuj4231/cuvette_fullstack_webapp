const express = require("express");
const mainRouter = require("./routes/index");
const cors = require("cors");
const app = express();
const PORT = 5000;
app.use(express.json());

// app.use(cors({origin: "https://cuvette-fullstack-webapp-58mz2saxt-ianuj4231s-projects.vercel.app"}));
app.use(cors());

app.use("/api/v1",  (req, res, next)=>{console.log("in serverxx");next();
} , mainRouter);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});

