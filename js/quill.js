import { state, upsertNote, getNote } from "./state.js";
import { getTitleFromText, getId } from "./utils.js";
let saveTimer = null;
hljs.highlightAll();

const initQuill = () => {
    const q = new Quill("#editor", {
        theme: "snow",
        placeholder: "Новая заметка...",
        modules: { toolbar: "#toolbar", syntax: true },
    });
    state.quill = q;

    q.on('text-change', () => {
        textChangeDebounced();
        document.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });
    });
}

const textChangeDebounced = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        saveEditorContent();
    }, 500);
}

const saveEditorContent = () => {
    if(!state.quill) return;
    const delta = state.quill.getContents(); //delta - простой формат для описания текста и его форматирования, является строгим подмножеством JSON
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
    upsertNote(note);
}

const loadNoteInEditor = (id) => {
    const note = getNote(id);
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
    initQuill,
    loadNoteInEditor,
    createNote,
    saveEditorContent
}