import { createComponent } from "./components.js";

function updateMessage(newNotif: HTMLLIElement, message: string)
{
    const placeholder = newNotif.firstElementChild as HTMLDivElement;

    if (placeholder === null)
    {
        return ;
    }

    placeholder.innerText = message;
}

function updateHref(newNotif: HTMLLIElement, href: string)
{
    const anchor = newNotif.querySelector("a");

    if (anchor === null)
    {
        return ;
    }

    anchor.href = href;
}

export function updateNotifAlert(state: string)
{
    const notifAlert = document.getElementById("notif-alert");

    if (notifAlert === null)
    {
        return ;
    }

    notifAlert.style.visibility = state;
}

export function sendNotif(message: string, recip: string, href: string)
{
    const notifList = document.getElementById("notif-list");

    if (notifList === null)
    {
        return ;
    }

    const classes = "mx-4 my-2 px-4 py-2 flex justify-between rounded-md border border-gray-200 items-center";
    
    const notif = createComponent("li", classes, "notif") as HTMLLIElement;
    
    updateMessage(notif, message);
    updateHref(notif, href);

    notifList.insertBefore(notif, notifList.firstChild);

    updateNotifAlert("visible");
}