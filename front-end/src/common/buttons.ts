import { sanitizeHTML } from "./xssPrev.js";

export const styles = {
    normal: [
        "bg-switch1-100",
        "hover:bg-switch1-80"
    ],
    warning: [
        "bg-switch2-100",
        "hover:bg-switch2-80"
    ],
    success: [
        "bg-switch3-100",
        "hover:bg-switch3-80"
    ]
};

interface headerButtons {
    pathname: string,
    text: string,
    style: string,
    dataAction: string,
    defaultDisabled: boolean
}

export const headerButtonsData: headerButtons[] = [
    { 
        pathname: "/invite-friends",
        text: "Ready",
        style: "success",
        dataAction: "start-match",
        defaultDisabled: false
    },
    { 
        pathname: "/match",
        text: "Ready",
        style: "success",
        dataAction: "get-ready",
        defaultDisabled: false
    },
    { 
        pathname: "/tournament",
        text: "Ready",
        style: "success",
        dataAction: "start-tournament",
        defaultDisabled: true
    },
    { 
        pathname: "/leave-tournament",
        text: "Leave tournament",
        style: "warning",
        dataAction: "leave-tournament",
        defaultDisabled: false
    },
    { 
        pathname: "pause",
        text: "Pause",
        style: "normal",
        dataAction: "pause-match",
        defaultDisabled: false
    },
    { 
        pathname: "/step1",
        text: "Start tournament",
        style: "success",
        dataAction: "start-tournament",
        defaultDisabled: true
    }
]

function removeCurrentButton(header: HTMLElement)
{
    const currentButton = header.querySelector("a");

    if (currentButton === null)
    {
        return ;
    }

    currentButton.remove();
}

export function updateStyle(headerButton: HTMLButtonElement, style: string)
{
    let classes = [""];

    switch (true)
    {
        case (headerButton.classList.contains("bg-switch1-100")):
            headerButton.classList.remove("bg-switch1-100", "hover:bg-switch1-80");
            break;
        case (headerButton.classList.contains("bg-switch2-100")):
            headerButton.classList.remove("bg-switch2-100", "hover:bg-switch2-80");
            break;
        case (headerButton.classList.contains("bg-switch3-100")):
            headerButton.classList.remove("bg-switch3-100", "hover:bg-switch3-80");
            break;
    }

    switch (style)
    {
        case "normal":
            classes = styles.normal;
            break;
        case "warning":
            classes = styles.warning;
            break;
        case "success":
            classes = styles.success;
            break;
    }

    for (let i = 0; i < classes.length; i++)
    {
        headerButton.classList.add(classes[i]);
    }
}

function getHeaderButton() {

  return `

    <button id="header-button" type="button" class="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs sm:ml-3 sm:w-auto"></button> 

  `;

}

export async function insertHeaderButton()
{
    const headerButtonPlaceholder = document.getElementById("header-button-placeholder");

    if (headerButtonPlaceholder === null)
    {
        return ;
    }

    headerButtonPlaceholder.innerHTML += sanitizeHTML(getHeaderButton());
}

export function updateHeaderButton2(headerButtonData: headerButtons, id: number)
{
    const parent = document.getElementById("header-button-placeholder") as HTMLDivElement;

    if (parent == null)
    {
        return ;
    }

    const child = parent.children[id] as HTMLButtonElement;

    if (child === undefined)
    {
        return ;
    }

    child.innerText = headerButtonData.text;

    updateStyle(child, headerButtonData.style);

    child.setAttribute("data-action", headerButtonData.dataAction);

    if (headerButtonData.defaultDisabled)
    {
        child.disabled = true;
        child.classList.add("disabled:bg-gray-200", "cursor-not-allowed");
    }
}

export async function displayHeaderButton(pathname: string | null)
{
    const header = document.querySelector("header");

    if (header === null)
    {
        return ;
    }

    removeCurrentButton(header);

    if (pathname === null)
    {
        pathname = window.location.pathname;
    }
    
    const headerButtonData = headerButtonsData.find(headerButtonData => headerButtonData.pathname === pathname);

    if (headerButtonData === undefined)
    {
        return ;
    }

    await insertHeaderButton();
    updateHeaderButton2(headerButtonData, 0);
}

export function removeDisabledButton(id: string)
{
    const button = document.getElementById(id) as HTMLButtonElement;

    if (button === null)
    {
        return ;
    }

    button.disabled = false;
    button.classList.remove("disabled:bg-gray-200", "cursor-not-allowed");
}

export function removeHeaderButtons(remainChild: number)
{
    const parent = document.getElementById("header-button-placeholder") as HTMLDivElement;

    if (parent == null)
    {
        return ;
    }

    while (parent.firstChild) {

        if (parent.children.length === remainChild)
        {
            return ;
        }
        
        parent.removeChild(parent.firstChild);
    }
}