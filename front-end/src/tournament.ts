import { displayHeaderButton, headerButtonsData, insertHeaderButton, removeDisabledButton, removeHeaderButtons, updateHeaderButton2, updateStyle } from "./common/buttons.js";
import { sharedData } from "./common/store.js";
import { getTokenValue, insertInnerText } from "./common/username.js";
import { sanitizeHTML } from "./common/xssPrev.js";
import { getInvitedFriendCard, getUsername } from "./invite-friends.js";
import { loadDashboardView } from "./views/dashboardViews.js";
import { getInputValue } from "./auth.js";
import { createComponent } from "./common/components.js";
import { displayAvatar, getAvatarPath } from "./common/avatar.js";
import { displayToast } from "./common/toasts.js";
import { tournoi } from "./tournoi.js";
import { displayDialog } from "./common/dialogs.js";
import { handleRooting } from "./common/rooting.js";
import { leaveMatch } from "./match.js";

export async function addUsername(button: HTMLButtonElement, dataAction: string)
{
    const buttonId = button.id;

    await displayDialog(dataAction);

    const submitButton = document.getElementById("submit-button");

    if (submitButton === null)
    {
        return ;
    }

    submitButton.setAttribute("data-action", buttonId);
}

function updateOpacity(id: string, opacity: number)
{
    const el = document.getElementById(id);

    if (el ===  null)
    {
        return ;
    }

    if (opacity === 100)
    {
        el.classList.replace("opacity-25", "opacity-100");
    }
    else
    {
        el.classList.replace("opacity-100", "opacity-25");
    }
}

export function updateHeaderButton(innerText: string, dataAction: string, style: string, index: number)
{
    const parent = document.getElementById("header-button-placeholder") as HTMLDivElement;

    if (parent ===  null)
    {
        return ;
    }

    const button = parent.children[index] as HTMLButtonElement;

    button.innerText = innerText;
    button.setAttribute("data-action", dataAction);
    updateStyle(button, style);
}

async function updatePlayer(currentMatch: number, player: number)
{
    const placeholder = document.getElementById("username");

    if (placeholder === null)
    {
        return ;
    }

    let username = "";

    if (currentMatch === 3)
    {
        username = sharedData.tournament.matches[2].winner?.username as string;
    }
    else
    {
        username = sharedData.tournament.matches[currentMatch].players[player].username as string;
    }

    placeholder.innerText = username;

    const avatar = document.getElementById("avatar");

    if (avatar === null)
    {
        return ;
    }

    placeholder.id = "set_username";

    const avatarId = "default-avatar-" + currentMatch + "-" + player;

    const classes = "size-12 shrink-0 rounded-full bg-gray-100 size-12 rounded-full bg-gray-100 text-center content-center uppercase font-bold content-center uppercase font-bold";
    const span = createComponent("span", classes, null) as HTMLSpanElement;
    span.id = avatarId;
    avatar.replaceWith(span);

    let path = null;

    if (username === getTokenValue("username"))
    {
        path = await getAvatarPath(-1);
    }

    displayAvatar(avatarId, 12, path, username);
}

function updateBorders(id: string)
{
    const match = document.getElementById(id);

    if (match === null)
    {
        return ;
    }

    match.children[0].classList.add("border-switch1-100");
    match.children[1].classList.add("border-switch2-100");
}

export function startTournament()
{
	var t = new tournoi(sharedData.tournament.players)
	t.startTournament(0);
    for (let i = 0; i < 3; i++)
    {
        sharedData.tournament.matches.push({
            id: i,
            currentUser: null,
            playerNumber: 2,
            players: [],
            winner: null
        });
    }

    sharedData.tournament.matches[0].players.push(sharedData.tournament.players[0]);
    sharedData.tournament.matches[0].players.push(sharedData.tournament.players[1]);
    sharedData.tournament.matches[1].players.push(sharedData.tournament.players[2]);
    sharedData.tournament.matches[1].players.push(sharedData.tournament.players[3]);

    updateOpacity("round1-h3", 100);
    displayNextMatch();
}

