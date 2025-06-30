import { displayAvailableFriends } from "../friends.js";
import { removeDisabledButton } from "./buttons.js";
import { createComponent } from "./components.js";
import { removeToast } from "./toasts.js";
import { sanitizeHTML } from "./xssPrev.js";

const styles = [
    {
        style: "normal",
        classes: [
            "bg-switch1-100",
            "hover:bg-switch1-80"
        ]
    },
    {
        style: "warning",
        classes: [
            "bg-switch2-100",
            "hover:bg-switch2-80"
        ],
    },
    {
        style: "success",
        classes: [
            "bg-switch3-100",
            "hover:bg-switch3-80"
        ],
    }
]

interface Buttons {
    style: string;
    isPrimaryButton: boolean;
    isSecondaryButton: boolean;
    isPrimaryButtonDisabled: boolean;
    primaryButtontText: string | null;
    primaryButtonType: string | null;
    dataAction: string | null;
}

interface Dialog {
    dataAction: string;
    h3: string;
    isIcon: boolean;
    p: string;
    content: string | null;
    buttons: Buttons | null;
}

const dialogs: Dialog[] = [
    {
        dataAction: "handle2faFromLogin",
        h3: "2FA verification",
        isIcon: false,
        p: "Please enter the code you received by email.",
        content: "/2fa-verification",
        buttons: {
            style: "normal",
            isPrimaryButton: true,
            isSecondaryButton: true,
            isPrimaryButtonDisabled: false,
            primaryButtontText: "Send code",
            primaryButtonType: "submit",
            dataAction: "submit-2fa-code"
        }
    },
    {
        dataAction: "find-match",
        h3: "Find a match",
        isIcon: false,
        p: "Select the number of players.",
        content: "/player-number",
        buttons: {
            style: "normal",
            isPrimaryButton: true,
            isSecondaryButton: true,
            isPrimaryButtonDisabled: true,
            primaryButtontText: "Confirm",
            primaryButtonType: "button",
            dataAction: "process-match"
        }
    },
    {
        dataAction: "see-pie-chart-2",
        h3: "Match history (2 players)",
        isIcon: false,
        p: "Here's the number of wins and losses in your 2-player matches.",
        content: "/pie-chart-2",
        buttons: {
            style: "normal",
            isPrimaryButton: true,
            isSecondaryButton: false,
            isPrimaryButtonDisabled: false,
            primaryButtontText: "Ok",
            primaryButtonType: "button",
            dataAction: "close"
        }
    },
    {
        dataAction: "see-pie-chart-4",
        h3: "Match history (4 players)",
        isIcon: false,
        p: "Here's the number of wins and losses in your 4-player matches.",
        content: "/pie-chart-4",
        buttons: {
            style: "normal",
            isPrimaryButton: true,
            isSecondaryButton: false,
            isPrimaryButtonDisabled: false,
            primaryButtontText: "Ok",
            primaryButtonType: "button",
            dataAction: "close"
        }
    },
    {
        dataAction: "process-match-2",
        h3: "Free match - 2 players",
        isIcon: false,
        p: "We are currently looking for someone else, please wait.",
        content: "/process-match-2",
        buttons: {
            style: "warning",
            isPrimaryButton: true,
            isSecondaryButton: false,
            isPrimaryButtonDisabled: false,
            primaryButtontText: "Leave waitlist",
            primaryButtonType: "button",
            dataAction: "leave-waitlist"
        }
    },
    {
        dataAction: "process-match-4",
        h3: "Free match - 4 players",
        isIcon: false,
        p: "We are currently looking for people, please wait.",
        content: "/process-match-4",
        buttons: {
            style: "warning",
            isPrimaryButton: true,
            isSecondaryButton: false,
            isPrimaryButtonDisabled: false,
            primaryButtontText: "Leave waitlist",
            primaryButtonType: "button",
            dataAction: "leave-waitlist"
        }
    },
    {
        dataAction: "play-friends",
        h3: "Play with friends",
        isIcon: false,
        p: "Select the number of players.",
        content: "/player-number",
        buttons: {
            style: "normal",
            isPrimaryButton: true,
            isSecondaryButton: true,
            isPrimaryButtonDisabled: true,
            primaryButtontText: "Confirm",
            primaryButtonType: null,
            dataAction: "play-friends"
        }
    },
    {
        dataAction: "signout",
        h3: "Sign out",
        isIcon: true,
        p: "Are you sure you want to sign out?",
        content: null,
        buttons: {
            style: "warning",
            isPrimaryButton: true,
            isSecondaryButton: true,
            isPrimaryButtonDisabled: false,
            primaryButtontText: "Sign out",
            primaryButtonType: "button",
            dataAction: "confirm-signout",
        }
    },
    {
        dataAction: "add-friend",
        h3: "Add a friend",
        isIcon: false,
        p: "Which user would you like to add as a friend?",
        content: "/add-friend",
        buttons: {
            style: "normal",
            primaryButtontText: "Add as friend",
            isPrimaryButtonDisabled: false,
            isPrimaryButton: true,
            isSecondaryButton: true,
            primaryButtonType: "submit",
            dataAction: "add-as-friend"
        }
    },
    {
        dataAction: "add-username",
        h3: "Add a username",
        isIcon: false,
        p: "Which username would you like to have for this player?",
        content: "/add-username",
        buttons: {
            style: "normal",
            primaryButtontText: "Update username",
            isPrimaryButtonDisabled: false,
            isPrimaryButton: true,
            isSecondaryButton: true,
            primaryButtonType: "submit",
            dataAction: "update-username"
        }
    },
    {
        dataAction: "invite-friend",
        h3: "Invite a friend",
        isIcon: false,
        p: "Here is the list of friends available for a game.",
        content: "/invite-friend",
        buttons: {
            style: "normal",
            primaryButtontText: "Send invite",
            isPrimaryButtonDisabled: true,
            isPrimaryButton: true,
            isSecondaryButton: true,
            primaryButtonType: "button",
            dataAction: "send-invite"
        }
    },
    {
        dataAction: "pause-match",
        h3: "Match on pause",
        isIcon: false,
        p: "Your match is currently on pause. Hurry up: other players are waiting for you.",
        content: "/pause-match",
        buttons: {
            style: "normal",
            primaryButtontText: "Stop pause",
            isPrimaryButtonDisabled: false,
            isPrimaryButton: true,
            isSecondaryButton: false,
            primaryButtonType: "button",
            dataAction: "stop-pause"
        }
    },
    {
        dataAction: "leave-match",
        h3: "Leave match",
        isIcon: true,
        p: "Are you sure you want to leave match? If you confirm, you will not be able to return to the game and you will lose the match.",
        content: null,
        buttons: {
            style: "warning",
            primaryButtontText: "Leave match",
            isPrimaryButtonDisabled: false,
            isPrimaryButton: true,
            isSecondaryButton: true,
            primaryButtonType: "button",
            dataAction: "confirm-leave-match"
        }
    },
    {
        dataAction: "leave-tournament",
        h3: "Leave tournament",
        isIcon: true,
        p: "Are you sure you want to leave tournament? If you confirm, you will leave the tournament and all data will be reset.",
        content: null,
        buttons: {
            style: "warning",
            primaryButtontText: "Leave tournament",
            isPrimaryButtonDisabled: false,
            isPrimaryButton: true,
            isSecondaryButton: true,
            primaryButtonType: "button",
            dataAction: "confirm-leave-tournament"
        }
    },
    {
        dataAction: "start-match",
        h3: "It's time to play Pong!",
        isIcon: false,
        p: "All players are now ready, the game will start in a few seconds...",
        content: "/countdown-timer",
        buttons: null
    },
    {
        dataAction: "display-match-results",
        h3: "Match is over",
        isIcon: false,
        p: "Here is the match winner.",
        content: "/match-results",
        buttons: {
            style: "normal",
            primaryButtontText: "Go to dashboard",
            isPrimaryButtonDisabled: false,
            isPrimaryButton: true,
            isSecondaryButton: false,
            primaryButtonType: "button",
            dataAction: "go-to-dashboard"
        }
    },
    {
        dataAction: "display-match-results-tourney",
        h3: "Match is over",
        isIcon: false,
        p: "Here is the match winner.",
        content: "/match-results",
        buttons: {
            style: "normal",
            primaryButtontText: "Back to tournament",
            isPrimaryButtonDisabled: false,
            isPrimaryButton: true,
            isSecondaryButton: false,
            primaryButtonType: "button",
            dataAction: "display-next-match"
        }
    },
]

