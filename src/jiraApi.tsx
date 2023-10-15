import axios from 'axios';
import {Issue} from "./types";

const JIRA_BASE_URL = 'https://swiss-knife.i.siriusfrk.ru/api/v1/jira/tasks';

export async function searchJiraTasks(query: string): Promise<Issue[]> {
    const headers = {
        'Accept': 'application/json',
    };


    const getQuery = `${JIRA_BASE_URL}?jql=${encodeURIComponent(query)}`;

    const response = await axios.get(getQuery, { headers: headers });
    const data = response.data;

    return data.tasks;
}
