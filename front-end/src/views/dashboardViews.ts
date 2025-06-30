import { updatePathname } from "../common/rooting.js";
import { loadMainView } from "./mainViews.js";
import { removeHeaderButtons } from "../common/buttons.js";
import { sanitizeHTML } from "../common/xssPrev.js";

function getDefaultView()
{	
    return `
        <div class="relative isolate overflow-hidden bg-gray-900 py-24 xl:py-51">
            <video autoplay="" loop="" muted="" class="absolute inset-0 -z-10 size-full object-cover object-right md:object-center">
                <source src="/dist/assets/hero_section_video.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <div class="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl" aria-hidden="true">
                <div class="aspect-1097/845 w-[68.5625rem] bg-linear-to-tr from-[#ff4694] to-[#776fff] opacity-20" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
            </div>
            <div class="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu" aria-hidden="true">
                <div class="aspect-1097/845 w-[68.5625rem] bg-linear-to-tr from-[#ff4694] to-[#776fff] opacity-20" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
            </div>

            <div class="mx-auto max-w-7xl grid grid-cols-3 gap-4 mx-auto max-w-7xl">

                <div class="px-6 lg:px-8 col-span-3 xl:col-span-2">
                    <div class="mx-auto lg:mx-0">
                        <h2 class="text-5xl font-semibold tracking-tight text-white sm:text-7xl leading-20">Hey <span id="username-h2" class="bg-white text-gray-800 opacity-25 rounded-md mt-0 mx-3 px-4"></span>,<br />what about a pong game?</h2>
                    </div>
                    <div class="mx-auto mt-10 lg:mx-0 lg:max-w-none">
                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 text-base/7 font-semibold text-white sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-2 lg:gap-x-10">
                        <button data-action="find-match" type="button" class="inline-block rounded-md border border-transparent bg-switch1-100 px-8 py-3 text-center font-medium text-white hover:bg-switch1-80">Remote game <span aria-hidden="true">&rarr;</span></button>
                        <button data-action="play-friends" type="button" class="inline-block rounded-md border border-transparent bg-switch1-100 px-8 py-3 text-center font-medium text-white hover:bg-switch1-80">Local game <span aria-hidden="true">&rarr;</span></button>
                        <button data-action="find-tournament" type="button" class="inline-block rounded-md border border-transparent bg-switch1-100 px-8 py-3 text-center font-medium text-white hover:bg-switch1-80">Tournament <span aria-hidden="true">&rarr;</span></button>
                    </div>
                    </div>
                </div>

                <div class="px-6 lg:max-w-7xl lg:px-8 col-span-3 xl:col-span-1">
                    <div class="grid h-full bg-white rounded-[1rem]">
                        <div class="relative lg:col-span-1 max-h-[412px]">
                            <div class="absolute inset-px"></div>
                            <div class="relative flex h-full flex-col overflow-hidden">
                            <div class="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                <div class="grid grid-cols-2">
                                    <div class="col-span-1">
                                        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Friends</h2>
                                    </div>
                                    <div class="col-span-1">
                                        <div class="flex items-center justify-end gap-x-6">
                                            <button data-action="add-friend" type="button" class="rounded-md bg-switch1-100 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-switch1-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-switch1-100">Add a friend</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="not-prose overflow-auto rounded-lg outline outline-white/5 p-8 h-full">
                                <ul id="friend-list" role="list" class="relative flex h-full flex-col overflow-y-scroll rounded-xl ring-1 ring-black/5 px-5 divide-y divide-gray-100">
                                </ul>
                            </div>
                            </div>
                            <div class="pointer-events-none absolute inset-px shadow-sm ring-1 ring-black/5"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getInviteFriendsView()
{
    return `

        <div class="bg-gray-50 pt-16 pb-16">
            <div id="player-list" data-match-id="match1" class="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8 grid grid-cols-2 gap-4">
                <div id="host" class="inline-flex flex-auto w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset py-5 cursor-not-allowed" disabled>
                    <div class="flex min-w-0 gap-x-4">
                        <img class="size-12 flex-none rounded-full bg-gray-50" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80" alt="">
                        <div class="min-w-0 flex-auto">
                            <p id="username" class="text-sm/6 font-semibold text-gray-900"></p>
                            <div class="mt-1 flex items-center gap-x-1.5">
                                <div class="flex-none rounded-full bg-orange-500/20 p-1">
                                    <div class="size-1.5 rounded-full bg-orange-500"></div>
                                </div>
                                <p class="text-xs/5 text-gray-500">No ready yet</p>
                            </div>
                        </div>
                    </div>               
                </div>
            </div>
        </div>

    `;
}

function getMatchView()
{
    return `

        <div class="bg-gray-50 pt-16 pb-16">

            <div id="match-view">

                <div id="player-list" class="mx-auto px-6 max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:px-8 lg:flex gap-2 lg:gap-4">
                </div>

				<div class="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 text-center flex flex-col items-center">
					<canvas id="myCanvas" width="0" height="0" class="bg-transparent rounded-lg"></canvas>
				</div>
            </div>

        </div>

    `;
}

function getTournamentView()
{
    return `

        <div class="bg-gray-50 pt-16 pb-16">

                <canvas id="myCanvas" width="0" height="0" class="bg-transparent rounded-lg mx-auto"></canvas>
            
                <div id="tournament-tree" class="mx-auto px-6 max-w-7xl lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">

                <div id="participant-list" class="grid gap-2 grid-rows-9 opacity-100">

                    <h3 class="text-base font-semibold text-gray-900 row-span-1">Players</h3>

                    <div id="current-user" class="inline-flex flex-auto w-full justify-left rounded-md bg-white pl-10 pr-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset py-5 row-span-2 items-center">
                        <div class="flex min-w-0 gap-x-4">
                            <span id="default-avatar-profile" class="size-12 shrink-0 rounded-full bg-gray-100 size-12 rounded-full bg-gray-100 text-center content-center uppercase font-bold content-center uppercase font-bold"></span>
                            <div class="min-w-0 flex-auto">
                                <p class="text-sm/6 font-semibold text-gray-900">Host</p>
                                <p id="set_username" class="text-sm/6 font-semibold text-switch2-100"></p>
                            </div>
                        </div>
                    </div>

                    <div class="inline-flex flex-auto w-full justify-left rounded-md bg-white pl-10 pr-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset py-5 row-span-2 items-center">
                        <div class="flex items-center gap-x-3">
                            <svg id="avatar_username_button_1" class="size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd"></path>
                            </svg>
                            <div class="min-w-0 flex-auto">
                                <p class="text-sm/6 font-semibold text-gray-900 mb-1">Guest 1</p>
                                <button id="username_button_1" type="button" data-action="add-username" class="flex rounded-md px-2.5 py-1.5 text-sm font-semibold text-white bg-switch1-100 hover:bg-switch1-80 gap-2 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    Add username
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="inline-flex flex-auto w-full justify-left rounded-md bg-white pl-10 pr-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset py-5 row-span-2 items-center">
                        <div class="flex items-center gap-x-3">
                            <svg id="avatar_username_button_2" class="size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd"></path>
                            </svg>
                            <div class="min-w-0 flex-auto">
                                <p class="text-sm/6 font-semibold text-gray-900 mb-1">Guest 2</p>
                                <button id="username_button_2" type="button" data-action="add-username" class="flex rounded-md px-2.5 py-1.5 text-sm font-semibold text-white bg-switch1-100 hover:bg-switch1-80 gap-2 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    Add username
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="inline-flex flex-auto w-full justify-left rounded-md bg-white pl-10 pr-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset py-5 row-span-2 items-center">
                        <div class="flex items-center gap-x-3">
                            <svg id="avatar_username_button_3" class="size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd"></path>
                            </svg>
                            <div class="min-w-0 flex-auto">
                                <p class="text-sm/6 font-semibold text-gray-900 mb-1">Guest 3</p>
                                <button id="username_button_3" type="button" data-action="add-username" class="flex rounded-md px-2.5 py-1.5 text-sm font-semibold text-white bg-switch1-100 hover:bg-switch1-80 gap-2 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    Add username
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="grid gap-2 grid-rows-9">

                    <h3 id="round1-h3" class="text-base font-semibold text-gray-900 row-span-1 opacity-100">Round 1</h3>

                    <div id="match0" class="row-span-4 grid gap-4 grid-rows-2 border rounded-md border-gray-300 p-4 opacity-25">
                        <div class="inline-flex flex-auto w-full justify-left rounded-md bg-white pl-10 pr-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset py-5 row-span-2 items-center border-t-4">
                            <div class="flex items-center gap-x-3">
                                <svg id="avatar" class="size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd"></path>
                                </svg>
                                <div class="min-w-0 flex-auto">
                                    <p class="text-sm/6 font-semibold text-gray-900 mb-1">Player 1</p>
                                    <p id="username">???</p>
                                </div>
                            </div>
                        </div>
                        <div class="inline-flex flex-auto w-full justify-left rounded-md bg-white pl-10 pr-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset py-5 row-span-2 items-center border-b-4">
                            <div class="flex items-center gap-x-3">
                                <svg id="avatar" class="size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd"></path>
                                </svg>
                                <div class="min-w-0 flex-auto">
                                    <p class="text-sm/6 font-semibold text-gray-900 mb-1">Player 2</p>
                                    <p id="username">???</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="match1" class="row-span-4 grid gap-4 grid-rows-2 border rounded-md border-gray-300 p-4 opacity-25">
                        <div class="inline-flex flex-auto w-full justify-left rounded-md bg-white pl-10 pr-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset py-5 row-span-2 items-center border-t-4">
                            <div class="flex items-center gap-x-3">
                                <svg id="avatar" class="size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd"></path>
                                </svg>
                                <div class="min-w-0 flex-auto">
                                    <p class="text-sm/6 font-semibold text-gray-900 mb-1">Player 1</p>
                                    <p id="username">???</p>
                                </div>
                            </div>
                        </div>
                        <div class="inline-flex flex-auto w-full justify-left rounded-md bg-white pl-10 pr-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset py-5 row-span-2 items-center border-b-4">
                            <div class="flex items-center gap-x-3">
                                <svg id="avatar" class="size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd"></path>
                                </svg>
                                <div class="min-w-0 flex-auto">
                                    <p class="text-sm/6 font-semibold text-gray-900 mb-1">Player 2</p>
                                    <p id="username">???</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div id="round2" class="grid gap-2 grid-rows-9">
                    <h3 class="text-base font-semibold text-gray-900 row-span-1">Round 2</h3>
                    <div id="match2" class="row-span-8 grid gap-4 grid-rows-2 border rounded-md border-gray-300 p-4 opacity-25">
                        <div class="inline-flex flex-auto w-full justify-left rounded-md bg-white pl-10 pr-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset py-5 row-span-1 items-center border-t-4">
                            <div class="flex items-center gap-x-3">
                                <svg id="avatar" class="size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd"></path>
                                </svg>
                                <div class="min-w-0 flex-auto">
                                    <p class="text-sm/6 font-semibold text-gray-900 mb-1">Player 1</p>
                                    <p id="username">???</p>
                                </div>
                            </div>
                        </div>
                        <div class="inline-flex flex-auto w-full justify-left rounded-md bg-white pl-10 pr-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset py-5 row-span-1 items-center border-b-4">
                            <div class="flex items-center gap-x-3">
                                <svg id="avatar" class="size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd"></path>
                                </svg>
                                <div class="min-w-0 flex-auto">
                                    <p class="text-sm/6 font-semibold text-gray-900 mb-1">Player 2</p>
                                    <p id="username">???</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="round3" class="grid gap-2 grid-rows-9 opacity-25">
                <h3 class="text-base font-semibold text-gray-900 row-span-1">Winner</h3>
                <div class="inline-flex items-center rounded-md px-4 py-2 text-sm leading-6 font-semibold transition duration-150 ease-in-out bg-white text-gray-900 rounded-md border border-gray-300 justify-center w-full row-span-8">
                    <div class="justify-center w-full">
                        <svg id="winner-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-20 text-gray-300 w-full mb-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"></path>
                        </svg>
                        <div class="inline-flex flex-auto w-full justify-left rounded-md bg-white pl-10 pr-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset py-5 row-span-2 items-center">
                            <div class="flex items-center gap-x-3">
                                <svg id="avatar" class="size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                                    <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd"></path>
                                </svg>
                                <div class="min-w-0 flex-auto">
                                    <p class="text-sm/6 font-semibold text-gray-900 mb-1">Winner</p>
                                    <p id="username">???</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            </div>
        </div>

    `;
}

function getProfileView()
{
    return `

        <div class="bg-gray-50 pt-16 pb-16">
            <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 inset-px bg-white rounded-[1rem] mb-8 border border-gray-200">

                <div class="lg:flex lg:items-center lg:justify-between py-6 border-b-1 mb-6">
                    <div class="min-w-0 flex-1">
                        <h2 class="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Details</h2>
                    </div>
                </div>
                
                <div id="details" class="mt-6 border-t border-gray-100">

                    <dl class="divide-y divide-gray-100">

                        <form method="POST" id="form-avatar" action="#" class="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0 items-center">
                            <label for="avatar" class="text-sm/6 font-medium text-gray-900 align-middle">Avatar</label>
                            <div id="avatar-parent-profile" class="block w-full sm:w-lg bg-white py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-2 sm:text-sm/6 sm:flex items-center gap-x-3">
                                <div class="flex gap-x-3 items-center mb-2 sm:mb-0">
                                    <span id="default-avatar-profile" class="size-12 shrink-0 rounded-full bg-gray-100 size-12 rounded-full bg-gray-100 text-center content-center uppercase font-bold content-center uppercase font-bold"></span>
                                    <div class="flex text-sm/6 text-gray-600">
                                        <label for="upload-avatar" class="relative cursor-pointer rounded-md bg-white font-semibold text-switch1-100 focus-within:ring-2 focus-within:ring-switch1-100 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-switch1-80">
                                            <input id="upload-avatar" name="upload-avatar" type="file" accept="image/png, image/jpg" />
                                        </label>
                                    </div>
                                </div>
                                <button id="submit-button" type="submit" data-action="save-avatar" class="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs sm:ml-3 sm:w-auto bg-switch1-100 hover:bg-switch1-80 disabled:bg-gray-200 cursor-not-allowed" disabled>Save</button>
                            </div>
                        </form>

                        <div class="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0 items-center">
                            <label for="username" class="text-sm/6 font-medium text-gray-900">Username</label>
                            <input type="text" name="username" id="username" autocomplete="current-username" required disabled class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-switch1-100 sm:text-sm/6 disabled:bg-gray-200 col-span-2">
                        </div>

                        <form method="POST" id="form-password" action="#" class="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0 items-center">
                            <label for="password" class="text-sm/6 font-medium text-gray-900">Password</label>
                            <div class="flex col-span-2">
                                <input type="password" name="password" id="password" autocomplete="current-password" required disabled class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-switch1-100 sm:text-sm/6 disabled:bg-gray-200">
                                <button id="update-button" type="button" data-action="update-password" class="inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs ml-3 sm:w-auto bg-switch1-100 hover:bg-switch1-80">Update</button>
                            </div>
                        </form>

                        <div class="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0 items-center">
                            <label for="mail" class="text-sm/6 font-medium text-gray-900 align-middle">Email address</label>
                            <input type="mail" name="mail" id="mail" autocomplete="current-mail" required disabled class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-switch1-100 sm:text-sm/6 disabled:bg-gray-200 col-span-2">
                        </div>

                        <form method="POST" id="form-2fa" action="#">
                            <div class="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0 items-center">
                                <label for="2fa" class="text-sm/6 font-medium text-gray-900 align-middle">2FA</label>
                                <button id="submit-button" type="submit" data-action="handle-2fa" class="flex w-full justify-center rounded-md bg-switch1-100 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-switch1-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-switch1-100 col-span-2">Enable 2FA</button>
                            </div>
                        </form>

                    </dl>

                </div>

            </div>

            <div id="match-history-2" class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 inset-px bg-white rounded-[1rem] mt-8 border border-gray-200">
                <div class="lg:flex lg:items-center lg:justify-between py-6 border-b-1 mb-6">
                    <div class="min-w-0 flex-1">
                        <h2 class="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Match history (2 players)</h2>
                    </div>
                    <div class="mt-5 flex lg:mt-0 lg:ml-4 grid grid-cols-4 gap-4">
                        <div class="flex items-center gap-2 col-span-2 sm:col-span-1">
                            <p class="text-right">Victories</p>
                            <span id="victories" class="inline-flex items-center rounded-md bg-white px-2 py-1 text-3xl font-medium text-switch3-100 ring-1 ring-switch3-100/20 ring-inset justify-center w-full"></span>
                        </div>
                        <div class="flex items-center gap-2 col-span-2 sm:col-span-1">
                            <p class="text-right">Defeats</p>
                            <span id="defeats" class="inline-flex items-center rounded-md bg-white px-2 py-1 text-3xl font-medium text-switch2-100 ring-1 ring-switch2-100/20 ring-inset justify-center w-full"></span>
                        </div>
                        <div class="flex items-center gap-2 col-span-3 sm:col-span-1">
                            <p class="text-right shrink-0">Win rate</p>
                            <span id="winrate" class="inline-flex items-center rounded-md bg-white px-2 py-1 text-3xl font-medium text-switch1-100 ring-1 ring-switch1-100/20 ring-inset justify-center w-full"></span>
                        </div>
                        <button id="update-button" type="button" data-action="see-pie-chart" data-player-number="2" class="inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs sm:w-auto bg-switch1-100 hover:bg-switch1-80 col-span-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Id
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Opponent
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Date
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Statut
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>

            <div id="match-history-4" class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 inset-px bg-white rounded-[1rem] mt-8 border border-gray-200">
                <div class="lg:flex lg:items-center lg:justify-between py-6 border-b-1 mb-6">
                    <div class="min-w-0 flex-1">
                        <h2 class="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Match history (4 players)</h2>
                    </div>
                    <div class="mt-5 flex lg:mt-0 lg:ml-4 grid grid-cols-4 gap-4">
                        <div class="flex items-center gap-2 col-span-2 sm:col-span-1">
                            <p class="text-right">Victories</p>
                            <span id="victories" class="inline-flex items-center rounded-md bg-white px-2 py-1 text-3xl font-medium text-switch3-100 ring-1 ring-switch3-100/20 ring-inset justify-center w-full"></span>
                        </div>
                        <div class="flex items-center gap-2 col-span-2 sm:col-span-1">
                            <p class="text-right">Defeats</p>
                            <span id="defeats" class="inline-flex items-center rounded-md bg-white px-2 py-1 text-3xl font-medium text-switch2-100 ring-1 ring-switch2-100/20 ring-inset justify-center w-full"></span>
                        </div>
                        <div class="flex items-center gap-2 col-span-3 sm:col-span-1">
                            <p class="text-right shrink-0">Win rate</p>
                            <span id="winrate" class="inline-flex items-center rounded-md bg-switch1-100/ px-2 py-1 text-3xl font-medium text-switch1-100 ring-1 ring-switch1-100/20 ring-inset justify-center w-full"></span>
                        </div>
                        <button id="update-button" type="button" data-action="see-pie-chart" data-player-number="4" class="inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs sm:w-auto bg-switch1-100 hover:bg-switch1-80">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Id
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Opponent 1
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Opponent 2
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Opponent 3
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Date
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Statut
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 inset-px bg-white rounded-[1rem] mt-8 border border-gray-200 hidden">
                <div class="lg:flex lg:items-center lg:justify-between py-6 border-b-1 mb-6">
                <div class="min-w-0 flex-1">
                    <h2 class="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Tournament history</h2>
                </div>
                <div class="mt-5 flex lg:mt-0 lg:ml-4 grid grid-cols-2 gap-4">
                    <div class="grid grid-cols-2 items-center gap-2">
                        <p class="text-right">Victories</p>
                        <span id="tournament_win" class="inline-flex items-center rounded-md bg-white px-2 py-1 text-3xl font-medium text-switch3-100 ring-1 ring-switch3-100/20 ring-inset justify-center"></span>
                    </div>
                    <div class="grid grid-cols-2 items-center gap-2">
                        <p class="text-right">Defeats</p>
                        <span id="tournament_loss" class="inline-flex items-center rounded-md bg-white px-2 py-1 text-3xl font-medium text-switch2-100 ring-1 ring-switch2-100/10 ring-inset justify-center"></span>
                    </div>
                </div>
                </div>
                <div class="mt-6">
                <table class="w-full table-auto border-collapse text-sm">
                    <thead>
                    <tr>
                        <th class="border-b border-gray-200 p-4 pt-0 pb-3 pl-0 text-left font-medium text-gray-400 dark:border-gray-600 dark:text-gray-200">Song</th>
                        <th class="border-b border-gray-200 p-4 pt-0 pb-3 pl-8 text-left font-medium text-gray-400 dark:border-gray-600 dark:text-gray-200">Artist</th>
                        <th class="border-b border-gray-200 p-4 pt-0 pb-3 pl-8 text-left font-medium text-gray-400 dark:border-gray-600 dark:text-gray-200">Year</th>
                        <th class="border-b border-gray-200 p-4 pt-0 pb-3 pl-8 text-left font-medium text-gray-400 dark:border-gray-600 dark:text-gray-200">Year</th>
                        <th class="border-b border-gray-200 p-4 pt-0 pb-3 pl-8 text-left font-medium text-gray-400 dark:border-gray-600 dark:text-gray-200">Year</th>
                    </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800">
                    <tr>
                        <td class="border-b border-gray-100 pt-4 pr-4 pb-4 pl-0 text-gray-500 dark:border-gray-700 dark:text-gray-400">The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                        <td class="border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400">Malcolm Lockyer</td>
                        <td class="border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400">1961</td>
                        <td class="border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400">Malcolm Lockyer</td>
                        <td class="border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                        <a href="#" class="rounded-md bg-switch1-100 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-switch1-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-switch1-100">See tree</a>
                        </td>
                    </tr>
                    <tr>
                        <td class="border-b border-gray-100 pt-4 pr-4 pb-4 pl-0 text-gray-500 dark:border-gray-700 dark:text-gray-400">Witchy Woman</td>
                        <td class="border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400">Malcolm Lockyer</td>
                        <td class="border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400">1961</td>
                        <td class="border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400">Malcolm Lockyer</td>
                        <td class="border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                        <a href="#" class="rounded-md bg-switch1-100 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-switch1-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-switch1-100">See tree</a>
                        </td>
                    </tr>
                    <tr>
                        <td class="border-b border-gray-100 pt-4 pr-4 pb-4 pl-0 text-gray-500 dark:border-gray-700 dark:text-gray-400">Shining Star</td>
                        <td class="border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400">Malcolm Lockyer</td>
                        <td class="border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400">1961</td>
                        <td class="border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400">Malcolm Lockyer</td>
                        <td class="border-b border-gray-100 p-4 pl-8 text-gray-500 dark:border-gray-700 dark:text-gray-400">
                        <a href="#" class="rounded-md bg-switch1-100 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-switch1-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-switch1-100">See tree</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </div>

    `;
}

function getProfileViewId()
{
    return `

        <div class="bg-gray-50 pt-16 pb-16">
            <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 inset-px bg-white rounded-[1rem] mb-8 border border-gray-200">

                <div class="lg:flex lg:items-center lg:justify-between py-6 border-b-1 mb-6">
                    <div class="min-w-0 flex-1">
                        <h2 class="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Details</h2>
                    </div>
                </div>
                
                <div id="details" class="mt-6 border-t border-gray-100">

                    <dl class="divide-y divide-gray-100">

                        <div class="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0 items-center">
                            <label for="avatar" class="text-sm/6 font-medium text-gray-900 align-middle">Avatar</label>
                            <div id="avatar-parent-profile" class="flex items-center gap-x-3 col-span-2">
                                <span id="default-avatar-profile" class="size-12 shrink-0 rounded-full bg-gray-100 text-center content-center uppercase font-bold"></span>
                            </div>
                        </div>

                        <div class="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0 items-center">
                            <label for="username" class="text-sm/6 font-medium text-gray-900">Username</label>
                            <input type="text" name="username" id="username" autocomplete="current-username" required disabled class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-switch1-100 sm:text-sm/6 disabled:bg-gray-200 col-span-2">
                        </div>

                        <div class="px-4 py-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-0 items-center">
                            <label for="mail" class="text-sm/6 font-medium text-gray-900 align-middle">Email address</label>
                            <input type="mail" name="mail" id="mail" autocomplete="current-mail" required disabled class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-switch1-100 sm:text-sm/6 disabled:bg-gray-200 col-span-2">
                        </div>

                    </dl>

                </div>

            </div>

        </div>    

    `;
}

async function updateH1(h1: string)
{
    const h1Placeholder = document.querySelector("h1");

    if (h1Placeholder === null)
    {
        return ;
    }

    h1Placeholder.innerText = h1;
}

async function importScript(pathname: string)
{
    (await import("/dist" + pathname + ".js")).init();
}

async function removeBodyScript()
{
    const script = document.body.querySelector("script");

    if (script)
    {
        script.remove();
    }
}

async function renderMain(pathname: string)
{
    removeBodyScript();

    const main = document.querySelector("main");

    if (main === null)
    {
        return ;
    }

    let view = ``;

    switch (true)
    {   
        case (pathname === "/dashboard"):
            view = getDefaultView();
            updateH1("Dashboard");
            break;
        
        case (pathname === "/invite-friends"):
            view = getInviteFriendsView();
            updateH1("Invite friends");
            break;
        
        case (pathname === "/match"):
            view = getMatchView();
            updateH1("Match");
            break;
        
        case (pathname === "/tournament"):
            view = getTournamentView();
            updateH1("Tournament");
            break;
        
        case (pathname === "/profile"):
            view = getProfileView();
            updateH1("Profile");
            break;

        case (pathname.startsWith("/profile/")):
            view = getProfileViewId();
            updateH1("Profile");
            pathname = "/profile";
            break;
    }

    importScript(pathname);

    main.innerHTML = sanitizeHTML(view);
}

export async function loadDashboardView(href: string, updateHistory: boolean)
{
	
    updatePathname(href, updateHistory);

    if (document.querySelector("nav") === null)
    {
        await loadMainView("/dashboard", false);
    }

    removeHeaderButtons(0);
    renderMain(href);
}