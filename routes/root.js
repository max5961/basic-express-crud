"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootRouter = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const db_1 = require("../db");
exports.rootRouter = express_1.default.Router();
const scriptPath = path_1.default.join(__dirname, "../public", "root", "js");
// not sure why this wasn't loading the script
// rootRouter.use("/", express.static(scriptPath));
exports.rootRouter.get("/script.js", (request, response) => {
    response.status(200).sendFile(path_1.default.join(scriptPath, "index.js"));
});
exports.rootRouter.get("/", (request, response) => {
    response.render("index", {});
});
exports.rootRouter.get("/api/login", (request, response) => {
    response.status(200).json(db_1.userInfo);
});
/* The frontend will make a fetch Request here */
exports.rootRouter.post("/api/login", (request, response) => {
    const post = request.body;
    if (post.isLoggedIn === undefined || post.username === undefined) {
        return response.status(400).json({ msg: "You messed up bozo" });
    }
    db_1.userInfo.username = post.username;
    db_1.userInfo.isLoggedIn = post.isLoggedIn;
    response.status(200).json(db_1.userInfo);
});
