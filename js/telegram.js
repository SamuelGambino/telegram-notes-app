import { showPopup } from "./ui.js";
import { saveEditorContent } from "./quill.js";
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
    saveEditorContent();
    hapticImpact();
    showPopup("Сохранено!");
}

export {
    tg,
    hapticImpact,
    saveMainBtn,
    initTelegram
}