import { handleMobileMenu, updateNavbarState } from "./navbar.js";
import { savePassword, updatePassword, seeMatchDetails } from "../profile.js";
import { saveAvatar } from "./avatar.js";
import { handle2faFromLogin, handleAuth, handle2fa, signout, getToken } from "../auth.js";
import { displayMenu } from "./menus.js";
import { closeDialog, displayDialog, setDisabled, updateButtonSelection } from "./dialogs.js";
import { addFriend, seeProfile, delFriend } from "../friends.js";
import { processMatch } from "../matchmaking.js";
import { sendInvite } from "../invite-friends.js";
import { loadDashboardView } from "../views/dashboardViews.js";
import { addUsername, findTournament, leaveTournament, startTournament, updateUsername } from "../tournament.js";
import { startMatch, leaveMatch, pauseMatch, stopPause } from "../match.js";
import { displayNextMatch } from "../tournament.js";
import { loadMainView } from "../views/mainViews.js";
import { displayPieChart } from "../chart.js";
import { sharedData } from "./store.js";

function goBackHomeFrom404()
{
    const token = getToken() as string;

    if (token === undefined)
    {
        handleRooting("/login", null, false);
        window.location.pathname = "/";
        return ;
    }

    handleRooting("/dashboard", null, false);
    window.location.pathname = "/dashboard";
}

export function updatePathname(newPathname: string, updateHistory: boolean)
{
    if (updateHistory === false)
    {
        return ;
    }

    window.history.pushState({}, "", newPathname)
}

export function handleSubmitActions(button: HTMLButtonElement)
{
    const action = button.getAttribute("data-action");

    switch (action)
    {
        // Login and signup pages

        case "submit-2fa-code":
            handle2faFromLogin();
            break;

        case "dashboard":

            handleAuth();
            break;

        // Dialogs

        case "add-as-friend":

            addFriend();
            break;

        case "save-password":

            savePassword(button);
            break;

        // profile

        case "save-avatar":

            saveAvatar(button);
            break;

        case "handle-2fa":

            handle2fa();
            break;

        // tournament

        case "username_button_1":
        case "username_button_2":
        case "username_button_3":

            updateUsername(action);
            break;
    }
}

export function handleButtonActions(button: HTMLButtonElement, updateHistory: boolean)
{
    if (button.getAttribute("aria-haspopup") === "true")
    {
        displayMenu(button);
        return ;
    }

    const dataAction = button.getAttribute("data-action");

    switch (dataAction)
    {
        // Global

        case "signout":

            if (sharedData.isPlaying === true)
            {
                return ;
            }
            
            displayDialog(dataAction);
            break;

        case "find-match":
        case "invite-friend":
        case "leave-match":
        case "leave-tournament":
        case "add-friend":
            displayDialog(dataAction);
            break;
        
        case "play-friends":
            if (sharedData.socket != null)
            {
                sharedData.socket.emit("local", 1);
                sharedData.localGame = true;
                // Besoin du flag localGame2 pour ne pas afficher lobby dans game locale
                // Doublon avec flag localGame car localGame n'est pas set à true lors de l'init de la page match...très bizarre
                sharedData.localGame2 = true;
                sharedData.socket.once("start local game", (data : any) =>{handleRooting("/match", null , true);});
            }
            break;

        // Dashboard homepage

        case "see-profile":

            seeProfile(button);
            break;

        case "del-friend":

            delFriend(button);
            break;

        // Dialogs

        case "process-match":

            processMatch();
            break;

        case "invite-friends":
            //inviteFriends(dataAction, true);
            break;

        case "confirm-signout":

            signout();
            break;

        case "send-invite":

            sendInvite();
            break;

        // Match

        case "start-match":

            startMatch(dataAction, false);
            break;

        case "get-ready":
            sharedData.socket.emit("ready");
            const button_ready = document.getElementById("header-button") as HTMLButtonElement
            if (button_ready)
                setDisabled(button_ready)

			break;

        case "pause-match":
            pauseMatch(dataAction);
            break;

        case "stop-pause":
            stopPause();
            break;

        case "confirm-leave-match":

            leaveMatch();
            break;

        case "go-to-dashboard":

            loadDashboardView("/dashboard", true);
            break;

        // tournament

        case "add-username":
            addUsername(button, dataAction);
            break;


        case "find-tournament":

            findTournament();
            break;

        case "start-tournament":

            startTournament();
            break;

        case "display-next-match":

            displayNextMatch();
            break;

        case "confirm-leave-tournament":

            leaveTournament();
            break;

        case "cancel":
        case "close":

            closeDialog();
            break;

        // 404

        case "go-back-home":

            goBackHomeFrom404();
            break;

        // Profile

        case "update-password":

            updatePassword(button);
            break;

        case "select-button":

            updateButtonSelection(button.id);
            break;

        case "see-match-details":

            seeMatchDetails(button);
            break;

        case "handle-mobile-menu":
            handleMobileMenu();
            break;

        case "see-pie-chart":

            displayPieChart(button);
            break;

		case "leave-waitlist":
			sharedData.socket.emit("leave waitlist");
			break;
    }

    if (button.id === "confirm-button")
    {
        closeDialog();
    }
}

export async function handleRooting(href: string, anchor: HTMLAnchorElement | null, updateHistory: boolean)
{
	// if (sharedData.socket != null)
	// {
	// 	sharedData.socket.emit("is auth", (data: boolean) => {
	// 		if (data == tru)
	// 	})
	// }
	//console.log("is playng :", sharedData.isPlaying, " local ?", sharedData.localGame);

	
	if (href != "/match" && sharedData.socketListenners.matchListenners == true)
		return ;

	// if (href != "/tournament")
	// 	sharedData.tournoi = false;

    if ((href === "/dashboard" || href === "/profile")
        && window.location.pathname === "/tournament"
        && sharedData.tournament.shouldUserLeave === false)
    {
        return ;
    }

    switch (true) {

        case (href === "/"):
        case (href === "/login"):
        case (href === "/signup"):
        case (href === "/404"):

            loadMainView(href, updateHistory);
            break;

        // navbar anchors

        case (href === "/dashboard"):
        case (href.startsWith("/profile")):
        case (href === "/tournament"):
        case (href === "/match"):
            loadDashboardView(href, updateHistory);
            break;

        default:

            loadMainView("/404", updateHistory);
            break;
    }

    updateNavbarState(href);
}
