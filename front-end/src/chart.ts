import { createComponent } from "./common/components.js";
import { displayDialog } from "./common/dialogs.js";

declare const Chart: any;

export type Data = {
    labels: Array<string>,
    datasets: [{
        label: string,
        data: Array<Number>,
        backgroundColor: Array<string>,
        borderColor: Array<string>,
        borderWidth: 1
    }]
};

export async function displayBarChart(data: Data)
{
    const colors = [
        "#fd9a00", // amber 500
        "#00bc7d", // emerald 500
        "#00a6f4", // sky 500
        "#f6339a" // pink 500
    ];

    for (let i = 0; i < 4; i++)
    {
        data.datasets[0].backgroundColor.push(colors[i]);
        data.datasets[0].borderColor.push(colors[i]);
    }

    const chart = Chart.getChart("bar-chart");
    
    if (chart)
    {
        chart.destroy();
    }

    const ctx = document.getElementById("bar-chart") as HTMLCanvasElement;

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
            y: {
                beginAtZero: true
            }
            }
        },
    });
}

async function getNumbers(playerNumber: string)
{
    const section = document.getElementById("match-history-" + playerNumber);

    if (section === null)
    {
        return ;
    }

    const numbers = [];

    const victoriesPlaceholder = section.querySelector('[id="victories"]') as HTMLSpanElement;

    if (victoriesPlaceholder === null)
    {
        return ;
    }

    numbers[0] = Number(victoriesPlaceholder.innerText);

    const defeatsPlaceholder = section.querySelector('[id="defeats"]') as HTMLSpanElement;

    if (defeatsPlaceholder === null)
    {
        return ;
    }

    numbers[1] = Number(defeatsPlaceholder.innerText);

    return (numbers);
}

function displayDefaultMessage(playerNumber: string)
{
    const canvas = document.getElementById("match-history-" + playerNumber);

    if (canvas === null)
    {
        return ;
    }

    const classes = "p-5 text-center";
    
    const p = createComponent("p", classes, null) as HTMLParagraphElement;

    p.innerText = "You must have at least 1 win or 1 loss to display this chart."
    
    canvas.replaceWith(p);
}

export async function displayPieChart(button: HTMLButtonElement)
{
    const playerNumber = button.getAttribute("data-player-number") as string;

    const numbers = await getNumbers(playerNumber) as Array<Number>;

    await displayDialog("see-pie-chart-" + playerNumber);

    if (numbers[0] === 0 && numbers[1] === 0)
    {
        displayDefaultMessage(playerNumber);
        return ;
    }

    const chart = Chart.getChart("match-history-" + playerNumber);
    
    if (chart)
    {
        chart.destroy();
    }

    const ctx = document.getElementById('match-history-' + playerNumber) as HTMLCanvasElement;

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
                'Victories',
                'Defeats',
            ],
            datasets: [{
                label: 'Number of matches',
                data: [numbers[0], numbers[1]],
                backgroundColor: [
                'rgb(0, 201, 81)', // green 500
                'rgb(251, 44, 54)', // red 500
                ],
                hoverOffset: 4
            }]
        },
    });
}