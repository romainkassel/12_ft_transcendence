import { displayUsername } from "./common/username.js";
import { displayFriendList } from "./friends.js";
import * as rooting from "./common/rooting.js"
import { sharedData } from "./common/store.js";

async function getDashboardData()
{
  displayUsername("h2");
  displayFriendList();
}

export function init()
{
	if (sharedData.socket != null)
	{
		if (sharedData.tournoi == true)
		{
			sharedData.socket.removeAllListeners("game end tournoi");
			sharedData.socket.emit("stop tournament");
			sharedData.socketListenners.matchListenners = false;
			sharedData.localGame = false;
			sharedData.isPlaying = false;
			sharedData.tournoi = false;
		}else if (sharedData.isPlaying == true)
		{
			rooting.handleRooting("/match", null , true);
		}
		else
			getDashboardData();
	}
}