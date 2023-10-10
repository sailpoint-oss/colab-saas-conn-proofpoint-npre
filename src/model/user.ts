import {Group} from "./group";

export class User {

    id?: string;
    display_name?: string;
    title?: string;
    department?: boolean;
    seniority?: boolean;
    business_functions?: boolean;
    risk?: number;
    vulnerable_risk?: number;
    privileged_risk?: number;
    attacked_risk?: number;
    groups?: Group
    
}