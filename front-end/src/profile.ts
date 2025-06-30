import { getInputValue } from "./auth.js";
import { Data, displayBarChart } from "./chart.js";
import { displayAvatar } from "./common/avatar.js";
import { createComponent } from "./common/components.js";
import { fetchData, getData } from "./common/data.js";
import { sharedData } from "./common/store.js";
import { displayToast } from "./common/toasts.js";
import { sanitizeHTML } from "./common/xssPrev.js";
import { handleRooting } from "./common/rooting.js";

declare const Chart: any;

function insertDetailsComponent(body: HTMLBodyElement)
{
    const classes = "relative z-10";

    const div = createComponent("div", classes, "details-component") as HTMLDivElement;

    div.setAttribute("aria-labelledby", "slide-over-title");
    div.setAttribute("role", "dialog");
    div.setAttribute("aria-modal", "true");
    div.id = "details-component";

    body.insertBefore(div, body.firstChild);
}

export async function seeMatchDetails(button: HTMLButtonElement)
{
    const body = document.querySelector("body");

    if (body === null)
    {
        return ;
    }

    insertDetailsComponent(body);

    const matchId = button.getAttribute("data-match-id");

    let endpoint = "";

    const playerNumber = button.getAttribute("data-player-number");

    switch (playerNumber)
    {
        case "2":
            endpoint = "/match/";
            break;
        case "4":
            endpoint = "/special-match/";
            break;
    }

    endpoint += matchId;

    const responseJson = await getData(endpoint);

    if (typeof responseJson === "number")
    {
        displayToast("Can't get " + playerNumber + " match details", "error");
        return ;
    }

    const detailsComponent = body.querySelector('[id="details-component"]') as HTMLDivElement;

    if (detailsComponent === null)
    {
        return ;
    }

    displayData(detailsComponent, "id", responseJson.match_id);
    displayData(detailsComponent, "date", responseJson.date);
    displayData(detailsComponent, "duration", responseJson.duration);
    displayData(detailsComponent, "bounces", responseJson.bounces);
    displayData(detailsComponent, "max-speed", responseJson.max_speed);
    displayData(detailsComponent, "status", responseJson.status);

    const data: Data = {
        labels: [],
        datasets: [{
            label: 'Scores',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
        }]
    };

    if (playerNumber === "2")
    {
        for (let i = 1; i < 3; i++)
        {
            displayData(detailsComponent, "player" + i + "-username", responseJson["player_" + i + "_username"]);
            data.labels.push(responseJson["player_" + i + "_username"]);

            displayData(detailsComponent, "player" + i + "-score", responseJson["player_" + i + "_score"]);
            data.datasets[0].data.push(responseJson["player_" + i + "_score"]);
        }

        for (let i = 3; i < 5; i++)
        {
            const id = "player-" + i;

            const player = detailsComponent.querySelector(`[id='${id}']`);

            if (player === null)
            {
                return ;
            }

            player.remove();
        }
    }
    else
    {
        let placeholder = document.createElement("p") as HTMLParagraphElement;

        for (let i = 1; i < 5; i++)
        {
            placeholder = document.getElementById("player" + i + "-username") as HTMLParagraphElement;
            placeholder.innerText = responseJson['player_' + i].username;
            data.labels.push(responseJson['player_' + i].username);

            placeholder = document.getElementById("player" + i + "-score") as HTMLParagraphElement;
            placeholder.innerText = responseJson['player_' + i].score;
            data.datasets[0].data.push(responseJson['player_' + i].score);
        }
    }

    displayBarChart(data);
}

export async function savePassword(button: HTMLButtonElement)
{
    const password = {
        password: getInputValue("password")
    };

    const responseJson = await fetchData("/password", password, "PUT");

    if (typeof responseJson === "number")
    {
        displayToast("Can't save password", "error");
        return ;
    }

    updateInput();
    updateButton(button);

    displayToast("Your password has been successfully updated.", "success");
}

function updateButton(button: HTMLButtonElement)
{
    const action = button.getAttribute("data-action");

    switch (action)
    {
        case "update-password":
            button.innerText = "Save";
            button.type = "submit";
            button.id = "submit-button";
            button.setAttribute("data-action", "save-password");
            button.setAttribute("form", "form-password");
            break;
        case "save-password":
            button.innerText = "Update";
            button.type = "button";
            button.id = "update-button";
            button.setAttribute("data-action", "update-password");
            button.removeAttribute("form");
            break;
    }
}

function updateInput()
{
    const input = document.getElementById("password") as HTMLInputElement;

    switch (input.disabled)
    {
        case (true):
            input.disabled = false;
            break;
        case (false):
            input.disabled = true;
            break;
    }
}

export function updatePassword(button: HTMLButtonElement)
{
    updateButton(button);
    updateInput();
}

function displayValue(id: string, value: string)
{
    const input = document.getElementById(id) as HTMLInputElement;

    if (input === null)
    {
        return ;
    }

    input.value = value;
}

function update2faButton(is2faEnabled: number)
{
    const button = document.querySelector('[data-action="handle-2fa"]') as HTMLButtonElement;

    if (button === null)
    {
        return ;
    }

    switch (is2faEnabled)
    {
        case 1:
            button.innerText = "Disable 2FA";
            break;
        case 0:
            button.innerText = "Enable 2FA";
            break;
    }
}

