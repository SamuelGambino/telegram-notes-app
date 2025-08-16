let saveTimer = null;
hljs.highlightAll();

const initQuill = (page) => {
    if (page === 'note') {
        const q = new Quill("#editorSnow", {
            theme: "snow",
            placeholder: "Введите текст...",
            modules: { toolbar: "#toolbar", syntax: true },
        });

        q.on('text-change', () => {
            textChangeDebounced();
            document.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
        });
        return q;
    } else if (page === 'task') {
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
        return taskQuill;
    }
}

export const addQuill = (count) => {
    const taskQuill = [];
    
    document.querySelectorAll('.task__quill').forEach((item, index) => {
        if(index >= count) {
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
        }
    });
    return taskQuill;
}

const textChangeDebounced = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        saveEditorContent();
    }, 500);
}

export {
    initQuill
}