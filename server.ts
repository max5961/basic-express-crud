import express from "express";
import { rootRouter } from "./routes/root";
import { chatRouter } from "./routes/chat";

const app = express();
const PORT: string | number = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
    console.log(
        `${req.method} ${req.protocol}://localhost:3000${req.originalUrl}`,
    );
    next();
});

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Mostly serves /api/login */
app.use("/", rootRouter);

app.use("/chat", chatRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
