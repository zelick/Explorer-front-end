import { Account } from "../../administration/model/account.model";

export interface SocialProfile {
    id?: number;
    followers: Account[];
    followed: Account[];
    followable: Account[];
}