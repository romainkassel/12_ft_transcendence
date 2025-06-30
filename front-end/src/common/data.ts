import { getToken } from "../auth.js";
import { jsEscape } from "./xssPrev.js";

export function getInputs()
{
    let dataToPost: {
        username: string,
        password: string,
        mail: string
    } = {
        username: "",
        password: "",
        mail: ""
    };

    const inputs = document.querySelectorAll("input");

    let value = "";

    for (let i = 0; i < inputs.length; i++)
    {
        Object.assign(dataToPost, { [inputs[i].id]: jsEscape(inputs[i].value) });
    }

    return (dataToPost);
}

export async function postReconnect()
{
    const token = getToken();

    try
    {
        const response = await fetch("https://{TRANSCENDENCE_IP}:8080/api/reconnect", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        return (response.status);
    }
    catch (error)
    {
        return (500);
    }
}

export async function fetchData(endpoint: string, data: object, method: string)
{
    const url = "https://{TRANSCENDENCE_IP}:8080/api" + endpoint;
    const token = getToken();

    try
    {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (response.status != 200 && response.status != 201)
        {
            return (response.status);
        }

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json'))
        {
            const responseJson = await response.json();
            return (responseJson);
        }

        return (response);
    }
    catch (error)
    {
        return (500);
    }
}

export async function getData(endpoint: string)
{
    const urlToFetch = "https://{TRANSCENDENCE_IP}:8080/api" + endpoint;

    const token = getToken();

    try
    {
        const response = await fetch(urlToFetch, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });

        if (response.status != 200 && response.status != 201)
        {
            return (response.status);
        }

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json'))
        {
            const responseJson = await response.json();
            return (responseJson);
        }

        return (response);
    }
    catch (error)
    {
        return (500);
    }
}
