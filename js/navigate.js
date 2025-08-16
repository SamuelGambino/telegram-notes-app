import { tg } from "./telegram.js";

export const navigate = (page) => {
    switch (page) {
        case task:
            document.querySelector('#pageNote').hidden = true;
            document.querySelector('#pageTask').hidden = false;
            document.querySelector('#pageAbout').hidden = true;
            document.querySelector('#saveBtn').disabled = true;
            tg.MainButton.show();
            break;
        case about:
            document.querySelector('#pageNote').hidden = true;
            document.querySelector('#pageTask').hidden = true;
            document.querySelector('#pageAbout').hidden = false;
            document.querySelector('#saveBtn').disabled = true;
            tg.MainButton.hide();
            break;
        default:
            document.querySelector('#pageNote').hidden = false;
            document.querySelector('#pageTask').hidden = true;
            document.querySelector('#pageAbout').hidden = true;
            document.querySelector('#saveBtn').disabled = true;
            tg.MainButton.show();
    }
}