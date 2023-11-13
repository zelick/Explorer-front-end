import { Message } from "./message.model";
import { Account } from "../../administration/model/account.model";

export interface SocialProfile {
    id?: number;
    username: string;
    followers: Account[];
    followed: Account[];
    messages: Message[];
}