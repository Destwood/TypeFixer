const cursorDiv = document.createElement("div");
cursorDiv.className = "Existek";
const dictionary = {
  cat: ["dog", "rat", "bat"],
  helo: ["hello", "help", "hell"],
  heldp: ["help", "held", "hello"],
};

let isMenuActive = false;
let currentWord = "";
let currentWordBeforeCursor = false;
let activeElementInfo = {
  element: null,
  isInputOrTextarea: false,
  isContenteditable: false,
};

function getCurrentWord() {
  // return text if selected
  if (window.getSelection().toString()) return window.getSelection().toString()
  const activeElement = activeElementInfo.element;
  if (!activeElement) return "";

  let text, textBeforeCursor, textAfterCursor, cursorPosition, rect;
  if (activeElementInfo.isInputOrTextarea) {
    cursorPosition = activeElement.selectionStart;
    text = activeElement.value || activeElement.textContent;
    rect = activeElement.getBoundingClientRect();
    if(currentWordBeforeCursor) {
      const words = text.substring(0, cursorPosition).trim().split(/\s+/);
      getCoordinates(rect, cursorPosition);
      return words[words.length - 1];
    }
    textBeforeCursor = text.substring(0, cursorPosition);
    textAfterCursor = text.substring(cursorPosition);
  } else if (activeElementInfo.isContenteditable) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    rect = range.getBoundingClientRect();
    if(currentWordBeforeCursor) {
      getCoordinates(rect, cursorPosition);
      const wordsBeforeCursor = range.startContainer.textContent
        .substring(0, range.startOffset)
        .trim()
        .split(/\s+/);
      return wordsBeforeCursor[wordsBeforeCursor.length - 1];
    }
    text = range.startOffset;
    textBeforeCursor = range.startContainer.textContent.substring(0, text );
    textAfterCursor = range.startContainer.textContent.substring(text);
  }
  getCoordinates(rect, cursorPosition);
  const spaceBeforeCursor = /\s$/.test(textBeforeCursor);
  const spaceAfterCursor = /^\s/.test(textAfterCursor);
  const wordsBeforeCursor = textBeforeCursor.trim().split(/\s+/);
  const wordsAfterCursor = textAfterCursor.trim().split(/\s+/);

  if (spaceBeforeCursor) {
    return spaceAfterCursor ? "" : wordsAfterCursor[0];
  } else if (spaceAfterCursor) {
    return wordsBeforeCursor[wordsBeforeCursor.length - 1];
  } else {
    return (
      wordsBeforeCursor[wordsBeforeCursor.length - 1] + wordsAfterCursor[0]
    );
  }
}
function getCoordinates(rect, cursorPosition) {
  let x, y;
  
  if (activeElementInfo.isContenteditable) {
    x = rect.x;
    y = rect.y;
  } else {
    const activeElement = activeElementInfo.element;
    const div = document.createElement("div");
    const inputStyle = window.getComputedStyle(activeElement);

    div.textContent = activeElement.value.substring(0, cursorPosition);
    div.style.whiteSpace = "pre-wrap";
    div.style.visibility = "hidden";
    div.style.position = "absolute";
    div.style.top = "0";
    div.style.left = "0";
    div.style.width = "auto";
    div.style.height = "auto";
    div.style.fontSize = inputStyle.fontSize;
    div.style.fontFamily = inputStyle.fontFamily;
    document.body.appendChild(div);
    const divRect = div.getBoundingClientRect();
    document.body.removeChild(div);

    x = rect.left + divRect.width;
    y = rect.top + divRect.height;
  }
  y = y > 50 ? y - 45 : 30;
  x = x > 75 ? x - 70 : 5;
  cursorDiv.style.top = y + "px";
  cursorDiv.style.left = x + "px";
}

