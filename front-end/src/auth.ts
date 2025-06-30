import { fetchData, getInputs } from "./common/data.js";
import { displayDialog } from "./common/dialogs.js";
import { handleRooting } from "./common/rooting.js";
import { displayToast } from "./common/toasts.js";
import { loadMainView } from "./views/mainViews.js";
import { sharedData } from "./common/store.js";
import { jsEscape } from "./common/xssPrev.js";
import { createSocket, waitForSocket } from "./socket.js";

export async function handle2fa()
{
    const dataToPost = {};

    const button = document.querySelector('[data-action="handle-2fa"]') as HTMLButtonElement;

    if (button === null)
    {
        return ;
    }

    let endpoint = "";
    let innerText = "";
    let error = "";
    let success = "";

    switch (button.innerText)
    {
        case "Enable 2FA":
            endpoint = "/enable";
            innerText = "Disable";
            error = "enable";
            success = "enabled";
            break;
        case "Disable 2FA":
            endpoint = "/disable";
            innerText = "Enable";
            error = "disable";
            success = "disabled";
            break;
    }

    const responseJson = await fetchData(endpoint + "-2fa", dataToPost, "POST");

    if (typeof responseJson === "number")
    {
        displayToast("Can't " + error + " 2FA", "error");
        return ;
    }

    button.innerText = innerText + " 2FA";

    displayToast("2FA has been " + success, "success");
}

export async function signout()
{
	sharedData.isPlaying = false;
	sharedData.localGame = false;
	sharedData.tournoi = false;
    const dataToSend = {};
	sharedData.socket.emit("ff");
	sharedData.socket.emit("remove auth");
	// sharedData.socket.removeAllListeners();
	sharedData.socket.disconnect();
	sharedData.socket = null;

    const responseJson = await fetchData("/logout", dataToSend, "POST");

    if (typeof responseJson === "number")
    {
        displayToast("Can't logout", "error");
        return ;
    }

    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    localStorage.clear();

    //loadMainView("/login", true);

    displayToast(responseJson.message, "success");
	createSocket();
	waitForSocket();
}

export function decodeToken(token: string)
{
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");

    return (JSON.parse(window.atob(base64)));
}

export function getToken()
{
    const cookies = document.cookie.split('; ');

    let cookieLine = [];

    for (let i = 0; i < cookies.length; i++)
    {
        cookieLine = cookies[i].split('=');

        if (cookieLine[0] === "token")
        {
            return (cookieLine[1]);
        }
    }

    return (undefined);
}

async function logUser(endpoint: string)
{
    await handleRooting("/dashboard", null, true);

    switch (endpoint)
    {
        case "/signin":
            displayToast("Your account has been successfully created.", "success");
            break;

        case "/login":
        case "/verify-2fa":
            displayToast("You have been successfully connected.", "success");
    }
}

export function getInputValue(id: string)
{
    const input = document.getElementById(id) as HTMLInputElement;

    if (input === null)
    {
        return ;
    }

    return (jsEscape(input.value));
}

function setToken(newToken: string)
{
    const currentToken = getToken() as string;

    if (currentToken != undefined)
    {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    }

    document.cookie = "token=" + newToken;
}

export async function handle2faFromLogin()
{
    const dataToPost = {
        username: localStorage.getItem("username"),
        fa2_code: getInputValue("2fa-code")
    };

    const endpoint = "/verify-2fa";

    const responseJson = await fetchData(endpoint, dataToPost, "POST");

    if (typeof responseJson === "number")
    {
        displayToast("Can't login", "error");
        return ;
    }

    setToken(responseJson.token);

    logUser(endpoint);
}

export async function handleAuth()
{


    let endpoint = "/login";

    if (window.location.pathname === "/signup")
    {
        endpoint = "/signin";
    }

    const dataToPost = getInputs();

    const responseJson = await fetchData(endpoint, dataToPost, "POST");

    if (responseJson === 420)
    {
        localStorage.setItem("username", dataToPost.username);
        displayDialog("handle2faFromLogin");
        return ;
    }

    if (typeof responseJson === "number")
    {
        if (endpoint === "/signin")
        {
            displayToast("Can't signin", "error");
        }
        else
        {
            displayToast("Can't login", "error");
        }
        return ;
    }

    setToken(responseJson.token);
	if (sharedData.socket != null)
	{
		sharedData.socket.emit("auth", responseJson.token, (data : boolean) => {

				if (sharedData.isPlaying == true)
				{
					handleRooting("/match", null, true);
				}
				else if (data == true)
					logUser(endpoint);
		});
	}

}