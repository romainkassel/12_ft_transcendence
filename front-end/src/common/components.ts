import { sanitizeHTML } from "./xssPrev.js";

function getAvailableFriendCard()
{
    return `
        <div class="flex min-w-0 gap-x-4">
            <img class="size-12 flex-none rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80" alt="">
            <div class="min-w-0 flex-auto">
            <p id="username" class="text-sm/6 font-semibold text-gray-900 text-left"></p>
            <div class="mt-1 flex items-center gap-x-1.5">
                <div class="flex-none rounded-full bg-switch3-100/20 p-1">
                    <div class="size-1.5 rounded-full bg-switch3-100">
                    </div>
                </div>
                <p class="text-xs/5 text-gray-500">Online</p>
            </div>
            </div>
        </div>
    `;
}

function getFriendListLi()
{
    return `

       <div class="flex min-w-0 gap-x-4">
            <span id="default-avatar-friend-list-" class="size-12 rounded-full bg-gray-100 content-center uppercase font-bold text-center"></span>
            <div class="min-w-0 flex-auto">
            <p id="username" class="text-sm/6 font-semibold text-gray-900"></p>
            <div class="mt-1 flex items-center gap-x-1.5">
                <div id="chip" class="flex-none rounded-full p-1">
                    <div class="size-1.5 rounded-full"></div>
                </div>
                <p id="status" class="text-xs/5 text-gray-500"></p>
            </div>
            </div>
        </div>
        <div class="shrink-0 sm:flex sm:flex-col sm:items-center">
            <div class="relative inline-block text-left py-1">
                <div class="py-1">
                    <button type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50" id="friend-menu" aria-expanded="false" aria-haspopup="true">
                    Options
                    <svg class="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                        <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
                    </svg>
                    </button>
                </div>
                <!--
                    Dropdown menu, show/hide based on menu state.

                    Entering: "transition ease-out duration-100"
                    From: "transform opacity-0 scale-95"
                    To: "transform opacity-100 scale-100"
                    Leaving: "transition ease-in duration-75"
                    From: "transform opacity-100 scale-100"
                    To: "transform opacity-0 scale-95"
                -->
                <div class="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="friend-menu" tabindex="-1" style="display:none">
                    <div class="py-1" role="none">
                        <!-- Active: "bg-gray-100 text-gray-900 outline-hidden", Not Active: "text-gray-700" -->
                        <button type="button" data-action="see-profile" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="menu-item-2">See profile</button>
                        <button type="button" data-action="del-friend" class="block px-4 py-2 text-sm text-gray-700 w-full text-left" role="menuitem" tabindex="-1" id="menu-item-2">Delete</button>
                    </div>
                </div>
            </div>
        </div>

    `;
}

function getNotifContent() {

    return `

        <div class="text-sm text-gray-700 mr-4">
        </div>
        <div>
            <a class="text-sm text-switch1-100 hover:text-switch1-80" href="#">
                Accept
            </a>
        </div>

    `;

}

function getEmptyFriendListContent() {

    return `

        Your friend list is empty.

    `;

}

function getInviteFriendButton() {

    return `

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 mr-3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"></path>
        </svg>
        Invite a friend

    `;

}

function getPlayerCard() {

    return `

        <div class="inline-flex flex-auto justify-center w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset py-5 items-center border-switch2-100">
            <div class="flex min-w-0 gap-x-4 items-center">
                <div id="avatar-parent-profile" class="flex items-center gap-x-3 col-span-2">
                    <span id="default-avatar-profile" class="size-12 shrink-0 rounded-full bg-gray-100 text-center content-center uppercase font-bold"></span>
                </div>
                <div class="min-w-0 flex-auto">
                    <p id="username" class="text-sm/6 font-semibold text-gray-900">getPlayerCard ici</p>
                </div>
            </div>
        </div>

    `;

}

function getLobbyPlayerCard() {

    return `

        <div class="inline-flex flex-auto justify-center w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset py-5 items-center">
            <div class="flex min-w-0 gap-x-4 items-center">
                <svg class="size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                    <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd"></path>
                </svg>
                <div class="min-w-0 flex-auto">
                    <p id="username" class="text-sm/6 font-semibold text-gray-900"></p>
                </div>
            </div>
        </div>

    `;

}

