/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
const dictionary = {
  cat: ["dog", "rat", "bat"],
  helo: ["hello", "help", "hell"],
  heldp: ["help", "held", "hello"],
};
let currentWord = "";
let isMenuActive = false;
const cursorDiv = document.createElement("div");
function getCaretCoordinates(inputElement, caretPos) {
  const rect = inputElement.getBoundingClientRect();
  const div = document.createElement("div");
  div.textContent = inputElement.value.substring(0, caretPos);
  document.body.appendChild(div);

  div.style.whiteSpace = "pre-wrap";
  div.style.visibility = "hidden";
  div.style.position = "absolute";
  div.style.top = "0";
  div.style.left = "0";
  const divRect = div.getBoundingClientRect();
  let x = rect.left + divRect.width;
  let y = rect.top + divRect.height;
  console.log(x, y);
  if (y > 30) {
    y -= 30;
  } else {
    y += 5;
  }
  if (x > 55) {
    x -= 50;
  } else {
    x = 5;
  }
  console.log(x, y);
  document.body.removeChild(div);

  return { x, y };
}

function getWordBeforeCursor() {
  const activeElement = document.activeElement;
  if (!activeElement) return null;
  const isInputText =
    activeElement.tagName === "INPUT" && activeElement.type === "text";
  const isTextarea = activeElement.tagName === "TEXTAREA";
  const isContenteditable =
    activeElement.getAttribute("contenteditable") === "true";

  if (isInputText || isTextarea) {
    const cursorPosition = activeElement.selectionStart;
    const text = activeElement.value || activeElement.textContent;
    const words = text.substring(0, cursorPosition).trim().split(/\s+/);

    const position = getCaretCoordinates(activeElement, cursorPosition);
    cursorDiv.style.top = position.y + "px";
    cursorDiv.style.left = position.x + "px";
    return words[words.length - 1];
  } else if (isContenteditable) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    cursorDiv.style.top = rect.y - 35 + "px";
    cursorDiv.style.left = rect.x - 70 + "px";
    const wordsBeforeCursor = range.startContainer.textContent
      .substring(0, range.startOffset)
      .trim()
      .split(/\s+/);
    return wordsBeforeCursor[wordsBeforeCursor.length - 1];
  }
  return null;
}
function getWordUnderCursor() {
  const activeElement = document.activeElement;
  if (!activeElement) return null;
  const isInputOrTextarea =
    activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA";
  const isContenteditable =
    activeElement.getAttribute("contenteditable") === "true";
  if (isInputOrTextarea) {
    const cursorPosition = activeElement.selectionStart;
    const text = activeElement.value || activeElement.textContent;
    const position = getCaretCoordinates(activeElement, cursorPosition);
    cursorDiv.style.top = position.y + "px";
    cursorDiv.style.left = position.x + "px";
    const words = text.split(/\s+/).filter((word) => word !== "");
    let wordStart = 0;
    let wordEnd = 0;
    const beforeAfterSpaces =
      text[cursorPosition - 1] === " " && text[cursorPosition] === " ";

    for (let i = 0; i < words.length; i++) {
      wordEnd = wordStart + words[i].length;
      if (cursorPosition >= wordStart && cursorPosition <= wordEnd) {
        if (beforeAfterSpaces) {
          return null;
        }
        return words[i];
      }
      wordStart = wordEnd + 1;
    }
  } else if (isContenteditable) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    cursorDiv.style.top = rect.y - 35 + "px";
    cursorDiv.style.left = rect.x - 70 + "px";
    const cursorOffset = range.startOffset;
    const cursorNode = range.startContainer;
    const cursorParentNode = cursorNode.parentNode;
    const textBeforeCursor = cursorParentNode.textContent.substring(
      0,
      cursorOffset
    );
    const textAfterCursor =
      cursorParentNode.textContent.substring(cursorOffset);
    const beforeCursorHasSpace = /\s$/.test(textBeforeCursor);
    const afterCursorHasSpace = /^\s/.test(textAfterCursor);
    const wordsBeforeCursor = textBeforeCursor.trim().split(/\s+/);
    const wordsAfterCursor = textAfterCursor.trim().split(/\s+/);

    const beforeAfterSpaces =
      textBeforeCursor.slice(-1) + textAfterCursor.slice(0, 1);

    if (beforeAfterSpaces === "  ") {
      return null;
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
  return null;
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
          replaceContentEditable(item, activeElement);
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
  const beforeCursor = inputString.substring(0, cursorPosition);
  const afterCursor = inputString.substring(cursorPosition);
  const hasSpaceBefore = /\s$/.test(beforeCursor);
  const hasSpaceAfter = /^\s/.test(afterCursor);

  const wordsBeforeCursor = beforeCursor
    .split(/\s/)
    .filter((word) => word !== "");
  const wordsAfterCursor = afterCursor
    .split(/\s/)
    .filter((word) => word !== "");

  if (!hasSpaceBefore && !hasSpaceAfter) {
    wordsBeforeCursor.pop();
    wordsAfterCursor.shift();
  } else if (hasSpaceBefore) {
    wordsAfterCursor.shift();
  } else if (hasSpaceAfter) {
    wordsBeforeCursor.pop();
  }
  const textWithoutNewLines = `${wordsBeforeCursor.join(
    " "
  )} ${item} ${wordsAfterCursor.join(" ")}`;
  const lineBreakPositions = [];
  for (let i = 0; i < inputString.length; i++) {
    if (inputString[i] === "\n") {
      lineBreakPositions.push(i);
    }
  }
  let updatedString = "";
  for (let i = 0; i < textWithoutNewLines.length; i++) {
    updatedString += textWithoutNewLines[i];
    if (lineBreakPositions.includes(i + 1)) {
      updatedString += "\n";
      i++;
    }
  }
  activeElement.value = updatedString;
  activeElement.focus();
  activeElement.setSelectionRange(cursorPosition, cursorPosition);
  closeMenu();
}

function replaceContentEditable(item) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);

  const previousCursorPosition = range.startOffset;

  const textBeforeCursor = range.startContainer.textContent.substring(
    0,
    range.startOffset
  );
  const textAfterCursor = range.startContainer.textContent.substring(
    range.startOffset
  );

  const wordsBeforeCursor = textBeforeCursor.trim().split(/\s+/);
  const wordsAfterCursor = textAfterCursor.trim().split(/\s+/);
  const hasSpaceBefore = textBeforeCursor.endsWith(" ");
  const hasSpaceAfter = textAfterCursor.startsWith(" ");

  if (!hasSpaceBefore && !hasSpaceAfter) {
    wordsBeforeCursor.pop();
    wordsAfterCursor.shift();
  } else if (hasSpaceBefore) {
    wordsAfterCursor.shift();
  } else if (hasSpaceAfter) {
    wordsBeforeCursor.pop();
  }
  wordsBeforeCursor.push(item);

  const combinedText = wordsBeforeCursor.concat(wordsAfterCursor);
  combinedText[combinedText.length - 1] += " ";

  range.startContainer.textContent = combinedText.join(" ");

  range.setStart(range.startContainer, previousCursorPosition);
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
    console.log("click\n\n\n\n\n");
    if (!cursorDiv.contains(e.target)) {
      currentWord = getWordUnderCursor();
      handleEvent();
    }
  });

  let lastKeyPressed = "";
  document.addEventListener("keyup", (event) => {
    console.log("button pressed\n\n\n\n\n");
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

/******/ })()
;
//# sourceMappingURL=script.js.map