import { getToken } from "../auth.js";
import { removeDisabledButton } from "./buttons.js";
import { createComponent } from "./components.js";
import { getData } from "./data.js";
import { setDisabled, sleep } from "./dialogs.js";
import { displayToast } from "./toasts.js";
import { getTokenValue } from "./username.js";

function displayFirstLetter(id: string, username: string)
{
    const placeholder = document.getElementById(id) as HTMLSpanElement;

    if (placeholder === null)
    {
        return ;
    }

    placeholder.innerText = username[0];
}

export async function updateAvatar(id: string, size: number, path: string)
{
    let finalPath = path;

    // do not trunc if blob image for preview
    if (path[0] != 'b')
    {
        finalPath = "https://{TRANSCENDENCE_IP}:8080/api/" + path.substring(4);
    }

    const current = document.getElementById(id);

    if (current === null)
    {
        return ;
    }

    if (current.localName === "img")
    {
        (current as HTMLImageElement).src = finalPath;
        return ;
    }

    const classes = "rounded-full size-" + size;

    const img = createComponent("img", classes, null) as HTMLImageElement;

    img.src = finalPath;
    img.id = id;

    current.replaceWith(img);
}

export function displayAvatar(id: string, size: number, path: string | null, username: string)
{
    switch (path)
    {
        case (null):
            displayFirstLetter(id, username)
            break;

        default:
            updateAvatar(id, size, path)
            break;
    }
}

async function putAvatar(input: HTMLInputElement)
{
    const files = input.files;

    if (files === null)
    {
        return ;
    }

    const formData = new FormData();

    formData.append('key', 'avatar');
    formData.append('type', 'File');
    formData.append('value', files[0]);

    const token = getToken();

    try
    {
        const response = await fetch("https://{TRANSCENDENCE_IP}:8080/api/avatar", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,

            },
            body: formData
        });

        if (response.status != 200 && response.status != 201)
        {
            return (response.status);
        }

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json'))
        {
            const responseJson = await response.json();
            return (responseJson);
        }

        return (response);
    }
    catch (error)
    {
        displayToast(error as string, "error");
        return (500);
    }
}

export async function saveAvatar(button: HTMLButtonElement)
{
    const input = document.getElementById("upload-avatar") as HTMLInputElement;

    if (input === null)
    {
        return ;
    }

    const responseJson = await putAvatar(input);

    if (typeof responseJson === "number")
    {
        displayToast("Can't save avatar", "error");
        return ;
    }

    input.value = "";


    setDisabled(button);

    displayNavbarAvatars();

    displayToast("Your avatar has been successfully updated.", "success");
}

export async function getAvatarPath(id: number)
{
    let userid = 0;

    if (id === -1)
    {
        userid = getTokenValue("userid");
    }
    else
    {
        userid = id;
    }

    const responseJson = await getData("/avatar/" + userid);

    if (typeof responseJson === "number")
    {
        displayToast("Can't get avatar path", "error");
        return ;
    }

    return (responseJson.avatar_path);
}

export async function displayNavbarAvatars()
{
    const avatar = await getAvatarPath(-1);

    const username = getTokenValue("username");

    displayAvatar("default-avatar-navbar-desktop", 8, avatar, username);
    displayAvatar("default-avatar-navbar-mobile", 10, avatar, username);
}

function isExtAuthorized(type: string, name: string)
{
    if (type != "image/png" && type != "image/jpg" && type != "image/jpeg")
    {
        return (false);
    }

    const len = name.length;
    const ext = name.substring(len - 4);

    if (ext != ".png" && ext != ".jpg")
    {
        return (false);
    }

    return (true);
}

async function resetAvatarInput(input: HTMLInputElement)
{
    input.value = "";

    const button = document.querySelector('[data-action="save-avatar"]') as HTMLButtonElement;

    if (button === null)
    {
        return ;
    }

    setDisabled(button);

    displayAvatar("default-avatar-profile", 12, await getAvatarPath(-1), getTokenValue("username"));
}

export async function previewAvatar()
{
    const input = document.getElementById("upload-avatar") as HTMLInputElement;

    if (input === null)
    {
        return ;
    }

    const files = input.files;

    if (files === null)
    {
        return ;
    }

    const file = files[0];

    if (isExtAuthorized(file.type, file.name) === false)
    {
        resetAvatarInput(input);
        displayToast("Your image must be a png or jpg", "error");
        return ;
    }

    if (file.size > 1000000)
    {
        resetAvatarInput(input);
        displayToast("Your image size must not exceed 1 megabyte", "error");
        return ;
    }

    removeDisabledButton("submit-button");
    updateAvatar("default-avatar-profile", 12, URL.createObjectURL(file));
}