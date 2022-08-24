import {
    Context,
    createConnector,
    readConfig,
    Response,
    StdAccountListOutput,
    StdTestConnectionOutput,
} from '@sailpoint/connector-sdk'
import { ProofpointClient } from './proofpoint-client'
import {Util} from "./util";

// Connector must be exported as module property named connector
export const connector = async () => {

    // Get connector source config
    const config = await readConfig();

    // Use the vendor SDK, or implement own client as necessary, to initialize a client
    const proofpointClient = new ProofpointClient(config);

    const util = new Util();

    return createConnector()
        .stdTestConnection(async (context: Context, input: undefined, res: Response<StdTestConnectionOutput>) => {
            console.log("Running test connection");
            await proofpointClient.testConnection();
        })

        .stdAccountList(async (context: Context, input: undefined, res: Response<StdAccountListOutput>) => {
            console.log('listing accounts')
            const users = await proofpointClient.getAllUsers();
            for (const user of users) {
                res.send(util.userToAccount(user))
            }
        })
}
