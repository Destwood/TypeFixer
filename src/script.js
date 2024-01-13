const dictionary = {
  cat: ["dog", "rat", "bat"],
  helo: ["hello", "help", "hell"],
  heldp: ["help", "held", "hello"],
};
let currentWord = "";
let currentWordBeforeCursor = false;
let isMenuActive = false;
const cursorDiv = document.createElement("div");
function getCaretCoordinates(inputElement, caretPos) {
  const rect = inputElement.getBoundingClientRect();
  const div = document.createElement("div");
  const inputStyle = window.getComputedStyle(inputElement);

  div.textContent = inputElement.value.substring(0, caretPos);
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

  const spanRect = div.getBoundingClientRect();
  let x = rect.left + spanRect.width;
  let y = rect.top + spanRect.height;

  if (y > 30) {
    y -= 55;
  } else {
    y = 30;
  }
  if (x > 60) {
    x -= 50;
  } else {
    x = 5;
  }

  document.body.removeChild(div);

  cursorDiv.style.top = y + "px";
  cursorDiv.style.left = x + "px";
}
function getCaretContentEditable(rect) {
  let x = rect.x;
  let y = rect.y;

  if (y > 50) {
    y -= 35;
  } else {
    y = 30;
  }
  if (x > 75) {
    x -= 70;
  } else {
    x = 5;
  }
  cursorDiv.style.top = y + "px";
  cursorDiv.style.left = x + "px";
}

