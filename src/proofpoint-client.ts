import {Config} from "./model/config";
import qs from "qs";
import axios, {AxiosResponse} from "axios";
import {User} from "./model/user";
import {ConnectorError, logger, StdTestConnectionOutput} from "@sailpoint/connector-sdk";

const tokenAPI = "https://auth.proofpoint.com/v1/token";
let accessToken: AxiosResponse<String> | void;
let incomingFilePath: AxiosResponse<any> | object;

export class ProofpointClient {
    private readonly clientId?: string;
    private readonly clientSecret?: string;

    constructor(config: Config) {
        // Fetch necessary properties from config.
        this.clientId = config.clientId;
        if (this.clientId == null) {
            throw new Error('apiKey must be provided from config')
        }

        this.clientSecret = config.clientSecret;
        if (this.clientSecret == null) {
            throw new Error('apiUsername must be provided from config')
        }
    }

    async testConnection(): Promise<StdTestConnectionOutput> {
        logger.info("In Test Connection- Proofpoint client");
        accessToken = await getToken(tokenAPI, this.clientId, this.clientSecret);
        if(!accessToken){
            throw new ConnectorError("Unable to connect to Proofpoint")
        }
        return {}
    }

    async getAllUsers(): Promise<Array<User>> {
        accessToken = await getToken(tokenAPI, this.clientId, this.clientSecret);
        console.log("Result is" + accessToken);

        incomingFilePath = await getFilePath();

        const response = await axios.get(incomingFilePath.toString());

        var split_Data = response.data.split('\n');
        split_Data = split_Data.splice(0,split_Data.length-1);
        var records = split_Data.map(function (record: any) {
            return JSON.parse(record)
        });

        const recordArray: Array<User> = [];

        for(const record of records){
            recordArray.push(record)
        }

        return recordArray;
    }

}

async function getFilePath() {
    console.log("Getting all accounts");

    var data = JSON.stringify({
        "operationName": "getPeopleGroups",
        "variables": {
            "time_series": "20220820"
        },
        "query": "query getPeopleGroups($time_series: DateTime){getPeopleGroups(time_series: $time_series) { file }}"
    });

    var config = {
        method: 'post',
        url: 'https://api.peoplecentric.proofpoint.com/graphql',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        data: data
    };

    return axios(config)
        .then(response =>
            response.data['data']['getPeopleGroups']['file']
        )
        .catch(function (error: any) {
            console.log(error);
        });
}

async function getToken(tokenAPI: string, clientId: string | undefined, clientSecret: string | undefined) {
    console.log("Entering getToken()");

    const data = qs.stringify({
        'grant_type': 'client_credentials',
        'client_id': clientId,
        'client_secret': clientSecret
    });
    const config = {
        method: 'post',
        url: tokenAPI,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    return axios(config)
        .then(response =>
            response.data['access_token']
        )
        .catch(function (error: any) {
            console.log(error);
        });
}




