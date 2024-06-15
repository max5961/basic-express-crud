"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const root_1 = require("./routes/root");
const chat_1 = require("./routes/chat");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.set("views", "views");
app.use((req, res, next) => {
    console.log(`${req.method} ${req.protocol}://localhost:3000${req.originalUrl}`);
    next();
});
// body parser middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
/* Mostly serves /api/login */
app.use("/", root_1.rootRouter);
app.use("/chat", chat_1.chatRouter);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
