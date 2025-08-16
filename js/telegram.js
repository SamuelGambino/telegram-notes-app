import { showPopup } from "./ui.js";
import { saveNoteEditorContent } from "./noteManager.js";
import { saveTaskEditorContent } from "./taskManager.js";
import { state } from "./state.js";
const tg = window.Telegram?.WebApp;

const initTelegram = () => {
    if (!tg) return;

    tg.expand();
    document.documentElement.style.setProperty(
        "--tg-theme-bg-color",
        tg.themeParams.bg_color || getComputedStyle(document.body).backgroundColor
    );

    tg.MainButton.setParams({ text: "Сохранить" });
    tg.MainButton.onClick(() => {
        saveMainBtn();
    });
    tg.MainButton.show();
}

const hapticImpact = () => {
    try {
        tg?.HapticFeedback?.impactOccurred("medium");
    } catch {};
};

const saveMainBtn = () => {
    if (state.type === 'task') saveTaskEditorContent();
    if (state.type === 'note') saveNoteEditorContent();
    hapticImpact();
    showPopup("Сохранено!");
}

export {
    tg,
    hapticImpact,
    saveMainBtn,
    initTelegram
}