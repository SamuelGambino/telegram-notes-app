import { renderMenuList, showPopup } from "./ui.js";
import { createNote } from "./noteManager.js";
import { createTask } from "./taskManager.js";


const STORAGE_KEY = 'easy-notes';

const state = {
    notes: [],
    currentId: null,
    quill: null,
    taskQuill: null,
    currentType: null,
};

const loadState = () => {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY))
        if (!data) return
        if (Array.isArray(data.notes)) {
            state.notes = data.notes;
            state.currentId = data.currentId || null;
            state.currentType = data.currentType || null;
        };
    } catch (e) {
        console.warn('Ошибка при загрузке данных', e)
    }
}

const saveState = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({notes: state.notes, currentType: state.currentType, currentId: state.currentId}));
    } catch (e) {
        console.warn('Ошибка при сохранении данных', e);
    }
}

const getData = (id) => {
    return state.notes.find((note) => note.id === id) || null;
}

const upsertData = (note) => {
    const resultId = state.notes.findIndex((n) => n.id === note.id);
    if (resultId >= 0) {
        state.notes[resultId] = note;
    } else {
        state.notes.unshift(note);
    }

    saveState();
    renderMenuList();
}

const deleteData = (id, type) => {
    const resultId = state.notes.findIndex((n) => n.id === id);
    if (resultId >= 0) {
        state.notes.splice(resultId, 1);
        if (state.currentId === id) {
            state.currentId = null;
            if(type === 'note') createNote();
            if(type === 'task') createTask();
        }
        saveState();
        renderMenuList();
        showPopup('Запись удалена!')
    }
}

export {
    state,
    loadState,
    saveState,
    getData,
    upsertData,
    deleteData
}