export function sleep(ms: number)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function startCountdown(duration: number, isCounterDisplayed: boolean, dataAction: string)
{
    await displayDialog(dataAction);
    await sleep(1000);

    // Source: How TO - JavaScript Countdown Timer - https://www.w3schools.com/howto/howto_js_countdown.asp

    // Output the result

    // Set the duration in seconds we're counting down to
    let seconds = duration - 1;

    const placeholder = document.getElementById("countdown-timer");

    if (placeholder === null)
    {
        return ;
    }

    if (isCounterDisplayed === true)
    {
        placeholder.innerText = String(duration);
    }

    // Update the count down every 1 second
    const x = setInterval(function() {

        // If the count down is over, write some text
        if (placeholder && seconds === 0 && isCounterDisplayed === true)
        {
            placeholder.innerText = "LET'S PLAY";
        }
        else if (seconds === -1)
        {
            closeDialog();
            removeDisabledButton("header-button");
            clearInterval(x);
        }
        else if (placeholder && isCounterDisplayed === true)
        {
            placeholder.innerText = String(seconds);
        }

        // Decreasing the count down each iteration
        seconds -= 1;

    }, 1000);
}

export function updateButtonSelection(id: string)
{
    const selectedButton = document.getElementById(id);

    if (selectedButton === null)
    {
        return ;
    }

    const parent = selectedButton.parentElement;

    if (parent === null)
    {
        return ;
    }

    const parentChildren = parent.children;

    if (parentChildren === null)
    {
        return ;
    }

    for (let i = 0; i < parentChildren.length; i++)
    {
        parentChildren[i].classList.replace("ring-2", "ring-1");
        parentChildren[i].classList.replace("ring-black", "ring-gray-300");
    }

    selectedButton.classList.replace("ring-1", "ring-2");
    selectedButton.classList.replace("ring-gray-300", "ring-black");

    const button = document.getElementById("confirm-button") as HTMLButtonElement;

    if (button === null)
    {
        return ;
    }

    // console.log("button: ", button);

    button.disabled = false;
    button.classList.remove("disabled:bg-gray-200", "cursor-not-allowed");
}

