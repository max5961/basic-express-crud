"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const db_1 = require("../db");
let prevId = -1;
exports.chatRouter = express_1.default.Router();
const scriptPath = path_1.default.join(__dirname, "../public", "chat", "js");
/* Render chat.ejs */
exports.chatRouter.get("/", (req, res) => {
    res.render("chat", {
        title: `Welcome ${db_1.userInfo.username}`,
    });
});
/* Load script.js */
exports.chatRouter.get("/script.js", (req, res) => {
    res.status(200).sendFile(path_1.default.join(scriptPath, "index.js"));
});
/* GET chatlog data */
exports.chatRouter.get("/api/chatlog", (req, res) => {
    res.status(200).json(db_1.chatLog);
});
/* POST chatlog */
exports.chatRouter.post("/api/chatlog", (req, res) => {
    var _a;
    const message = (_a = req.body) === null || _a === void 0 ? void 0 : _a.message;
    const username = db_1.userInfo.username;
    const id = ++prevId;
    if (!req.body || !message) {
        return res.status(404).json({ msg: "you don goofed" });
    }
    db_1.chatLog.push({ id, message, username });
    res.status(200).json(db_1.chatLog);
});
/* DELETE a message */
exports.chatRouter.delete("/api/chatlog/:id", (req, res) => {
    const id = Number(req.params.id);
    let indexOf;
    for (let i = 0; i < db_1.chatLog.length; ++i) {
        if (db_1.chatLog[i].id === id) {
            indexOf = i;
        }
    }
    if (indexOf === undefined) {
        return res.status(404).json({ msg: "You don goofed loser" });
    }
    else {
        db_1.chatLog.splice(indexOf, 1);
    }
    res.status(200).json(db_1.chatLog);
});
exports.chatRouter.get("/api/chatlog/:id", (req, res) => {
    const id = Number(req.params.id);
    const message = db_1.chatLog.filter((l) => l.id === id);
    if (!message.length) {
        return res.status(404).json({ msg: `ummm '${id}' has no posts bro` });
    }
    res.status(200).json(message[0]);
});
exports.chatRouter.put("/api/chatlog", (req, res) => {
    var _a;
    const id = (_a = req.body) === null || _a === void 0 ? void 0 : _a.id;
    if (!req.body || id === undefined) {
        if (!db_1.chatLog.find((message) => message.id === id)) {
            return sendErr();
        }
    }
    let toReplace;
    for (let i = 0; i < db_1.chatLog.length; ++i) {
        const message = db_1.chatLog[i];
        if (message.id === id) {
            toReplace = i;
            break;
        }
    }
    if (toReplace === undefined) {
        return sendErr();
    }
    db_1.chatLog[toReplace] = req.body;
    res.status(200).json(db_1.chatLog);
    function sendErr() {
        res.status(404).json({ msg: "You done fucked up buddy boy" });
    }
});
