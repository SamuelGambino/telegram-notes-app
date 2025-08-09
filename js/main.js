import { el, toggleMenu, closeMenu, navigate, renderMenuList } from "./ui.js"
import { createNote, initQuill, loadNoteInEditor } from "./quill.js";
import { saveMainBtn, initTelegram } from "./telegram.js";
import { loadState, state } from "./state.js";

const bindEvents = () => {
  el.menuBtn.addEventListener('click', toggleMenu);
  el.menuBack.addEventListener('click', closeMenu);
  el.newNote.addEventListener('click', () => {
    createNote();
    closeMenu();
  });
  el.aboutBtn.addEventListener('click', () => {
    navigate('about');
    closeMenu();
  })
  el.saveBtn.addEventListener('click', () => saveMainBtn())
}

const start = () => {
  loadState();
  initQuill();
  bindEvents();
  initTelegram();

  if (state.currentId) {
    loadNoteInEditor(state.currentId);
  } else {
    createNote();
  }

  renderMenuList();
}

start();