import { displayAvatar } from "./common/avatar.js";
import { createComponent } from "./common/components.js";
import { fetchData, getData, getInputs } from "./common/data.js";
import { displayToast } from "./common/toasts.js";
import { insertInnerText } from "./common/username.js";
import { loadDashboardView } from "./views/dashboardViews.js";

export async function displayAvailableFriends()
{
    const cardPlaceholder = document.getElementById("card-selection");

    if (cardPlaceholder === null)
    {
        return ;
    }

    const classes = "inline-flex flex-auto w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 py-5";

    const cardButton = createComponent("button", classes, "available-friend") as HTMLButtonElement;

    cardButton.type = "button";
    cardButton.setAttribute("data-action", "select-button");

    const responseJson = await getData("/friend");

    if (typeof responseJson === "number")
    {
        displayToast("Can't get friend list", "error");
        return ;
    }

    for (let i = 0; i < responseJson.length; i++)
    {
        const clone = cardButton.cloneNode(true) as HTMLButtonElement;
        insertInnerText(clone, "username", responseJson[i].username);
        clone.id = responseJson[i].id;
        cardPlaceholder.appendChild(clone);
    }
}

function getUserId(element: HTMLButtonElement)
{
    const parent = element.parentElement;

    if (parent === null)
    {
        return ;
    }

    return (parent.id);
}

export async function seeProfile(button: HTMLButtonElement)
{
	
    const userId = getUserId(button) as string;

    const endpoint = "/profile/" + encodeURIComponent(userId);

    loadDashboardView(endpoint, true);
}

export async function delFriend(button: HTMLButtonElement)
{
    const id = getUserId(button);

    const friendToDel = { friend_id: Number(id)};
    
    const responseJson = await fetchData("/friend", friendToDel, "DELETE");

    if (typeof responseJson === "number")
    {
        displayToast("Can't del friend", "error");  
        return ;
    }

    await displayFriendList();
    displayToast("Friend deleted with success.", "success");
}

export async function addFriend()
{
    const dataToPost = getInputs();

    const responseJson = await fetchData("/friend", dataToPost, "POST");

    if (typeof responseJson === "number")
    {
        displayToast("Can't add friend", "error");  
        return ;
    }
    
    await displayFriendList();
    displayToast("Friend added with success.", "success");
}

function updateStatus(newFriendLi: HTMLLIElement, isConnected: boolean)
{
    const chipPlaceholder = newFriendLi.querySelector('[id="chip"]') as HTMLDivElement;

    if (chipPlaceholder === null)
    {
        return ;
    }

    const statusPlaceholder = newFriendLi.querySelector('[id="status"]') as HTMLDivElement;

    if (statusPlaceholder === null)
    {
        return ;
    }

    switch (isConnected)
    {
        case true:
            statusPlaceholder.innerText = "Online";
            chipPlaceholder.classList.add("bg-switch3-100/20");
            chipPlaceholder.firstElementChild?.classList.add("bg-switch3-100");
            break;
        case false:
            statusPlaceholder.innerText = "Offline";
            chipPlaceholder.classList.add("bg-switch2-100/20");
            chipPlaceholder.firstElementChild?.classList.add("bg-switch2-100");
            break;
        default:
            break;
    }
}

function updateMenu(newFriendLi: HTMLLIElement, username: string, id: string)
{
    const menuName = "friend-menu-" + username;

    const button = newFriendLi.querySelector('[id="friend-menu"]') as HTMLButtonElement;

    if (button === null)
    {
        return ;
    }

    button.id = menuName

    const menu = newFriendLi.querySelector('[aria-labelledby="friend-menu"]') as HTMLDivElement;

    if (menu === null)
    {
        return ;
    }

    menu.setAttribute("aria-labelledby", menuName);

    const firstChild = menu.firstElementChild;

    if (firstChild === null)
    {
        return ;
    }

    firstChild.id = id;
}

export function handleEmptyList(parent: HTMLElement)
{
    const classes = "p-5 text-center";

    const p = createComponent("p", classes, "empty-friend-list") as HTMLParagraphElement;

    parent.appendChild(p);
}

function updateAvatarId(clone: HTMLLIElement, i: string)
{
    const span = clone.querySelector('[id="default-avatar-friend-list-"]') as HTMLSpanElement;

    if (span === null)
    {
        return ;
    }

    span.id += i;
}

export async function displayFriendList()
{
    const friendList = document.getElementById("friend-list") as HTMLUListElement;

    if (friendList === null)
    {
        return ;
    }

    while (friendList.firstChild) {
        friendList.removeChild(friendList.firstChild);
    }

    const responseJson = await getData("/friend");

    if (typeof responseJson === "number")
    {
        displayToast("Can't get friend list", "error");
        return ;
    }

    if (responseJson.length === 0)
    {
        handleEmptyList(friendList);
        return ;
    }

    const classes = "flex justify-between gap-x-6 py-5";

    const li = createComponent("li", classes, "friend-list-li") as HTMLLIElement;

    for (let i = 0; i < responseJson.length; i++)
    {
        const clone = li.cloneNode(true) as HTMLLIElement;

        insertInnerText(clone, "username", responseJson[i].username);
        updateStatus(clone, responseJson[i].connected);
        updateAvatarId(clone, String(i));
        updateMenu(clone, responseJson[i].username, responseJson[i].id);

        friendList.appendChild(clone);

        displayAvatar("default-avatar-friend-list-" + i, 12, responseJson[i].avatar_path, responseJson[i].username);
    }
}