async function displayDetails()
{
    const endpoint = window.location.pathname;

    const response = await getData(endpoint);

    displayValue("username", response.username);
    displayValue("mail", response.mail);
    displayAvatar("default-avatar-profile", 12, response.avatar_path, response.username);

    if (window.location.pathname === "/profile")
    {
        update2faButton(response.fa2_enabled);
    }
}

function displayData(section: HTMLDivElement, id: string, data: string)
{
    const placeholder = section.querySelector(`[id='${id}']`) as HTMLElement;

    placeholder.innerText = data;
}

function displayWinrate(section: HTMLDivElement, data: string)
{
    if (data === null)
    {
        displayData(section, "winrate", "-");
        return ;
    }

    const winrate = Number(data);
    const TruncWinrate = Math.trunc(winrate);

    displayData(section, "winrate", TruncWinrate + " %");
}

function getDetailsButton()
{
    return `
        <button data-action="see-match-details" type="button" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">See match details</button>
    `;
}

function displayMatchList(section: HTMLDivElement, list: Array<object>, playerNumber: number)
{
    const tbody = section.querySelector("tbody") as HTMLElement;

    if (tbody ===  null)
    {
        return ;
    }

    if (list.length === 0)
    {
        return ;
    }

    let classes = "";

    classes = "border-b dark:border-gray-700 border-gray-200";
    const tr = createComponent("TR", classes, null) as HTMLTableRowElement;

    classes = "px-6 py-4";
    const td = createComponent("TD", classes, null) as HTMLTableCellElement;

    for (let i = 0; i < list.length; i++)
    {
        const trClone = tr.cloneNode(true) as HTMLTableRowElement;

        let id = "";
        let style = "";

        for (const [key, value] of Object.entries(list[i]))
        {
            const tdClone = td.cloneNode(true) as HTMLTableCellElement;

            if (typeof value === "object")
            {
                for (const [key2, value2] of Object.entries(value)) {
                    tdClone.innerText = `${value2}`;
                }
            }
            else
            {
                tdClone.innerText = `${value}`;
            }

            trClone.appendChild(tdClone);

            if (`${key}` === "id")
            {
                id = `${value}`;
            }

            if (`${key}` === "status")
            {
                switch (`${value}`)
                {
                    case "win":
                        style = "bg-switch3-100/10";
                        break;

                    case "loss":
                    case "draw":
                        style = "bg-switch2-100/10";
                        break;
                }
            }
        }

        const tdClone = td.cloneNode(true) as HTMLTableCellElement;

        tdClone.innerHTML = sanitizeHTML(getDetailsButton());
        tdClone.firstElementChild?.setAttribute("data-match-id", id);
        tdClone.firstElementChild?.setAttribute("data-player-number", String(playerNumber));

        trClone.classList.add(style);
        trClone.appendChild(tdClone);

        tbody.appendChild(trClone);
    }
}

async function displayMatchHistory(playerNumber: number)
{
    let endpoint = "";

    switch (playerNumber)
    {
        case 2:
            endpoint = "/match-history";
            break;
        case 4:
            endpoint = "/special-match-history";
            break;
    }

    const responseJson = await getData(endpoint);

    if (typeof responseJson === "number")
    {
        displayToast("Can't get " + playerNumber + " players match history", "error");
        return ;
    }

    const matchHistory = document.getElementById("match-history-" + playerNumber) as HTMLDivElement;

    if (matchHistory === null)
    {
        return ;
    }

    displayData(matchHistory, "victories", responseJson.nb_win);
    displayData(matchHistory, "defeats", responseJson.nb_loss);
    displayWinrate(matchHistory, responseJson.winrate);
    displayMatchList(matchHistory, responseJson.games, playerNumber);
}

async function postMatch2()
{
    const dataToPost = {
        id_winner: 1,
		id_player_1: 1,
		id_player_2: 2,
		score_player_1: 56,
		score_player_2: 87,
		duration: 54,
		bounces: 34,
		max_speed: 999
    };

    const responseJson = await fetchData("/create-match", dataToPost, "POST");

    if (typeof responseJson === "number")
    {
        displayToast("Can't create 2 player match", "error");
        return ;
    }
}

async function postMatch4()
{
    const dataToPost = {
        id_winner: 1,
		id_player_1: 1,
		id_player_2: 2,
        id_player_3: 3,
		id_player_4: 4,
		score_player_1: 56,
		score_player_2: 87,
        score_player_3: 76,
		score_player_4: 98,
		duration: 54,
		bounces: 34,
		max_speed: 999
    };

    const responseJson = await fetchData("/create-special-match", dataToPost, "POST");

    if (typeof responseJson === "number")
    {
        displayToast("Can't create 4 player match", "error");
        return ;
    }
}

export async function init()
{
	if (sharedData.socket != null)
	{
		if (sharedData.isPlaying == true)
			handleRooting("/match", null , true);
		else
		{
			displayDetails();

			if (window.location.pathname === "/profile")
			{
				const script = document.createElement("script");

				script.src = "https://cdn.jsdelivr.net/npm/chart.js";

				script.addEventListener('load', function()
				{
					//postMatch2();
					//postMatch4();

					displayMatchHistory(2);
					displayMatchHistory(4);
				});

				document.body.appendChild(script);
			}
		}
		
	}

}