function getPlayerResultCard() {
    return `

        <div class="inline-flex flex-auto justify-center w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset py-5 items-center">
            <div class="flex min-w-0 gap-x-4 items-center">
                <div class="min-w-0 flex-auto">
                    <p id="username" class="text-sm/6 font-semibold text-gray-900">toto</p>
                </div>
                <span id="score" class="inline-flex items-center rounded-md bg-white px-4 py-1 text-3xl font-medium text-switch3-100 ring-1 ring-switch3-100/20 ring-inset justify-center">10</span>
            </div>
        </div>

    `;

}

function getDialogContent() {

  return `

    <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <!--
            Modal panel, show/hide based on modal state.

            Entering: "ease-out duration-300"
            From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            To: "opacity-100 translate-y-0 sm:scale-100"
            Leaving: "ease-in duration-200"
            From: "opacity-100 translate-y-0 sm:scale-100"
            To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        -->
        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
                <div class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-white sm:mx-0 sm:size-10 ring-1 ring-switch2-100/20 ring-inset">
                <svg class="size-6 text-switch2-100" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-base font-semibold text-gray-900" id="modal-title">Sign out</h3>
                <div class="mt-2">
                    <p class="text-sm text-gray-500">Are you sure you want to sign out?</p>
                </div>
                </div>
            </div>
            </div>
            <div id="dialog-content">
            </div>
            <div id="button-section" class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button id="confirm-button" type="button" data-action="" class="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs sm:ml-3 sm:w-auto">Confirm</button>
                <button id="cancel-button" type="button" data-action="cancel" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
            </div>
        </div>
        </div>
    </div>

  `;

}

