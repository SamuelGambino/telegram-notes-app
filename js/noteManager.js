import { state, upsertData, getData } from "./state.js";
import { getTitleFromText, getId } from "./utils.js";

const saveNoteEditorContent = () => {
    if(!state.quill) return;
    const delta = state.quill.getContents();
    const text = state.quill.getText();
    const title = getTitleFromText(text);

    if(!state.currentId) { // Условие для первого создания
        const id = getId();
        state.currentId = id;
    }

    const note = {
        id: state.currentId,
        title,
        delta,
        updatedTime: Date.now(),
    };
    upsertData(note);
}

const loadNoteInEditor = (id) => {
    const note = getData(id);
    if (note) {
        state.currentId = id;
        state.quill.setContents(note.delta || {ops: []});
    } else {
        state.currentId = null;
        state.quill.setContents({ops: []});
    }
}

const createNote = () => {
    state.currentId = null;
    if (state.quill) {
        state.quill.setContents({ops: []});
        state.quill.focus();
    }
}

export {
    loadNoteInEditor,
    createNote,
    saveNoteEditorContent
}