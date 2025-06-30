import { displayNavbarAvatars } from "../common/avatar.js";
import { updatePathname } from "../common/rooting.js";
import { getTokenValue, displayUsername } from "../common/username.js";
import { sanitizeHTML } from "../common/xssPrev.js";

export function getLoadingView()
{
    return `

        <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">

            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <img class="mx-auto h-50 w-auto" src="/dist/assets/switch_turn.gif" alt="Your Company">
                <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Loading website...</h2>
            </div>

        </div>

    `;
}

function getLoginView()
{
    return `

        <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">

            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <img class="mx-auto h-15 w-auto" src="/dist/assets/switch_turn.gif" alt="Your Company">
                <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
            </div>

            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

                <form class="space-y-6" action="#" method="POST">
                    <div>
                        <label for="username" class="block text-sm/6 font-medium text-gray-900">Username</label>
                        <div class="mt-2">
                            <input type="text" name="username" id="username" autocomplete="current-username" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-switch1-100 sm:text-sm/6">
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between">
                            <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
                        </div>
                        <div class="mt-2">
                            <input type="password" name="password" id="password" autocomplete="current-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-switch1-100 sm:text-sm/6">
                        </div>
                    </div>

                    <div>
                        <button id="submit-button" type="submit" data-action="dashboard" class="flex w-full justify-center rounded-md bg-switch1-100 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-switch1-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-switch1-100">Sign in</button>
                    </div>
                </form>

                <p class="mt-10 text-center text-sm/6 text-gray-500">
                    Not a member?
                    <a href="/signup" class="font-semibold text-switch1-100 hover:text-switch1-80">Create an account</a>
                </p>

            </div>

        </div>

    `;
}

function getSignupView()
{
    return `

        <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">

            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <img class="mx-auto h-15 w-auto" src="/dist/assets/switch_turn.gif" alt="Your Company">
                <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Create an account</h2>
            </div>

            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

                <form class="space-y-6" action="#" method="POST">
                    <div>
                        <label for="username" class="block text-sm/6 font-medium text-gray-900">Username</label>
                        <div class="mt-2">
                            <input type="text" name="username" id="username" autocomplete="current-username" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-switch1-100 sm:text-sm/6">
                        </div>
                    </div>

                    <div>
                        <label for="mail" class="block text-sm/6 font-medium text-gray-900">Email address</label>
                        <div class="mt-2">
                            <input type="email" name="mail" id="mail" autocomplete="current-mail" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-switch1-100 sm:text-sm/6">
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between">
                            <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
                        </div>
                        <div class="mt-2">
                            <input type="password" name="password" id="password" autocomplete="current-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-switch1-100 sm:text-sm/6">
                        </div>
                    </div>

                    <div>
                        <button id="submit-button" type="submit" data-action="dashboard" class="flex w-full justify-center rounded-md bg-switch1-100 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-switch1-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-switch1-100">Create account</button>
                    </div>

                </form>

                <p class="mt-10 text-center text-sm/6 text-gray-500">
                    Already have an account?
                    <a href="/login" class="font-semibold text-switch1-100 hover:text-switch1-80">Sign in</a>
                </p>

            </div>

        </div>

    `;
}

