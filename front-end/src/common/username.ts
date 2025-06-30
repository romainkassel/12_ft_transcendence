import { getToken, decodeToken } from "../auth.js";

export function getTokenValue(key: string)
{
    const token = getToken() as string;

    if (token === undefined)
    {
        return ;
    }

    const decodedToken = decodeToken(token);

    const value = decodedToken[key];

    return (value)
}

export function displayUsername(placeholder: string)
{
    const id = "username-" + placeholder;
    const placeholders = document.querySelectorAll(`[id='${id}']`);

    if (placeholders === null)
    {
        return ;
    }

    const username = getTokenValue("username");

    for (let i = 0; i < placeholders.length; i++)
    {
        const placeholder = placeholders[i] as HTMLElement;
        placeholder.innerText = username;
    }
}

export function insertInnerText(element: HTMLElement, id: string, text: string)
{
    const usernamePlaceholder = element.querySelector(`[id='${id}']`) as HTMLElement;

    if (usernamePlaceholder === null)
    {
        return ;
    }

    usernamePlaceholder.innerText = text;
}