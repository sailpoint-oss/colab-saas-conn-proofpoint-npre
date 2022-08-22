import {
    Context,
    createConnector,
    readConfig,
    Response,
    logger,
    StdAccountListOutput,
    StdAccountReadInput,
    StdAccountReadOutput,
    StdTestConnectionOutput,
} from '@sailpoint/connector-sdk'
import { ProofpointClient } from './proofpoint-client'
import {Util} from "./util";

// Connector must be exported as module property named connector
export const connector = async () => {

    // Get connector source config
    const config = await readConfig()

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
        // .stdAccountRead(async (context: Context, input: StdAccountReadInput, res: Response<StdAccountReadOutput>) => {
        //     const account = await myClient.getAccount(input.identity)
        //
        //     res.send({
        //         identity: account.username,
        //         uuid: account.id,
        //         attributes: {
        //             firstName: account.firstName,
        //             lastName: account.lastName,
        //             email: account.email,
        //         },
        //     })
        //     logger.info(`stdAccountRead read account : ${input.identity}`)
        //
        // })
}
