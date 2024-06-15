export interface UserInfo {
    username: string;
    isLoggedIn: boolean;
}

export type ChatLog = { id: number; username: string; message: string }[];

export const userInfo: UserInfo = {
    username: "",
    isLoggedIn: false,
};

export const chatLog: ChatLog = [];
