import express from "express";
import path from "path";
import { userInfo, UserInfo } from "../db";

export const rootRouter = express.Router();

const scriptPath = path.join(__dirname, "../public", "root", "js");

// not sure why this wasn't loading the script
// rootRouter.use("/", express.static(scriptPath));

rootRouter.get("/script.js", (request, response) => {
    response.status(200).sendFile(path.join(scriptPath, "index.js"));
});

rootRouter.get("/", (request, response) => {
    response.render("index", {});
});

rootRouter.get("/api/login", (request, response) => {
    response.status(200).json(userInfo);
});

/* The frontend will make a fetch Request here */
rootRouter.post("/api/login", (request, response) => {
    const post = request.body as UserInfo;

    if (post.isLoggedIn === undefined || post.username === undefined) {
        return response.status(400).json({ msg: "You messed up bozo" });
    }

    userInfo.username = post.username;
    userInfo.isLoggedIn = post.isLoggedIn;

    response.status(200).json(userInfo);
});
