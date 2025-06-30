import { displayAvatar, getAvatarPath } from "./common/avatar.js";
import { displayHeaderButton, headerButtonsData, insertHeaderButton, updateHeaderButton2 } from "./common/buttons.js";
import { createComponent } from "./common/components.js";
import { displayDialog, setDisabled } from "./common/dialogs.js";
import { handleRooting } from "./common/rooting.js";
import { sharedData } from "./common/store.js";
import { getTokenValue, insertInnerText } from "./common/username.js";
import { updateHeaderButton } from "./tournament.js";
import { loadDashboardView } from "./views/dashboardViews.js";

export function leaveMatch()
{
    if (sharedData.socket != null)
    {
        sharedData.socket.emit("ff");
		if (sharedData.localGame == true)
		{
			sharedData.socketListenners.matchListenners = false;
			sharedData.localGame = false;
			sharedData.isPlaying = false;
			sharedData.tournoi = false;		
            handleRooting("/dashboard", null, true);
		}
    }
}

async function displayResultList(data : any)
{
    const resultsPlaceholder = document.getElementById("match-results");

    if (resultsPlaceholder === null)
    {
        return ;
    }

    let username = ''
    if (data.winner_color)
        username = data.winner_color as string
    else if (data.id === -1)
        username = "Nobody (draw)"
    else
        username = data.winnername as string

    const usernameElement = document.getElementById("username-winner")

    if (usernameElement)
        usernameElement.innerText = username
}

export async function displayMatchResults(data : any)
{
    await displayDialog("display-match-results");
    displayResultList(data);
}

function updateAvatarPlaceholderId(clone: HTMLLIElement, i: number)
{
    const placeholder = clone.querySelector('[id="default-avatar-profile"]') as HTMLSpanElement;

    if (placeholder ===  null)
    {
        return ;
    }

    placeholder.id = "default-avatar-profile-" + i;
}

async function displayLocalLobby()
{
    const borderClasses = [
        "border-t-4",
        "border-b-4"
    ]

    const borderColors = [
        "border-switch1-100",
        "border-switch2-100"
    ]

    const playerList = document.getElementById("player-list");

    if (playerList === null || playerList.firstElementChild != null)
    {
        return ;
    }

    const classes = "w-full";

    const div = createComponent("div", classes, "lobby-player-card") as HTMLLIElement;

    let username = "";

    for (let i = 0; i < 2; i++)
    {
        const clone = div.cloneNode(true) as HTMLLIElement;
        clone.firstElementChild?.classList.add(borderClasses[i], borderColors[i]);

        username = "Player " + (i + 1);

        updateAvatarPlaceholderId(clone, i);
        insertInnerText(clone, "username", username);

        playerList.appendChild(clone);
    }
}

async function displayPlayerList()
{
    if (sharedData.localGame || sharedData.localGame2)
    {
        displayLocalLobby();
        sharedData.localGame2 = false;
        return ;
    }

    const borderClasses = [
        "border-t-4",
        "border-b-4",
        "border-l-4",
        "border-r-4"
    ]

    const playerList = document.getElementById("player-list");

    if (playerList === null || playerList.firstElementChild != null)
    {
        return ;
    }

    const classes = "w-full";

    const div = createComponent("div", classes, "player-card") as HTMLLIElement;

    let i = 0;

    let username = "";
    let userid = 0;

    while (sharedData.match.players[i])
    {
        const clone = div.cloneNode(true) as HTMLLIElement;
        clone.firstElementChild?.classList.add(borderClasses[i]);

        username = sharedData.match.players[i].username as string;
        userid = sharedData.match.players[i].id;

        updateAvatarPlaceholderId(clone, i);

        if (username === getTokenValue("username"))
        {
            clone.firstElementChild?.classList.replace("border-switch2-100", "border-switch1-100");
            insertInnerText(clone, "username", username + " (me)");
        }
        else
        {
            insertInnerText(clone, "username", username);
        }

        playerList.appendChild(clone);

        displayAvatar("default-avatar-profile-" + i, 12, await getAvatarPath(userid), username);

        i++;
    }
}

async function getPlayerListFromMatch()
{
    const match = document.getElementById("player-list");

    if (match === null)
    {
        return;
    }
}

export async function startMatch(dataAction: string, updateHistory: boolean)
{
    switch (window.location.pathname)
    {
        case "/dashboard":
            await getPlayerListFromMatch();
            break;
        case "/invite-friends":
            await getPlayerListFromMatch();
            break;
        case "/tournament":
            break;
    }

    await loadDashboardView("/match", true);
}

async function displayLobbyPlayers()
{
    await displayPlayerList();
    await displayHeaderButton(null);
}

export async function init()
{
    //console.log("sharedData.localGame: ", sharedData.localGame);
    //console.log("sharedData.localGame2: ", sharedData.localGame2);

    displayLobbyPlayers()

    if (sharedData.socket != null)
    {
        if (sharedData.isPlaying == true)
            start();
        else
            handleRooting("/dashboard", null , true);
    }
}

export function getReady()
{
	sharedData.socket.emit("ready");
}

async function start()
{
    if ((sharedData.match.players).length === 0)

        sharedData.socket.emit("redisplay match", (data: any, flag : boolean) => {

            if (flag === false)
            {
                sharedData.match.players = data;
                displayLobbyPlayers();
            }
        })

	sharedData.socket.emit("get game attributs");
}

export function movePlayer(event : any)
{
	const keyName = event.key;
	if (keyName === "ArrowRight") {
		sharedData.socket.emit("move player", "right");
	}
	else if (keyName === "w") {
		sharedData.socket.emit("move player", "up");
	}
	else if (keyName === "ArrowLeft") {
		sharedData.socket.emit("move player", "left");
	}
	else if (keyName === "s") {
		sharedData.socket.emit("", "down");
	}
	else if (keyName === "q")
	{
		sharedData.socket.emit("move player", "q");
	}
	else if (keyName === "d")
	{
		sharedData.socket.emit("move player", "d");
	}
}

export async function updateMatchButtons()
{
    const button_ready = document.getElementById("header-button") as HTMLButtonElement
    if (button_ready)
        button_ready.disabled = false

    if (window.location.pathname === "/match")
    {
        updateHeaderButton("Leave match", "leave-match", "warning", 0);
    }
    else
    {
        updateHeaderButton("Leave tournament", "leave-tournament", "warning", 0);
    }

    const headerButtonData = headerButtonsData.find(headerButtonData => headerButtonData.pathname === "pause");

    if (headerButtonData === undefined)
    {
        return ;
    }

    await insertHeaderButton();
    updateHeaderButton2(headerButtonData, 1);
}

export function pauseMatch(dataAction: string)
{
    const button = document.querySelector('[data-action="pause-match"]') as HTMLButtonElement;

	if (button === null)
    {
        return;
    }

    setDisabled(button);

    if (sharedData.socket != null)
    {
        sharedData.socket.emit("start pause");
    }
}

export function stopPause()
{
    const button = document.querySelector('[data-action="pause-match"]') as HTMLButtonElement;

    if (button === null)
    {
        return;
    }

    button.disabled = false;
    button.classList.remove("disabled:bg-gray-200", "cursor-not-allowed");
}