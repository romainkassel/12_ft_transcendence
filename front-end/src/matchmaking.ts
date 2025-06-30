import { createComponent } from "./common/components.js";
import { closeDialog, displayDialog, getSelectedCard } from "./common/dialogs.js";
import { sharedData } from "./common/store.js";
import * as rooting from "./common/rooting.js";
import * as dialogs from "./common/dialogs.js";
import { sanitizeHTML } from "./common/xssPrev.js";

function getProcessingButton() {

  return `

    <button type="button" class="inline-flex cursor-not-allowed items-center rounded-md bg-switch1-100 px-4 py-2 text-sm leading-6 font-semibold text-white transition duration-150 ease-in-out hover:bg-switch1-80" disabled="">
        <svg class="mr-3 -ml-1 size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Looking for players
    </button>

  `;

}

export function findMatch()
{
    displayDialog("find-match");
}

export async function processMatch()
{
    const selectedCard = getSelectedCard() as HTMLButtonElement;

    sharedData.match.playerNumber = Number(selectedCard.innerText);

    closeDialog();

	if (sharedData.socket != null)
	{
		if (sharedData.match.playerNumber === 2)
        {
            sharedData.socket.emit("join waitlist", "duo");
            await displayDialog("process-match-2");
        }
		else if (sharedData.match.playerNumber === 4)
        {
            sharedData.socket.emit("join waitlist", "quatuor");
            await displayDialog("process-match-4");
        }		
		sharedData.socket.once("game created", (data : any) => {

            sharedData.match.players = data;

			rooting.handleRooting("/match", null , true);
			dialogs.closeDialog();
		})
	}
}