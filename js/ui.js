import { state, deleteNote } from "./state.js";
import { createHtmlElement } from "./components.js";
import { hapticImpact, tg } from "./telegram.js";
import { formatDateTime } from "./utils.js";
import { loadNoteInEditor } from "./quill.js";
let popupTimer = null;

const el = {
    menuBtn: document.querySelector('#menuBtn'),
    saveBtn: document.querySelector('#saveBtn'),
    menu: document.querySelector('#menu'),
    newNote: document.querySelector('#newNote'),
    notesList: document.querySelector('#notesList'),
    aboutBtn: document.querySelector('#aboutBtn'),
    pageNote: document.querySelector('#pageNote'),
    pageAbout: document.querySelector('#pageAbout'),
    popup: document.querySelector('#popup'),
    menuBack: document.querySelector('#menuBack')
}

const openMenu = () => {
    el.menu.classList.add('menu--open');
    el.menu.setAttribute('aria-hidden', 'false');
    el.menuBack.hidden = false;
}

const closeMenu = () => {
    el.menu.classList.remove('menu--open');
    el.menu.setAttribute('aria-hidden', 'true');
    el.menuBack.hidden = true;
}

const toggleMenu = () => {
    if (el.menu.classList.contains('menu--open')) {
        closeMenu();
    } else {
        openMenu();
    }
}

const renderMenuList = () => {
    el.notesList.innerHTML = '';
    if (!state.notes.length) return;
    
    for (const note of state.notes) {
        const li = createHtmlElement({tag: 'li', classList: 'menu__list-item'});
        const title = createHtmlElement({tag: 'h3', textContent: note.title || 'Без названия', classList: 'menu__note-title'});
        const date = createHtmlElement({tag: 'p', textContent: `изм. ${formatDateTime(note.updatedTime)}`, classList: 'menu__note-description'});
        const del = createHtmlElement({tag: 'button', type: 'button', className: 'menu__note-btn menu__note-btn--delete', textContent: 'Удалить'});

        li.appendChild(title);
        li.appendChild(date);
        li.appendChild(del);
        

        li.addEventListener('click', () => {
            navigate('editor');
            loadNoteInEditor(note.id);
            closeMenu();
        });

        holdNoteToRemove(li, () => { // удержание заметки, для удаления
            li.classList.add('menu__list-item--show-btn');
            hapticImpact(); // тактильная отдача
        })

        del.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Удалить эту заметку?')) {
                deleteNote(note.id);
            }
        });

        el.notesList.appendChild(li);
    }
}

const holdNoteToRemove = (target, onLongPress, durationMs = 500) => { // Функция длительного нажатия
    let timer = null;
    const start = () => {
        timer = setTimeout(() => onLongPress(), durationMs);
    };
    const clear = () => {
        if (timer) clearTimeout(timer);
        timer = null;
    };
    target.addEventListener("touchstart", start, { passive: true });
    target.addEventListener("mousedown", start);
    ["touchend", "touchcancel", "mouseup", "mouseleave"].forEach((ev) =>
        target.addEventListener(ev, clear)
    );
}

const navigate = (page) => {
    if (page === 'about') {
        el.pageAbout.hidden = false;
        el.pageNote.hidden = true;
        el.saveBtn.disabled = true;
        tg.MainButton.hide();
    } else {
        el.pageAbout.hidden = true;
        el.pageNote.hidden = false;
        el.saveBtn.disabled = false;
        tg.MainButton.show();
    }
}

const showPopup = (text) => {
    el.popup.textContent = text;
    el.popup.classList.add('popup--show');
    clearTimeout(popupTimer);
    popupTimer = setTimeout(() => {
        el.popup.classList.remove('popup--show');
    }, 1500);
}

export {
    el,
    showPopup,
    toggleMenu,
    closeMenu,
    renderMenuList,
    navigate
}