function getWordBeforeCursor() {
  currentWordBeforeCursor = true;
  const activeElement = document.activeElement;
  if (!activeElement) return "";
  const isInputText =
    activeElement.tagName === "INPUT" && activeElement.type === "text";
  const isTextarea = activeElement.tagName === "TEXTAREA";
  const isContenteditable =
    activeElement.getAttribute("contenteditable") === "true";

  if (isInputText || isTextarea) {
    const cursorPosition = activeElement.selectionStart;
    const text = activeElement.value || activeElement.textContent;
    const words = text.substring(0, cursorPosition).trim().split(/\s+/);

    getCaretCoordinates(activeElement, cursorPosition);
    return words[words.length - 1];
  } else if (isContenteditable) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    getCaretContentEditable(rect);

    const wordsBeforeCursor = range.startContainer.textContent
      .substring(0, range.startOffset)
      .trim()
      .split(/\s+/);
    return wordsBeforeCursor[wordsBeforeCursor.length - 1];
  }
  return "";
}
function getWordUnderCursor() {
  currentWordBeforeCursor = false;
  const activeElement = document.activeElement;
  if (window.getSelection().toString()) {
    return window.getSelection().toString();
  }
  if (!activeElement) return "";
  const isInputOrTextarea =
    activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA";
  const isContenteditable =
    activeElement.getAttribute("contenteditable") === "true";
  if (isInputOrTextarea) {
    const cursorPosition = activeElement.selectionStart;
    const inputString = activeElement.value || activeElement.textContent;
    getCaretCoordinates(activeElement, cursorPosition);
    const textBeforeCursor = inputString.substring(0, cursorPosition);
    const textAfterCursor = inputString.substring(cursorPosition);
    const spaceBeforeCursor = textBeforeCursor.endsWith(" ");
    const spaceAfterCursor = textAfterCursor.startsWith(" ");
    const wordsBeforeCursor = textBeforeCursor.split(" ");
    const wordsAfterCursor = textAfterCursor.split(" ");
    if (spaceBeforeCursor) {
      return wordsAfterCursor[0];
    } else if (spaceAfterCursor) {
      return (
        wordsBeforeCursor[wordsBeforeCursor.length - 1] + wordsAfterCursor[0]
      );
    } else {
      return (
        wordsBeforeCursor[wordsBeforeCursor.length - 1] + wordsAfterCursor[0]
      );
    }
  } else if (isContenteditable) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    getCaretContentEditable(rect);
    const selectionStart = range.startOffset;
    const selectionEnd = range.endOffset;
    const textBeforeCursor = range.startContainer.textContent.substring(
      0,
      selectionStart
    );
    const textAfterCursor =
      range.startContainer.textContent.substring(selectionStart);

    const beforeCursorHasSpace = /\s$/.test(textBeforeCursor);
    const afterCursorHasSpace = /^\s/.test(textAfterCursor);

    const wordsBeforeCursor = textBeforeCursor.trim().split(/\s+/);
    const wordsAfterCursor = textAfterCursor.trim().split(/\s+/);
    const beforeAfterSpaces =
      textBeforeCursor.slice(-1) + textAfterCursor.slice(0, 1);
    // const selectedWordStart =
    //   selectionStart - wordsBeforeCursor[wordsBeforeCursor.length - 1].length;
    // const selectedWordEnd = selectionStart + wordsAfterCursor[0].length - 1;

    // console.log("Selected Word Start:", selectedWordStart);
    // console.log("Selected Word End:", selectedWordEnd);
    if (beforeAfterSpaces === "  ") {
      return "";
    }

    if (beforeCursorHasSpace) {
      return wordsAfterCursor[0].toLowerCase();
    } else if (afterCursorHasSpace) {
      return wordsBeforeCursor[wordsBeforeCursor.length - 1];
    } else {
      return (
        wordsBeforeCursor[wordsBeforeCursor.length - 1] +
        wordsAfterCursor[0].toLowerCase()
      );
    }
  }
  return "";
}
const openMenu = () => {
  cursorDiv.innerHTML = "";

  isMenuActive = true;
  const activeElement = document.activeElement;
  const isInputOrTextarea =
    activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA";
  const isContenteditable =
    activeElement.getAttribute("contenteditable") === "true";

  cursorDiv.className = "Existek";
  const settings = document.createElement("input");
  settings.className = "settings";
  settings.type = "color";
  const wordsList = dictionary[currentWord.toLocaleLowerCase()];
  wordsList.forEach((item) => {
    const option = document.createElement("button");
    option.className = "optionButton";
    option.innerText = item;
    option.addEventListener("click", () => {
      if (
        currentWord !== null &&
        dictionary.hasOwnProperty(currentWord.toLocaleLowerCase())
      ) {
        if (isInputOrTextarea) {
          replaceInputOrTextarea(item, activeElement);
        } else if (isContenteditable) {
          replaceContentEditable(item);
        }
      }
    });
    cursorDiv.appendChild(option);
  });
  if (localStorage.getItem("selectedColor")) {
    cursorDiv.style.backgroundColor = localStorage.getItem("selectedColor");
  }

  settings.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    localStorage.setItem("selectedColor", selectedColor);
    cursorDiv.style.backgroundColor = selectedColor;
  });

  cursorDiv.appendChild(settings);
  document.body.appendChild(cursorDiv);
};
const closeMenu = () => {
  isMenuActive = false;
  cursorDiv.innerHTML = "";
  cursorDiv.remove();
};

