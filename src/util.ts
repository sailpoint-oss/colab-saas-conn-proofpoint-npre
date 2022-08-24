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
            identity: user.id ? user.id.toString() : '',
            uuid: user.display_name ? user.display_name : '',
            attributes: {
                username: user.display_name ? user.display_name : '',
                id: user.id ? user.id : '',
                email: user.id ? user.id : '',
                risk: user.risk ? user.risk : '',
                vulnerablerisk: user.vulnerable_risk ? user.vulnerable_risk : '',
                privilegedrisk: user.privileged_risk ? user.privileged_risk : '',
                attackedrisk: user.attacked_risk ? user.attacked_risk : ''
                
            }
        }
    }
}