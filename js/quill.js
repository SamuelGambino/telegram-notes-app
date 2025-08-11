import { state, upsertNote, getNote } from "./state.js";
import { getTitleFromText, getId } from "./utils.js";
let saveTimer = null;
hljs.highlightAll();

const initQuill = () => {
    const q = new Quill("#editorSnow", {
        theme: "snow",
        placeholder: "Введите текст...",
        modules: { toolbar: "#toolbar", syntax: true },
    });
    state.quill = q;

    q.on('text-change', () => {
        textChangeDebounced();
        document.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });
    });
    const taskQuill = [];

    document.querySelectorAll('.task__quill').forEach((item) => {
        const taskTitleQuill = new Quill(item, {
            theme: 'bubble',
            modules: {
                toolbar: true
            },
            placeholder: 'Введите текст...'
        });
        taskTitleQuill.on('text-change', () => {
            textChangeDebounced();
        });
        taskQuill.push(taskTitleQuill);
    });
    state.taskQuill = taskQuill;
}


const textChangeDebounced = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        saveEditorContent();
    }, 500);
}

const saveEditorContent = () => {
    if(!state.quill || !state.taskQuill) return;
    let delta, title;

    if (state.currentType === 'task') {
        delta = state.taskQuill.map(quillContent => quillContent.getContents());
        title = state.taskQuill?.length ? state.taskQuill[0].getText() : '';
    } else if (state.currentType === 'note') {
        delta = state.quill.getContents(); //delta - простой формат для описания текста и его форматирования, является строгим подмножеством JSON
        const text = state.quill.getText();
        title = getTitleFromText(text);
    }

    if(!state.currentId) { // Условие для первого создания
        const id = getId();
        state.currentId = id;
    }

    const note = {
        id: state.currentId,
        type: state.currentType,
        title,
        delta,
        updatedTime: Date.now(),
    };
    upsertNote(note);
}

const loadNoteInEditor = (id, type) => {
    const note = getNote(id);
    if (note) {
        state.currentId = id;
        state.currentType = note.type;
        if (state.currentType === 'task') {
            state.taskQuill.forEach((quillContent, index) => {
                const content = note.delta[index] || {ops: []};
                quillContent.setContents(content);
            });
        } else if (state.currentType === 'note') {
            state.quill.setContents(note.delta || {ops: []});
        }
    } else {
        state.currentId = null;
        state.currentType = null;
        state.quill.setContents({ops: []});
        state.taskQuill.forEach((item) => item.setContents({ops: []}));
    }
}

const createNote = (type) => {
    if (type === 'task') {
        state.currentId = null;
        state.currentType = 'task';
        if (state.taskQuill) {
            state.taskQuill.forEach((item) => item.setContents({ops: []}));
            state.taskQuill[0].focus();
        }
    } else {
        state.currentId = null;
        state.currentType = 'note';
        if (state.quill) {
            state.quill.setContents({ops: []});
            state.quill.focus();
        }
    }
}

export {
    initQuill,
    loadNoteInEditor,
    createNote,
    saveEditorContent
}