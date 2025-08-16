import { createHtmlElement } from "./components.js";
import { addQuill } from "./quill.js";
import { state, upsertData, getData } from "./state.js";
import { getId } from "./utils.js";

const saveTaskEditorContent = () => {
    if(!state.taskQuill) return;
    let delta;

    delta = state.taskQuill.map(quillContent => quillContent.getContents());
    title = state.taskQuill?.length ? state.taskQuill[0].getText() : '';

    if(!state.currentId) { // Условие для первого создания
        const id = getId();
        state.currentId = id;
    }

    const task = {
        id: state.currentId,
        type: state.currentType,
        title,
        delta,
        updatedTime: Date.now(),
    };
    upsertData(task);
}

const loadTaskInEditor = (id) => {
    const task = getData(id);
    if (task) {
        state.currentId = id;
        state.currentType = task.type;
        taskList = document.querySelector('#taskList');
        task.delta.forEach((item, index) => {
            const content = item || {ops: []}
            if(index === 0) {
                state.taskQuill[0].setContents(content);
            } else {
                // Сначала создаю dom елементы, потом их инициализирую, потом записываю их значение
                const li = createHtmlElement({tag: 'li', classList: 'task__list-item'});
                const divContent = createHtmlElement({tag: 'div', classList: 'task__content'});
                const inputCheckbox = createHtmlElement({tag: 'input', classList: 'task__checkbox', type: 'checkbox'});
                const divQuillTitle = createHtmlElement({tag: 'div', className: 'task__title task__title--task task__quill'});
                const buttonDown = createHtmlElement({tag: 'button', className: 'task__btn task__btn--down-open'});
                const divQuillDesc = createHtmlElement({tag: 'div', className: 'task__description task__quill', hidden: false});
                buttonDown.innerHTML(`
                    <svg class="task__icon" width="24" height="24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
                    </svg>    
                `);
                buttonDown.addEventListener('click', () => {
                    if (divQuillDesc.hidden === false) {
                        buttonDown.className = 'task__btn task__btn--down';
                        divQuillDesc.hidden = true;
                    } else {
                        buttonDown.className = 'task__btn task__btn--down-open';
                        divQuillDesc.hidden = false;
                    };                    
                })
                divContent.appendChild(inputCheckbox);
                divContent.appendChild(divQuillTitle);
                divContent.appendChild(buttonDown);
                li.appendChild(divContent);
                li.appendChild(divQuillDesc);
                taskList.appendChild(li);
                state.taskQuill.push(...addNew(state.taskQuill.length))
                state.taskQuill[index].setContents(content);
            };
        });
    } else {
        state.currentId = null;
        state.currentType = null;
        state.quill.setContents({ops: []});
        state.taskQuill.forEach((item) => item.setContents({ops: []}));
    }
}

const createTask = () => {
    state.currentId = null;
    state.currentType = 'task';
    if (state.taskQuill) {
        state.taskQuill.forEach((item) => item.setContents({ops: []}));
        state.taskQuill[0].focus();
    }
}

export {
    loadTaskInEditor,
    createTask,
    saveTaskEditorContent
}