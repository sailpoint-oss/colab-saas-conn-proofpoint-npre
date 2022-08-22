import {StdAccountCreateOutput} from "@sailpoint/connector-sdk";
import {User} from "./model/user";

export class Util {

    /**
     * converts user object to IDN account output
     *
     * @param {User} user User object
     * @returns {StdAccountCreateOutput} IDN account create object
     */
    public userToAccount(user: User): StdAccountCreateOutput {
        return {
            // Convert id to string because IDN doesn't work well with number types for the account ID
            identity: user.display_name ? user.display_name.toString() : '',
            uuid: user.id ? user.id : '',
            attributes: {
                id: user.id ? user.id : '',
                username: user.display_name ? user.display_name : '',
                email: user.id ? user.id : '',
                riskScore: user.risk ? user.risk : ''
            }
        }
    }
}