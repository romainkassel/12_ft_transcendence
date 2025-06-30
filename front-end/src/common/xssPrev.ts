export function jsEscape(data: string)
{
    return String(data).replace(/[^\w.@ ]/gi, function(c)
    {
        return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
    });
}

export function sanitizeHTML(dangerousHtml: string): string
{
    const tempDiv = document.createElement('div');
    tempDiv.innerText = dangerousHtml;
    
    const forbiddenTags = ['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta'];
    
    forbiddenTags.forEach(tag => {

        const elements = tempDiv.getElementsByTagName(tag);
        for (let i = elements.length - 1; i >= 0; i--)
        {
        elements[i].remove();
        }
    });

    function cleanAttributes(element: Element)
    {
        const attrs = Array.from(element.attributes);
        attrs.forEach(attr => {

            const name = attr.name.toLowerCase();
            const value = attr.value.toLowerCase();
        
            if (name.startsWith('on'))
            {
                element.removeAttribute(attr.name);
            }
            else if ((name === 'href' || name === 'src') && value.startsWith('javascript:'))
            {
                element.removeAttribute(attr.name);
            }
        });

    Array.from(element.children).forEach(cleanAttributes);
  }

  cleanAttributes(tempDiv);

  return (tempDiv.innerText);
}