export function getSelectedCard()
{
    const cardSelection = document.getElementById("card-selection")?.children;

    if (cardSelection === undefined)
    {
        return ;
    }

    for (let i = 0; i < cardSelection.length; i++)
    {
        if (cardSelection[i].classList.contains("ring-2"))
        {
            return (cardSelection[i]);
        }
    }
}

function insertDialog(body: HTMLBodyElement)
{
    const classes = "relative z-10";

    const div = createComponent("div", classes, "dialog-content") as HTMLDivElement;

    div.setAttribute("aria-labelledby", "modal-title");
    div.setAttribute("role", "dialog");
    div.setAttribute("aria-modal", "true");

    body.insertBefore(div, body.firstChild);
}

function updateH3(dialog: HTMLElement, newH3: string)
{
    const currentH3 = dialog.querySelector("h3");

    if (currentH3 === null)
    {
        return ;
    }

    currentH3.innerText = newH3;
}

function removeH3Margin(dialog: HTMLElement)
{
    const h3 = dialog.querySelector("h3");

    if (h3 === null)
    {
        return ;
    }

    const h3Parent = h3.parentElement;

    if (h3Parent === null)
    {
        return ;
    }

    h3Parent.classList.remove("sm:ml-4");
}

function updateIcon(dialog: HTMLElement, isIcon: boolean)
{
    if (isIcon === true)
    {
        return ;
    }

    const icon = dialog.querySelector("svg");

    if (icon === null)
    {
        return ;
    }

    const parentIcon = icon.parentElement;

    if (parentIcon === null)
    {
        return ;
    }

    parentIcon.remove();

    removeH3Margin(dialog);
}

function updateP(dialog: HTMLElement, newP: string)
{
    const p = dialog.querySelector("p");

    if (p === null)
    {
        return ;
    }

    p.innerText = newP;
}

