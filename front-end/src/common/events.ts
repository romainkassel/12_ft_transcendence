import { previewAvatar } from "./avatar.js";
import { handleLoadAndPopstateEvents } from "../index.js";
import { closeOpenMenu } from "./menus.js";
import { handleButtonActions, handleRooting, handleSubmitActions } from "./rooting.js";
import { closeDialog } from "./dialogs.js";
import { removeDisabledButton } from "./buttons.js";

window.addEventListener("click", function(event)
{    
    const target = event.target as HTMLElement;

    closeOpenMenu(target);

    if (target.id === "upload-avatar")
    {
        return ;
    }

    const button = target.closest("button") as HTMLButtonElement;

    if (button && button.type === "submit")
    {
        return ;
    }

    event.preventDefault();

    if (button && button.type === "button")
    {
        handleButtonActions(button, false);
        return ;
    }

    const anchor = target.closest("a");

    if (anchor === null)
    {
        return ;
    }

    const href = anchor.getAttribute("href");

    if (href === null || href === window.location.pathname)
    {
        return ;
    }

    handleRooting(href, anchor, true);
});

function getSubButton(form: HTMLFormElement)
{
    let button = form.querySelector('[id="submit-button"]');

    if (button === null)
    {        
        return (document.getElementById("submit-button"));
    }

    return (button);
}

document.addEventListener("submit", function(event)
{
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    if (form === null)
    {
        return ;
    }

    const button = getSubButton(form) as HTMLButtonElement;

    handleSubmitActions(button);

    closeDialog();
});

window.addEventListener("popstate", function(event)
{
    handleLoadAndPopstateEvents();
});

window.addEventListener("change", function(event)
{
    const target = event.target as HTMLInputElement;

    if (target === null || target.id != "upload-avatar")
    {
        return ;
    }

    previewAvatar();
});