function replaceInputOrTextarea(item, activeElement) {
  const cursorPosition = activeElement.selectionStart;
  const inputString = activeElement.value;
  const textBeforeCursor = inputString.substring(0, cursorPosition);
  const textAfterCursor = inputString.substring(cursorPosition);
  const spaceBeforeCursor = textBeforeCursor.endsWith(" ");
  const spaceAfterCursor = textAfterCursor.startsWith(" ");
  const wordBeforeCursorDeleted = textBeforeCursor.replace(/\S+\s*$/, "");
  const wordAfterCursorDeleted = textAfterCursor.replace(/^\s*\S+\s*/, "");
  let newText = "";
  let newCursorPosition = 0;
  if (spaceBeforeCursor) {
    if (currentWordBeforeCursor) {
      newText = wordBeforeCursorDeleted + `${item} ` + textAfterCursor;
      newCursorPosition = wordBeforeCursorDeleted.length + item.length;
    } else {
      newText = textBeforeCursor + `${item} ` + wordAfterCursorDeleted;
      newCursorPosition = textBeforeCursor.length + item.length;
    }
  } else if (spaceAfterCursor) {
    newText = wordBeforeCursorDeleted + `${item}` + textAfterCursor;
    newCursorPosition = wordBeforeCursorDeleted.length + item.length;
  } else {
    newText = wordBeforeCursorDeleted + `${item} ` + wordAfterCursorDeleted;
    newCursorPosition = wordBeforeCursorDeleted.length + item.length;
  }

  activeElement.value = newText;
  activeElement.focus();
  activeElement.setSelectionRange(newCursorPosition, newCursorPosition);

  closeMenu();
}

function replaceContentEditable(item) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const cursorPosition = range.startOffset;
  const textBeforeCursor = range.startContainer.textContent.substring(
    0,
    cursorPosition
  );
  const textAfterCursor =
    range.startContainer.textContent.substring(cursorPosition);
  const spaceBeforeCursor = textBeforeCursor.endsWith(" ");
  const spaceAfterCursor = textAfterCursor.startsWith(" ");
  const wordBeforeCursorDeleted = textBeforeCursor.replace(/\S+\s*$/, "");
  const wordAfterCursorDeleted = textAfterCursor.replace(/^\s*\S+\s*/, "");
  let newText = "";
  let newCursorPosition = 0;

  if (spaceBeforeCursor) {
    if (currentWordBeforeCursor) {
      newText = wordBeforeCursorDeleted + `${item} ` + textAfterCursor;
      newCursorPosition = wordBeforeCursorDeleted.length + item.length;
    } else {
      newText = textBeforeCursor + `${item} ` + wordAfterCursorDeleted;
      newCursorPosition = textBeforeCursor.length + item.length;
    }
  } else if (spaceAfterCursor) {
    newText = wordBeforeCursorDeleted + `${item}` + textAfterCursor;
    newCursorPosition = wordBeforeCursorDeleted.length + item.length;
  } else {
    newText = wordBeforeCursorDeleted + `${item} ` + wordAfterCursorDeleted;
    newCursorPosition = wordBeforeCursorDeleted.length + item.length;
  }

  range.startContainer.textContent = newText;

  range.setStart(range.startContainer, newCursorPosition);
  range.collapse(true);

  selection.removeAllRanges();
  selection.addRange(range);
  closeMenu();
}

function handleEvent() {
  if (
    currentWord !== null &&
    dictionary.hasOwnProperty(currentWord.toLocaleLowerCase())
  ) {
    openMenu();
  } else if (isMenuActive) {
    closeMenu();
  }
}

const bodyEvents = () => {
  const elements = document.querySelectorAll(
    'input[type="text"], textarea, [contenteditable="true"]'
  );

  elements.forEach((element) => {
    element.addEventListener("input", (event) => {
      if (event.data === " ") {
        currentWord = getWordUnderCursor();
      }
    });
  });

  document.addEventListener("click", (e) => {
    // console.log("click\n\n\n\n\n");
    if (!cursorDiv.contains(e.target)) {
      currentWord = getWordUnderCursor();
      handleEvent();
    }
  });

  let lastKeyPressed = "";
  document.addEventListener("keyup", (event) => {
    // console.log("button pressed\n\n\n\n\n");
    if (event.code === "Space") {
      if (lastKeyPressed === "Space") {
        closeMenu();
      } else {
        currentWord = getWordBeforeCursor();
        handleEvent();
      }
    } else if (event.code.includes("Arrow")) {
      currentWord = getWordUnderCursor();
      handleEvent();
    } else if (isMenuActive) {
      closeMenu();
    }
    lastKeyPressed = event.code;
  });
};

bodyEvents();