export function updateRound1Card(selectedCard: HTMLButtonElement)
{
    const playerPlaceholder = document.getElementById("player-placeholder");

    if (playerPlaceholder ===  null)
    {
        return ;
    }

    playerPlaceholder.innerHTML = sanitizeHTML(getInvitedFriendCard());
    playerPlaceholder.removeAttribute("id");
    const userName = getUsername(selectedCard) as string;
    insertInnerText(playerPlaceholder, "username", userName);
}

export async function findTournament()
{
    sharedData.tournament.currentUser.id = getTokenValue("userid");
    sharedData.tournament.currentUser.username = getTokenValue("username");
	sharedData.localGame = true;
	sharedData.tournoi = true;
    await loadDashboardView("/tournament", true);
}

export async function updateCurrentUser()
{
    sharedData.tournament.players[0].username = getTokenValue("username") as string;

    const placeholder = document.getElementById("current-user");

    if (placeholder === null)
    {
        return ;
    }

    insertInnerText(placeholder, "set_username", sharedData.tournament.players[0].username);
    displayAvatar("default-avatar-profile", 12, await getAvatarPath(-1), sharedData.tournament.players[0].username);
}

function isUsernameDup(username: string)
{
    const usernames = document.querySelectorAll('[id="set_username"]');

    for (let i = 0; i < usernames.length; i++)
    {
        const child = usernames[i] as HTMLParagraphElement;

        if (child.innerText === username)
        {
            displayToast("This username already exists", "error");
            return (true);
        }
    }

    return (false);
}

export async function updateUsername(action: string)
{
    const username = getInputValue("player_username") as string;

    if (isUsernameDup(username))
    {
        return;
    }

    const button = document.getElementById(action);

    if (button === null)
    {
        return ;
    }

    const classes = "text-switch1-100";
    const p = createComponent("p", classes, null) as HTMLParagraphElement;
    sharedData.tournament.players.push({id : sharedData.tournament.players.length, username : username, score : 0});
    sharedData.tournament.players.push

    p.innerText = username;
    p.id = "set_username";

    button.replaceWith(p);

    if (document.querySelector('[data-action="add-username"]') === null)
    {
        const button = document.querySelector('[data-action="start-tournament"]') as HTMLButtonElement;

        if (button === null)
        {
            return ;
        }

        button.disabled = false;
        button.classList.remove("disabled:bg-gray-200", "cursor-not-allowed");

        removeDisabledButton("header-button");
    }

    const avatar = document.getElementById("avatar_" + action);

    if (avatar === null)
    {
        return ;
    }

    const avatarClasses = "size-12 shrink-0 rounded-full bg-gray-100 size-12 rounded-full bg-gray-100 text-center content-center uppercase font-bold content-center uppercase font-bold";
    const span = createComponent("span", avatarClasses, null) as HTMLSpanElement;
    span.id = "avatar_" + action;
    avatar.replaceWith(span);

    displayAvatar("avatar_" + action, 12, null, username);
}

function updateWinnerColor()
{
    const icon = document.getElementById("winner-icon");

    if (icon === null)
    {
        return ;
    }

    icon.classList.replace("text-gray-300", "text-switch3-100");

    const nextEl = icon.nextElementSibling;

    if (nextEl === null)
    {
        return ;
    }

    nextEl.classList.replace("ring-gray-300", "ring-switch3-100");
}

function reduceParticipantOpacity(currentMatch: number)
{
    const parent = document.getElementById("participant-list");

    if (parent === null)
    {
        return ;
    }

    for (let i = 1; i < parent.children.length; i++)
    {
        const p = parent.children[i].querySelector('[id="set_username"]') as HTMLParagraphElement;

        const players = sharedData.tournament.matches[currentMatch].players;

        if (p.innerText === players[0].username || p.innerText === players[1].username)
        {
            parent.children[i].classList.add("opacity-25");
        }
    }
}

