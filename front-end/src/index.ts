import { getToken } from "./auth.js";
import { postReconnect } from "./common/data.js";
import { handleRooting } from "./common/rooting.js";
import { sharedData } from "./common/store.js";
import { waitForSocket, createSocket } from "./socket.js";

const debug = false;

export async function handleLoadAndPopstateEvents()
{
    const token = getToken() as string;

	const pathname = window.location.pathname;
    if (token === undefined && pathname != "/" && pathname != "/login" && pathname != "/signup" && pathname != "/404")
    {
        handleRooting("/login", null, true);
        return ;
    }

    if (token != undefined)
    {
        const responseJson = await postReconnect();
        if (responseJson != 200)
        {
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            localStorage.clear();
            handleRooting("/login", null, true);
            return ;
        }
		//if (sharedData.socket != null)
		{
            var i = 0;
			sharedData.socket.emit("auth", token, (data : boolean) => {

                if (data == false)
				{
					handleRooting("/login", null, true);
					i = 1;
				}
				else
				{
					// sharedData.socket.emit("is playing", (res : boolean, type : string) => {
					// 	console.log("type game is:", type);
					// 	sharedData.isPlaying = res;
					// 	sharedData.localGame = type == "local" ? true : false;
					// 	if (res)
					// 	{
					// 		handleRooting("/match", null, true);
					// 		i = 1;
					// 	}
					// });
				}
			});
            if (i)
				return;
		}
    }

    if (token != undefined && (pathname === "/" || pathname === "/login" || pathname === "/signup"))
    {
        handleRooting("/dashboard", null, true);
        return ;
    }
	if (pathname == "/tournament")
		sharedData.tournoi = true;
    handleRooting(pathname, null, true);
}

window.addEventListener("load", function(event)
{
	createSocket();
    waitForSocket();
});