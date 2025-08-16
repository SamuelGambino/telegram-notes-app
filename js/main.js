import { el, toggleMenu, closeMenu, renderMenuList } from "./ui.js"
import { initQuill } from "./quill.js";
import { createNote, loadNoteInEditor } from "./noteManager.js";
import { createTask, loadTaskInEditor } from "./taskManager.js";
import { saveMainBtn, initTelegram } from "./telegram.js";
import { loadState, state } from "./state.js";
import { navigate } from "./navigate.js";

const bindEvents = () => {
  el.menuBtn.addEventListener('click', toggleMenu);
  el.menuBack.addEventListener('click', closeMenu);
  el.newNote.addEventListener('click', () => {
    navigate('note');
    createNote();
    closeMenu();
  });
  el.newTask.addEventListener('click', () => {
    navigate('task');
    createTask();
    closeMenu();
  })
  el.aboutBtn.addEventListener('click', () => {
    navigate('about');
    closeMenu();
  })
  el.saveBtn.addEventListener('click', () => saveMainBtn())
}

const start = () => {
  loadState();
  state.quill = initQuill('note');
  state.taskQuill = initQuill('task');
  bindEvents();
  initTelegram();

  if (state.currentId) {
    if (state.type === 'note') loadNoteInEditor(state.currentId);
    if (state.type === 'task') loadTaskInEditor(state.currentId);
  } else {
    createNote();
  }

  renderMenuList();
}

start();