function updateMatch(currentMatch: number)
{
    if (currentMatch === -1)
    {
        return ;
    }

    const match = document.getElementById("match" + currentMatch);

    if (match === null)
    {
        return ;
    }

    match.children[0].classList.remove("border-t-4", "border-switch1-100");
    match.children[1].classList.remove("border-b-4", "border-switch2-100");

    const username = match.children[0].querySelector('[id="set_username"]') as HTMLParagraphElement;

    if (sharedData.tournament.matches[currentMatch].winner?.username === username.innerText)
    {
        match.children[0].classList.replace("ring-gray-300", "ring-switch3-100");
        match.children[1].classList.add("opacity-25");
    }
    else
    {
        match.children[0].classList.add("opacity-25");
        match.children[1].classList.replace("ring-gray-300", "ring-switch3-100");
    }
}

export async function displayNextMatch()
{
    const currentMatch = sharedData.tournament.currentMatch;

    if (currentMatch === 0 || currentMatch === 1)
    {
        reduceParticipantOpacity(currentMatch);
    }

    updateMatch(currentMatch - 1);

    switch (currentMatch)
    {
        case 0:
        case 1:
        case 2:
            updateHeaderButton("Start game " + (currentMatch + 1), "get-ready", "success", 1);
            updateOpacity("match" + currentMatch, 100);
            updatePlayer(currentMatch, 0);
            updatePlayer(currentMatch, 1);
            updateBorders("match" + currentMatch);
            break;
        case 3:
            updateOpacity("round3", 100);
            updateWinnerColor();
            updatePlayer(currentMatch, 0);
            removeHeaderButtons(1);
            updateHeaderButton("Go to dashboard", "confirm-leave-tournament", "normal", 0);
            break;
    }
}

export function getWinner(currentMatch: number, id : number, flag : boolean)
{
    const idForTest = id;

    sharedData.tournament.matches[currentMatch].winner = (sharedData.tournament.matches[currentMatch].players[idForTest]);
	if (flag)
    	sharedData.tournament.matches[2].players.push(sharedData.tournament.matches[currentMatch].winner);
}

export async function displayMatchResultsTourney(dataAction: string)
{
    await displayDialog(dataAction);
	
    const placeholder = document.getElementById("username-winner");

    if (placeholder === null)
    {
        return ;
    }

    const username = sharedData.tournament.matches[sharedData.tournament.currentMatch].winner?.username as string;

    placeholder.innerText = username;

    let path = null;

    if (username === getTokenValue("username"))
    {
        path = await getAvatarPath(-1);
    }

    displayAvatar("default-avatar-profile-winner", 12, path, username);

    sharedData.tournament.currentMatch++;
}

export function leaveTournament()
{
    sharedData.tournament.shouldUserLeave = true;
	sharedData.socket.removeAllListeners("game end tournoi");
	sharedData.socket.emit("stop tournament");
	sharedData.socketListenners.matchListenners = false;
	sharedData.localGame = false;
	sharedData.isPlaying = false;
	sharedData.tournoi = false;
    handleRooting("/dashboard", null, true);
	// sharedData.isPlaying = false;
	// console.log("now go to dash");
	// handleRooting("/dashboard", null, true);
}

export async function addHeaderButton(pathname: string, index: number)
{
    let headerButtonData = headerButtonsData.find(headerButtonData => headerButtonData.pathname === pathname);
    
    if (headerButtonData === undefined)
    {
        return ;
    }

    await insertHeaderButton();
    updateHeaderButton2(headerButtonData, index);
}

export async function init()
{
	sharedData.tournoi  = true;
    sharedData.tournament = {
        id: 0,
        currentUser: {
            id: 0,
            username: null
        },
        playerNumber: 4,
        players: [],
        matches: [],
        currentMatch: 0,
        winner: null,
        shouldUserLeave: false
    },

	sharedData.tournament.players.push({id : 0, username : sharedData.tournament.currentUser.username, score : 0});
	sharedData.socket.emit("tournament");
    addHeaderButton("/leave-tournament", 0);
    addHeaderButton("/step1", 1);

	updateCurrentUser();
}