function getDetailsComponent()
{
    return `
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

        <div class="fixed inset-0 overflow-hidden">
            <div class="absolute inset-0 overflow-hidden">
                <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                    <!--
                    Slide-over panel, show/hide based on slide-over state.

                    Entering: "transform transition ease-in-out duration-500 sm:duration-700"
                        From: "translate-x-full"
                        To: "translate-x-0"
                    Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
                        From: "translate-x-0"
                        To: "translate-x-full"
                    -->
                    <div class="pointer-events-auto relative w-screen max-w-full sm:max-w-md">
                    <!--
                        Close button, show/hide based on slide-over state.

                        Entering: "ease-in-out duration-500"
                        From: "opacity-0"
                        To: "opacity-100"
                        Leaving: "ease-in-out duration-500"
                        From: "opacity-100"
                        To: "opacity-0"
                    -->
                    <div class="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                        <button data-action="close" type="button" class="relative rounded-md text-gray-300 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden">
                        <span class="absolute -inset-2.5"></span>
                        <span class="sr-only">Close panel</span>
                        <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                        </button>
                    </div>

                    <div class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                        <div class="px-4 sm:px-6">
                        <h2 class="text-base font-semibold text-gray-900" id="slide-over-title">Match details</h2>
                        </div>
                        <div class="relative mt-6 flex-1 px-4 sm:px-6">

                            <div class="bg-white grid grid-cols-2 border-b border-gray-200 px-6 py-3 text-gray-900 text-sm/6">
                                <div>
                                    <p class="font-medium uppercase">Match id</p>
                                </div>
                                <div>
                                    <p id="id"></p>
                                </div>
                            </div>

                            <div class="bg-gray-50 grid grid-cols-2 border-b border-gray-200 px-6 py-3 text-gray-900 text-sm/6">
                                <div>
                                    <p class="font-medium uppercase">Date</p>
                                </div>
                                <div>
                                    <p id="date"></p>
                                </div>
                            </div>

                            <div class="bg-white grid grid-cols-2 border-b border-gray-200 px-6 py-3 text-gray-900 text-sm/6">
                                <div>
                                    <p class="font-medium uppercase">Duration</p>
                                </div>
                                <div>
                                    <p id="duration"></p>
                                </div>
                            </div>

                            <div class="bg-gray-50 grid grid-cols-2 border-b border-gray-200 px-6 py-3 text-gray-900 text-sm/6">
                                <div>
                                    <p class="font-medium uppercase">Max speed</p>
                                </div>
                                <div>
                                    <p id="max-speed"></p>
                                </div>
                            </div>

                            <div class="bg-white grid grid-cols-2 border-b border-gray-200 px-6 py-3 text-gray-900 text-sm/6">
                                <div>
                                    <p class="font-medium uppercase">Bounces</p>
                                </div>
                                <div>
                                    <p id="bounces"></p>
                                </div>
                            </div>

                            <div class="bg-gray-50 grid grid-cols-2 border-b border-gray-200 px-6 py-3 text-gray-900 text-sm/6">
                                <div>
                                    <p class="font-medium uppercase">Your status</p>
                                </div>
                                <div>
                                    <p id="status"></p>
                                </div>
                            </div>

                            <div class="bg-white border-b border-gray-200 px-6 py-3 text-gray-900 text-sm/6 grid grid-cols-2">
                                <div class="content-center">
                                    <p class="font-medium uppercase pb-1">Player 1</p>
                                </div>
                                <div>
                                    <div class="grid grid-cols-2">
                                        <div>
                                            <p class="font-medium">Username</p>
                                        </div>
                                        <div>
                                            <p id="player1-username"></p>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-2">
                                        <div>
                                            <p class="font-medium">Score</p>
                                        </div>
                                        <div>
                                            <p id="player1-score"></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gray-50  border-b border-gray-200 px-6 py-3 text-gray-900 text-sm/6 grid grid-cols-2">
                                <div class="content-center">
                                    <p class="font-medium uppercase pb-1">Player 2</p>
                                </div>
                                <div>
                                    <div class="grid grid-cols-2">
                                        <div>
                                            <p class="font-medium">Username</p>
                                        </div>
                                        <div>
                                            <p id="player2-username"></p>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-2">
                                        <div>
                                            <p class="font-medium">Score</p>
                                        </div>
                                        <div>
                                            <p id="player2-score"></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="player-3" class="bg-white border-b border-gray-200 px-6 py-3 text-gray-900 text-sm/6 grid grid-cols-2">
                                <div class="content-center">
                                    <p class="font-medium uppercase pb-1">Player 3</p>
                                </div>
                                <div>
                                    <div class="grid grid-cols-2">
                                        <div>
                                            <p class="font-medium">Username</p>
                                        </div>
                                        <div>
                                            <p id="player3-username"></p>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-2">
                                        <div>
                                            <p class="font-medium">Score</p>
                                        </div>
                                        <div>
                                            <p id="player3-score"></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="player-4" class="bg-gray-50 border-b border-gray-200 px-6 py-3 text-gray-900 text-sm/6 grid grid-cols-2">
                                <div class="content-center">
                                    <p class="font-medium uppercase pb-1">Player 4</p>
                                </div>
                                <div>
                                    <div class="grid grid-cols-2">
                                        <div>
                                            <p class="font-medium">Username</p>
                                        </div>
                                        <div>
                                            <p id="player4-username"></p>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-2">
                                        <div>
                                            <p class="font-medium">Score</p>
                                        </div>
                                        <div>
                                            <p id="player4-score"></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <canvas id="bar-chart" class="mt-5" style="width:100%"></canvas>

                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getToastContent()
{
  return `
    <div class="flex justify-center">
        <span class="inline-flex rounded-md px-3 py-2.5 text-xs font-medium ring-1 ring-inset min-w-sm justify-center"></span>
    </div>
  `;
}

function getWaitlistCard()
{

    return `

        <svg class="mr-3 -ml-1 size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-100" cx="12" cy="12" r="10" stroke="black" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Viiiiiiiictoooooor?

    `;

}

function getContent(content: string)
{
    let result = "";

    switch (content)
    {
        case "available-friend":
            result = getAvailableFriendCard();
            break;
        case "friend-list-li":
            result = getFriendListLi();
            break;
        case "notif":
            result = getNotifContent();
            break;
        case "empty-friend-list":
            result = getEmptyFriendListContent();
            break;
        case "invite-friend":
            result = getInviteFriendButton();
            break;
        case "player-card":
            result = getPlayerCard();
            break;
        case "lobby-player-card":
            result = getLobbyPlayerCard();
            break;
        case "player-result-card":
            result = getPlayerResultCard();
            break;
        case "dialog-content":
            result = getDialogContent();
            break;
        case "details-component":
            result = getDetailsComponent();
            break;
        case "toast-content":
            result = getToastContent();
            break;
        case "waitlist-card":
            result = getWaitlistCard();
            break;
    }

    return (result);
}

export function addClasses(element: HTMLElement, classes: string)
{
    if (classes === "")
    {
        return ;
    }

    const classArr = classes.split(" ");

    for (let i = 0; i < classArr.length; i++)
    {
        element.classList.add(classArr[i]);
    }
}

export function createComponent(element: string, classes: string, content: string | null)
{
    const component = document.createElement(element) as HTMLElement;

    addClasses(component, classes);

    if (content)
    {
        component.innerHTML = sanitizeHTML(getContent(content));
    }

    return (component);
}
