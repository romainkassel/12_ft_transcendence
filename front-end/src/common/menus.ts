import { updateNotifAlert } from "./notifs.js";

export function displayMenu(button: HTMLButtonElement)
{
    const buttonId = button.id;

    const menuToDisplay = document.querySelector(`[aria-labelledby='${buttonId}']`) as HTMLElement;

    if (menuToDisplay === null)
    {
        return ;
    }

    if (menuToDisplay.style.display === "none")
    {
        menuToDisplay.style.display = "block";
    }
    else
    {
        menuToDisplay.style.display = "none";
    }

    if (button.id === "notif-button")
    {
        updateNotifAlert("hidden");
    }
}

function isClickedMenu(target: HTMLElement, openMenu: HTMLElement)
{
    const clickedButton = target.closest("button");

    if (clickedButton === null || clickedButton.id != openMenu.getAttribute("aria-labelledby"))
    {
        return false;
    }

    return true;
}

export function closeOpenMenu(target: HTMLElement)
{
    const openMenu = document.querySelector("[style='display: block;']") as HTMLElement;

    if (openMenu === null)
    {
        return ;
    }

    if (isClickedMenu(target, openMenu) === false)
    {
        openMenu.style.display = "none";
    }
}