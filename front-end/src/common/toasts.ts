import { createComponent } from "./components.js";

export async function removeToast()
{
    const toast = document.getElementById("toast");

    if (toast === null)
    {
        return ;
    }

    toast.remove();
}

function insertToast(body: HTMLBodyElement)
{
    const classes = "fixed top-10 w-full animate-fade opacity-100 z-10";

    const div = createComponent("div", classes, "toast-content") as HTMLDivElement;

    div.id = "toast";

    body.insertBefore(div, body.firstChild);
}

export async function displayToast(message: string, type: string) {

    const body = document.querySelector("body");

    if (body === null)
    {
        return ;
    }

    insertToast(body);

    const toast = document.getElementById("toast");

    if (toast === null)
    {
        return ;
    }

    const span = toast.querySelector("span");

    if (span === null)
    {
        return ;
    }

    span.innerText = message;

    span.classList.add("bg-white");

    switch (type)
    {
        case "success":
            span.classList.add("ring-switch3-10", "text-switch3-100", "ring-switch3-100/20");
            break;
        case "error":
            span.classList.add("ring-switch2-10", "text-switch2-100", "ring-switch2-100/20");
            break;
    }

    setTimeout(function () {
        toast.remove();
    }, 3000)
}