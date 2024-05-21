const express = require("express");
const app = express();

const { logUser } = require("./logger");
const customHeader = require("./custom_header");

const taskRouter = require("./routes/task");
const { connectDb } = require("./connection");

const port = process.env.PORT ?? 3001;

// middleware for parsing URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Custom middleware - Log rest api
app.use(logUser);
app.use(customHeader);

// Connect to mongoDb Database
const mongoUrl =
  "mongodb+srv://xubair305:pdg7oxPGOTQsezad@jubair.idip1jq.mongodb.net/";
connectDb(mongoUrl ?? "mongodb://127.0.0.1:27017/todo-app");

//  Setup routes
app.use("/api/task", taskRouter);

app.get("/", (req, res) => res.send("Hello World!"));
app.get("*", (req, res) => {
  res.status(501).send("PAGE NOT FOUND");
});

app.listen(port, () => console.log(`TODO app listening on port ${port}!`));
