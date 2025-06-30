export function handleMobileMenu()
{
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenu === null)
    {
        return ;
    }

    switch (mobileMenu.classList.contains("hidden"))
    {
        case (true):
            mobileMenu.classList.remove("hidden");
            break;
        case (false):
            mobileMenu.classList.add("hidden");
            break;
    }
}

function removeCurrentState(nav: HTMLElement)
{
    const currentAnchors = nav.querySelectorAll('[aria-current="page"]');

    if (currentAnchors === null)
    {
        return ;
    }

    for (let i = 0; i < currentAnchors.length; i++)
    {
        currentAnchors[i].setAttribute("aria-current", "");

        switch (currentAnchors[i].getAttribute("data-menu-type"))
        {
            case ("popup"):
                currentAnchors[i].classList.replace("font-bold", "hover:bg-gray-100");
                break;
            default:
                currentAnchors[i].classList.remove("bg-gray-900", "text-white");
                currentAnchors[i].classList.add("text-gray-300", "hover:bg-gray-700", "hover:text-white");
                break;
        }
    }
}

function setNewState(nav: HTMLElement, href: string)
{
    const newAnchors = nav.querySelectorAll(`[href='${href}']`);

    if (newAnchors === null)
    {
        return ;
    }

    for (let i = 0; i < newAnchors.length; i++)
    {
        newAnchors[i].setAttribute("aria-current", "page");

        switch (newAnchors[i].getAttribute("data-menu-type"))
        {
            case ("popup"):
                newAnchors[i].classList.replace("hover:bg-gray-100", "font-bold");
                break;
            default:
                newAnchors[i].classList.remove("text-gray-300", "hover:bg-gray-700", "hover:text-white");
                newAnchors[i].classList.add("bg-gray-900", "text-white");
                break;
        }
    }
}

export function updateNavbarState(href: string)
{
    const nav = document.querySelector("nav");

    if (nav === null)
    {
        return ;
    }

    removeCurrentState(nav);

    switch (href)
    {
        case "/dashboard":
        case "/profile":
            setNewState(nav, href);
            break;
        default:
            break;
    }
}