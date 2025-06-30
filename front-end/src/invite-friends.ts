import { displayHeaderButton } from "./common/buttons.js";
import { createComponent } from "./common/components.js";
import { getSelectedCard } from "./common/dialogs.js";
import { sendNotif } from "./common/notifs.js";
import { sharedData } from "./common/store.js";
import { updateCurrentUser, updateRound1Card } from "./tournament.js";
import { loadDashboardView } from "./views/dashboardViews.js";

export function getInvitedFriendCard() {

    return `

        <div class="flex min-w-0 gap-x-4">
            <img class="size-12 flex-none rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80" alt="">
            <div class="min-w-0 flex-auto">
                <p id="username" class="text-sm/6 font-semibold text-gray-900 text-left"></p>
                <div class="mt-1 flex items-center gap-x-1.5">
                    <div class="flex-none rounded-full bg-orange-500/20 p-1">
                        <div class="size-1.5 rounded-full bg-orange-500"></div>
                    </div>
                    <p class="text-xs/5 text-gray-500">No ready yet</p>
                </div>
            </div>
        </div>

    `;

}

export function getUsername(selectedCard: HTMLElement)
{
    const username = selectedCard.querySelector('[id="username"]') as HTMLParagraphElement;

    if (username === null)
    {
        return ;
    }

    return (username.innerText);
}

export async function sendInvite()
{
    const selectedCard = getSelectedCard() as HTMLButtonElement;

    let type = "";

    if (window.location.pathname === "/invite-friends")
    {
        type = "match";
    }
    else
    {
        type = "tournament";
    }

    const username = sharedData.match.currentUser?.username;

    const message = sharedData.match.currentUser?.username + " invited you for a " + type + ".";
    sendNotif(message, selectedCard.id, "invite-friends");

    if (window.location.pathname === "/tournament")
    {
        updateRound1Card(selectedCard);
    }
}

async function displayInvitationList()
{
    const playerList = document.getElementById("player-list");

    if (playerList === null)
    {
        return ;
    }

    const classes = "inline-flex items-center rounded-md px-4 py-2 text-sm leading-6 font-semibold transition duration-150 ease-in-out hover:bg-gray-50 bg-white text-gray-900 rounded-md ring-1 ring-gray-300 ring-inset justify-center w-full";
    
    const button = createComponent("button", classes, "invite-friend") as HTMLButtonElement;

    button.type = "button";
    button.setAttribute("data-action", "invite-friend");

    for (let i = 1; i < sharedData.match.playerNumber; i++)
    {
        const clone = button.cloneNode(true) as HTMLButtonElement;
        playerList.appendChild(clone);
    }
}


export async function inviteFriends(dataAction: string, updateHistory: boolean)
{
    const selectedCard = getSelectedCard() as HTMLButtonElement;

    sharedData.match.playerNumber = Number(selectedCard.innerText);
    
    //sharedData.match.currentUser.id = getTokenValue("userid");
    //sharedData.match.currentUser.username = getTokenValue("username");

    await loadDashboardView("/invite-friends", updateHistory)
}

export function init()
{
    displayHeaderButton(null);
    displayInvitationList();
    updateCurrentUser();
}