function getDashboardView()
{
    return `

        <div class="min-h-full">

            <nav class="bg-gray-800">
                <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 items-center justify-between">
                    <div class="flex items-center">
                    <div class="shrink-0">
                        <img class="size-10" src="/dist/assets/switch_turn.gif" alt="Your Company">
                    </div>
                    <div class="hidden md:block">
                        <div class="ml-10 flex items-baseline space-x-4">
                        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                        <a href="/dashboard" class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Dashboard</a>
                        </div>
                    </div>
                    </div>
                    
                    <div class="hidden md:block">
                    <div class="ml-4 flex items-center md:ml-6">
                        <button type="button" class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden hidden" id="notif-button" aria-haspopup="true">
                        <span class="absolute -inset-1.5"></span>
                        <span class="sr-only">View notifications</span>
                        <span>
                            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                            </svg>
                            <span id="notif-alert" class="absolute top-0 right-0 mt-0 mr-1 flex size-3" style="visibility:hidden"><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-switch2-100 opacity-75"></span><span class="relative inline-flex size-3 rounded-full bg-switch2-100"></span></span>
                        </span>
                        </button>

                        <div>
                        <span id="username-navbar" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300">
                        </span>
                        </div>

                        <!-- Profile dropdown -->
                        <div class="relative">
                        <div>
                            <button type="button" class="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                <span class="absolute -inset-1.5"></span>
                                <span class="sr-only">Open user menu</span>
                                <span id="default-avatar-navbar-desktop" class="size-8 rounded-full bg-gray-100 content-center uppercase font-bold"></span>
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

                        <div class="absolute right-27 z-10 mt-2 w-96 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-hidden" style="display:none" role="menu" aria-orientation="vertical" aria-labelledby="notif-button" tabindex="-1">
                            <!-- Active: "bg-gray-100 outline-hidden", Not Active: "" -->
                            <div class="bg-white px-4 py-2">
                            <div class="sm:flex sm:items-start">
                                
                                <div class="mt-3 text-center sm:mt-0 sm:text-left">
                                <h3 class="text-base font-semibold text-gray-900">Notifications</h3>
                                <div class="mt-2">
                                    <p class="text-sm text-gray-500">Here are all your notifications.</p>
                                </div>
                                </div>
                            </div>
                            </div>
                            <ul id="notif-list">
                            <li class="mx-4 my-2 px-4 py-2 flex justify-between rounded-md border border-gray-200 items-center">
                                <div class="text-sm text-gray-700 mr-4">
                                John Doe invited your for a game.
                                </div>
                                <div>
                                <a href="/invite-friends" class="text-sm text-switch1-100 hover:text-switch1-80">
                                    Accept
                                </a>
                                </div>
                            </li>
                            <li class="mx-4 my-2 px-4 py-2 flex justify-between rounded-md border border-gray-200 items-center">
                                <div class="text-sm text-gray-700 mr-4">
                                John Doe sent your a friend request.
                                </div>
                                <div>
                                <a class="text-sm text-switch1-100 hover:text-switch1-80">
                                    Accept
                                </a>
                                </div>
                            </li>
                            <li class="mx-4 my-2 px-4 py-2 flex justify-between rounded-md border border-gray-200 items-center">
                                <div class="text-sm text-gray-700 mr-4">
                                John Doe invited you for a tournament.
                                </div>
                                <div>
                                <a class="text-sm text-switch1-100 hover:text-switch1-80">
                                    Accept
                                </a>
                                </div>
                            </li>
                            <li class="mx-4 my-2 px-4 py-2 flex justify-between rounded-md border border-gray-200 items-center">
                                <div class="text-sm text-gray-700 mr-4">
                                Quo cognito Constantius ultra mortalem modum exarsit ac nequo casu idem Gallus de futuris incertus agitare quaedam conducentia saluti suae per itinera conaretur, remoti sunt omnes de industria milites agentes in civitatibus perviis.
                                </div>
                                <div>
                                <a class="text-sm text-switch1-100 hover:text-switch1-80">
                                    Accept
                                </a>
                                </div>
                            </li>
                            </ul>
                        </div>

                        <div class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-hidden divide-y divide-gray-100" style="display:none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                            <!-- Active: "bg-gray-100 outline-hidden", Not Active: "" -->
                            <div class="py-1" role="none">
                                <a data-menu-type="popup" href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" role="menuitem" tabindex="-1">Profile</a>
                            </div>
                            <div class="py-1" role="none">
                                <button type="button" data-action="signout" class="block px-4 py-2 text-sm text-switch2-100 hover:bg-gray-100 w-full text-left" role="menuitem" tabindex="-1">Sign out</a>
                            </div>
                        </div>

                        </div>
                    </div>
                    </div>
                    <div class="-mr-2 flex md:hidden">
                    <!-- Mobile menu button -->
                    <button data-action="handle-mobile-menu" type="button" class="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden" aria-controls="mobile-menu" aria-expanded="false">
                        <span class="absolute -inset-0.5"></span>
                        <span class="sr-only">Open main menu</span>
                        <!-- Menu open: "hidden", Menu closed: "block" -->
                        <svg class="block size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                        <!-- Menu open: "block", Menu closed: "hidden" -->
                        <svg class="hidden size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                    </div>
                </div>
                </div>

                <!-- Mobile menu, show/hide based on menu state. -->
                <div class="hidden md:hidden" id="mobile-menu">
                <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                    <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                    <a href="/dashboard" class="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Dashboard</a>
                </div>
                <div class="border-t border-gray-700 pt-4 pb-3">
                    <div class="flex items-center px-5">
                        <span id="default-avatar-navbar-mobile" class="size-10 rounded-full bg-gray-100 text-center content-center uppercase font-bold"></span>
                        <div class="ml-3">
                            <div id="username-navbar" class="text-base/5 font-medium text-white"></div>
                            <div id="mail-navbar" class="text-sm font-medium text-gray-400"></div>
                        </div>
                        <button type="button" class="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                            <span class="absolute -inset-1.5"></span>
                            <span class="sr-only">View notifications</span>
                            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                            </svg>
                        </button>
                    </div>
                    <div class="mt-3 space-y-1 px-2">
                        <a href="/profile" class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white w-full text-left" role="menuitem">Profile</a>
                        <button type="button" data-action="signout" class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white w-full text-left" role="menuitem">Sign out</a>
                    </div>
                </div>
                </div>
            </nav>

            <header class="bg-white shadow-sm">
                <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between">
                    <div>
                        <h1 class="text-3xl font-bold tracking-tight text-gray-900">match h1</h1>
                    </div>
                    <div id="header-button-placeholder" class="sm:flex sm:flex-row-reverse">
                    </div>
                </div>
            </header>

            <main></main>

        </div>

    `;
}

function get404View()
{
    return `

        <main class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">

            <div class="text-center">
                <p class="text-base font-semibold text-switch1-100">404</p>
                <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">Page not found</h1>
                <p class="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">Sorry, we couldn’t find the page you’re looking for.</p>
                <div class="mt-10 flex items-center justify-center gap-x-6">
                    <button type="button" data-action="go-back-home" class="rounded-md bg-switch1-100 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-switch1-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-switch1-100">Go back home</button>
                </div>
            </div>

        </main>
    `;
}

function displayNavbarMail()
{
    const placeholder = document.getElementById("mail-navbar");

    if (placeholder === null)
    {
        return ;
    }

    placeholder.innerText = getTokenValue("mail");
}

export async function loadMainView(href: string, updateHistory: boolean)
{
    updatePathname(href, updateHistory);

    let view = '';

    switch (href)
    {
        case "/":
        case "/login":
            view = getLoginView();
            break;
        
        case "/signup":
            view = getSignupView();
            break;
        
        case "/dashboard":
            view = getDashboardView();
            break;
        
        case "/404":
            view = get404View();
            break;
            
    }

    document.body.innerHTML = sanitizeHTML(view);

    if (href === "/dashboard")
    {
        displayUsername("navbar");
        displayNavbarMail();
        displayNavbarAvatars();
    }
}