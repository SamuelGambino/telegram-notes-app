export const createHtmlElement = (obj) => {
    const element = document.createElement(obj.tag);
    const keys = Object.keys(obj).filter(key => key !== 'tag') || [];
    if(keys.length > 0) {
        for(let i = 0; i < keys.length; i++) {
            const attribute = keys[i];
            if(attribute === 'classList'){
                element.classList.add(obj[attribute]);
            } else {
                element[attribute] = obj[attribute];
            };
        }
    }
    return element;
}