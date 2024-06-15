import express from "express";
import path from "path";
import { userInfo, UserInfo, chatLog, ChatLog } from "../db";

let prevId = -1;

export const chatRouter = express.Router();

const scriptPath: string = path.join(__dirname, "../public", "chat", "js");

/* Render chat.ejs */
chatRouter.get("/", (req, res) => {
    res.render("chat", {
        title: `Welcome ${userInfo.username}`,
    });
});

/* Load script.js */
chatRouter.get("/script.js", (req, res) => {
    res.status(200).sendFile(path.join(scriptPath, "index.js"));
});

/* GET chatlog data */
chatRouter.get("/api/chatlog", (req, res) => {
    res.status(200).json(chatLog);
});

/* POST chatlog */
chatRouter.post("/api/chatlog", (req, res) => {
    const message: string = req.body?.message;
    const username: string = userInfo.username;
    const id: number = ++prevId;

    if (!req.body || !message) {
        return res.status(404).json({ msg: "you don goofed" });
    }

    chatLog.push({ id, message, username });

    res.status(200).json(chatLog);
});

/* DELETE a message */
chatRouter.delete("/api/chatlog/:id", (req, res) => {
    const id = Number(req.params.id);

    let indexOf: undefined | number;
    for (let i = 0; i < chatLog.length; ++i) {
        if (chatLog[i].id === id) {
            indexOf = i;
        }
    }

    if (indexOf === undefined) {
        return res.status(404).json({ msg: "You don goofed loser" });
    } else {
        chatLog.splice(indexOf, 1);
    }

    res.status(200).json(chatLog);
});

chatRouter.get("/api/chatlog/:id", (req, res) => {
    const id = Number(req.params.id);
    const message = chatLog.filter((l) => l.id === id);

    if (!message.length) {
        return res.status(404).json({ msg: `ummm '${id}' has no posts bro` });
    }

    res.status(200).json(message[0]);
});

chatRouter.put("/api/chatlog", (req, res) => {
    const id = req.body?.id;

    if (!req.body || id === undefined) {
        if (!chatLog.find((message) => message.id === id)) {
            return sendErr();
        }
    }

    let toReplace: number | undefined;
    for (let i = 0; i < chatLog.length; ++i) {
        const message = chatLog[i];
        if (message.id === id) {
            toReplace = i;
            break;
        }
    }

    if (toReplace === undefined) {
        return sendErr();
    }

    chatLog[toReplace] = req.body;

    res.status(200).json(chatLog);

    function sendErr() {
        res.status(404).json({ msg: "You done fucked up buddy boy" });
    }
});