function replaceWord(item) {
  let textBeforeCursor, textAfterCursor, range, selection, cursorPosition;
  const activeElement = activeElementInfo.element;
  const isContenteditable = activeElementInfo.isContenteditable;

  if (isContenteditable) {
    selection = window.getSelection();
    range = selection.getRangeAt(0);
    cursorPosition = range.startOffset;
    textBeforeCursor = range.startContainer.textContent.substring(0, cursorPosition);
    textAfterCursor = range.startContainer.textContent.substring(cursorPosition);
  } else {
    cursorPosition = activeElement.selectionStart;
    const inputString = activeElement.value;
    textBeforeCursor = inputString.substring(0, cursorPosition);
    textAfterCursor = inputString.substring(cursorPosition);
  }

  const spaceBeforeCursor = textBeforeCursor.endsWith(" ");
  const spaceAfterCursor = textAfterCursor.startsWith(" ");
  const wordBeforeCursorDeleted = textBeforeCursor.replace(/\S+\s*$/, "");
  const wordAfterCursorDeleted = textAfterCursor.replace(/^\s*\S+\s*/, "");
  let newText = "";
  let newCursorPosition = 0;
  
  newText = spaceBeforeCursor
  ? currentWordBeforeCursor
    ? wordBeforeCursorDeleted + `${item} ` + textAfterCursor
    : textBeforeCursor + `${item} ` + wordAfterCursorDeleted
  : spaceAfterCursor
  ? wordBeforeCursorDeleted + `${item}` + textAfterCursor
  : wordBeforeCursorDeleted + `${item} ` + wordAfterCursorDeleted;

  newCursorPosition = newText.indexOf(item) + item.length;

  if (isContenteditable) {
    range.startContainer.textContent = newText;
    range.setStart(range.startContainer, newCursorPosition);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    activeElement.value = newText;
    activeElement.focus();
    activeElement.setSelectionRange(newCursorPosition, newCursorPosition);
  }
  closeMenu();
}
function updateActiveElementInfo() {
  const activeElement = document.activeElement;
  activeElementInfo.element = activeElement;
  activeElementInfo.isInputOrTextarea =
    activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA";
  activeElementInfo.isContenteditable =
    activeElement.getAttribute("contenteditable") === "true";
}

const openMenu = () => {
  isMenuActive = true;

  const wordsList = dictionary[currentWord.toLocaleLowerCase()];
  cursorDiv.innerHTML = "";

  wordsList.forEach((item) => {
    const option = document.createElement("button");
    option.className = "optionButton";
    option.innerText = item;
    option.addEventListener("click", () => {
      if (dictionary.hasOwnProperty(currentWord.toLocaleLowerCase())) {
        replaceWord(item);
      }
    });
    cursorDiv.appendChild(option);
  });

  // Background color feature
  let settings = cursorDiv.querySelector(".settings");
  if (!settings) {
    settings = document.createElement("input");
    settings.className = "settings";
    settings.type = "color";
    cursorDiv.appendChild(settings);  if (localStorage.getItem("selectedColor")) {
      cursorDiv.style.backgroundColor = localStorage.getItem("selectedColor");
    }
    settings.addEventListener("input", (event) => {
      const selectedColor = event.target.value;
      localStorage.setItem("selectedColor", selectedColor);
      cursorDiv.style.backgroundColor = selectedColor;
    });
  }

  document.body.appendChild(cursorDiv);
};

const closeMenu = () => {
  isMenuActive = false;
  cursorDiv.remove();
};
function handleEvent() {
  if (
    dictionary.hasOwnProperty(currentWord.toLocaleLowerCase()) &&
    (activeElementInfo.isContenteditable || activeElementInfo.isInputOrTextarea)
  ) {
    openMenu();
    return;
  }
  closeMenu();
}
const bodyEvents = () => {
  // handling click event
  document.addEventListener("click", (e) => {
    if (!cursorDiv.contains(e.target)) {
      updateActiveElementInfo();
      if (activeElementInfo.isContenteditable || activeElementInfo.isInputOrTextarea) {
        currentWordBeforeCursor = false;
        currentWord = getCurrentWord();
        handleEvent();
      }
    }
  });

  // handle Arrow or Space button
  let lastKeyPressed = "";
  document.addEventListener("keyup", (event) => {
    if (event.code === "Space") {
      currentWordBeforeCursor = true;
      // if menu is open => closing it if space pressed twice
      if (lastKeyPressed === "Space" || isMenuActive) {
        closeMenu();
      } else {
        currentWord = getCurrentWord();
        handleEvent();
      }
    } else if (event.code.includes("Arrow")) {
      currentWordBeforeCursor = false;
      currentWord = getCurrentWord();
      handleEvent();
    } else if (isMenuActive) {
      closeMenu();
    }
    lastKeyPressed = event.code;
  });
};

bodyEvents();