function getContent(content: string)
{
    switch (content)
    {
        case "/player-number":
            return `
                <div id="card-selection" class="bg-white px-4 pb-4 sm:flex sm:px-6">
                    <button data-action="select-button" id="card-1" type="button" class="mt-3 inline-flex flex-auto w-full justify-center rounded-md bg-white px-3 py-2 text-5xl font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto sm:mr-1.5 py-5">2</button>
                    <button data-action="select-button" id="card-2" type="button" class="mt-3 inline-flex flex-auto w-full justify-center rounded-md bg-white px-3 py-2 text-5xl font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto sm:ml-1.5 py-5">4</button>
                </div>
            `;

        case "/add-friend":
            return `
                <div class="px-4 pb-4 sm:px-6">
                    <form id="form" class="space-y-6" action="#" method="POST">
                        <input type="text" name="friend_username" id="friend_username" autocomplete="current-friend_username" required="" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-switch1-100 sm:text-sm/6">
                    </form>
                </div>
            `;

        case "/add-username":
            return `
                <div class="px-4 pb-4 sm:px-6">
                    <form id="form" class="space-y-6" action="#" method="POST">
                        <input type="text" name="player_username" id="player_username" autocomplete="current-player_username" required="" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-switch1-100 sm:text-sm/6">
                    </form>
                </div>
            `;

        case "/countdown-timer":
            return `
                <div id="countdown-timer" class="bg-white px-4 pb-5 sm:flex sm:px-6 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl justify-center">
                    READY?
                </div>
            `;

        case "/pause-match":
            return `
                <div class="bg-white px-4 pb-5 sm:flex sm:px-6 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl justify-center">
                    PAUSE
                </div>
            `;

        case "/process-match-2":
            return `
                <div id="player-list" class="mx-auto max-w-2xl px-4 pb-5 lg:max-w-7xl">
                    <div class="inline-flex items-center rounded-md px-4 py-2 text-sm leading-6 font-semibold bg-white text-gray-900 ring-1 ring-gray-300 ring-inset justify-center w-full min-h-24">
                        <svg class="mr-3 -ml-1 size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-100" cx="12" cy="12" r="10" stroke="black" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Looking for a mate...
                    </div>
                </div>
            `;

        case "/process-match-4":
            return `
                <div id="player-list" class="max-w-2xl mx-6 mb-5 p-5 lg:max-w-7xl ring-1 ring-gray-300 ring-inset rounded-md ">
                    <div class="inline-flex items-center px-4 py-2 text-sm leading-6 font-semibold text-gray-900 justify-center w-full">
                        <svg class="mr-3 -ml-1 size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-100" cx="12" cy="12" r="10" stroke="black" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Looking for mates...
                    </div>
                    <div class="inline-flex items-center px-4 py-2 text-sm leading-6 font-semibold text-gray-900 justify-center w-full">
                        <div class="text-center">
                            <p id="waitlist-size" class="sm:px-6 text-3xl sm:text-5xl font-semibold tracking-tight text-balance text-switch1-100 sm:text-7xl">1</p>
                            <p class="sm:px-6 text-3xl sm:text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-4xl">out of</p>
                            <p class="sm:px-6 text-3xl sm:text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">4 players</p>
                            <p class="sm:px-6 text-3xl sm:text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-xl mt-2">joined the game.</p>

                        </div>
                    </div>
                </div>
            `;

        case "/invite-friend":
            return `
                <div id="card-selection" class="bg-white px-4 pb-4 sm:px-6 grid gap-2">
                </div>
            `;
        case "/match-results":
            return `
                <div id="match-results" class="max-w-2xl mx-6 mb-5 p-5 lg:max-w-7xl ring-1 ring-gray-300 ring-inset rounded-md ">
                    <div class="inline-flex items-center px-4 py-2 text-sm leading-6 font-semibold text-gray-900 justify-center w-full">
                        <div class="text-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-20 text-switch3-100 w-full mb-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"></path>
                            </svg>
                            <p class="sm:px-6 text-3xl sm:text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-4xl mb-5">The winner is...</p>
                            <div class="inline-flex flex-auto justify-center w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-switch3-100 ring-inset py-5 items-center">
                                <div class="flex min-w-0 gap-x-4 items-center">
                                    <div class="min-w-0 flex-auto">
                                        <p id="username-winner" class="text-sm/6 font-semibold text-gray-900">test</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        case "/2fa-verification":
            return `
                 <div class="px-4 pb-4 sm:px-6">
                    <form id="form" class="space-y-6" action="#" method="POST">
                        <input type="text" name="2fa-code" id="2fa-code" autocomplete="current-2fa-code" required="" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-switch1-100 sm:text-sm/6">
                    </form>
                </div>
            `;

        case "/pie-chart-2":
            return `
                <div class="px-10 pt-5 pb-10">
                    <canvas id="match-history-2" style="width:100%;max-width:700px"></canvas>
                </div>
            `;

        case "/pie-chart-4":
            return `
                <div class="px-10 pt-5 pb-10">
                    <canvas id="match-history-4" style="width:100%;max-width:700px"></canvas>
                </div>
            `;
    }
}

async function updateContent(dialog: HTMLElement, content: string | null)
{
    if (content === null)
    {
        return ;
    }

    const contentPlaceholder = document.getElementById("dialog-content");

    if (contentPlaceholder === null)
    {
        return ;
    }

    contentPlaceholder.innerHTML = sanitizeHTML(getContent(content) as string);

    if (content === "/invite-friend")
    {
        displayAvailableFriends();
    }
}

function updateButtonStyle(style: string, button: HTMLButtonElement)
{
    const buttonStyle = styles.find(styles => styles.style === style);

    if (buttonStyle)
    {
        for (let i = 0; i < buttonStyle.classes.length; i++)
        {
            button.classList.add(buttonStyle.classes[i]);
        }
    }
}

export function setDisabled(button: HTMLButtonElement)
{
    button.disabled = true;
    button.classList.add("disabled:bg-gray-200", "cursor-not-allowed");
}

function disableButton(button: HTMLButtonElement, buttons: Buttons)
{
    if (buttons.isPrimaryButtonDisabled === false)
    {
        return ;
    }

    setDisabled(button);
}

function updatedataAction(button: HTMLButtonElement, dataAction: string | null)
{
    if (dataAction === null)
    {
        return ;
    }

    button.setAttribute("data-action", dataAction as string);
}

function updatePrimaryButton(dialog: HTMLElement, buttons: Buttons)
{
    if (buttons.isPrimaryButton === false)
    {
        return ;
    }

    const primaryButton = document.getElementById("confirm-button") as HTMLButtonElement;

    if (primaryButton === null)
    {
        return ;
    }

    if (buttons.primaryButtonType === "submit")
    {
        primaryButton.setAttribute("type", "submit");
        primaryButton.setAttribute("form", "form");
        primaryButton.setAttribute("id", "submit-button");
    }

    updatedataAction(primaryButton, buttons.dataAction)

    updateButtonStyle(buttons.style, primaryButton);

    if (buttons.primaryButtontText)
    {
        primaryButton.innerText = buttons.primaryButtontText;
    }

    disableButton(primaryButton, buttons);
}

function updateButtons(dialog: HTMLElement, buttons: Buttons | null)
{
    if (buttons === null)
    {
        removeButtonSection();
        return ;
    }

    updateSecondaryButton(dialog, buttons.isSecondaryButton);
    updatePrimaryButton(dialog, buttons);
}

function removeButtonSection()
{
    const buttonSection = document.getElementById("button-section");

    if (buttonSection === null)
    {
        return ;
    }

    buttonSection.remove();
}

function updateSecondaryButton(dialog: HTMLElement, isSecondaryButton: boolean)
{
    if (isSecondaryButton === true)
    {
        return ;
    }

    const secondaryButton = document.getElementById("cancel-button");

    if (secondaryButton)
    {
        secondaryButton.remove();
    }
}

export async function displayDialog(dataAction: string) {

    await removeToast();
    closeDialog();

    const body = document.querySelector("body");

    if (body === null)
    {
        return ;
    }

    insertDialog(body);

    const dialog = body.querySelector<HTMLElement>('[role="dialog"]');

    if (dialog === null)
    {
        return ;
    }

    const dialogData = dialogs.find(dialogData => dialogData.dataAction === dataAction);

    if (dialogData === undefined)
    {
        return ;
    }

    updateH3(dialog, dialogData.h3);
    updateIcon(dialog, dialogData.isIcon);
    updateP(dialog, dialogData.p);
    updateContent(dialog, dialogData.content);
    updateButtons(dialog, dialogData.buttons);
}

export function closeDialog()
{
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]');

    if (dialog === null)
    {
        return ;
    }

    dialog.remove();
}
