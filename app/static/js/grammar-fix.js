function initGrammarFix() {
    const fixGrammarButton = document.getElementById("fix-grammar-button");
    const inputElement = document.getElementById("input-text");
    const clearInputButton = document.getElementById("clear-input-button");
    const resultElement = document.getElementById("grammar-result");
    const copyResultButton = document.getElementById("copy-result-button");
    const popupElement = document.getElementById("grammar-popup");
    const originalElement = document.getElementById("grammar-original");
    const correctedElement = document.getElementById("grammar-corrected");
    const undoButton = document.getElementById("grammar-undo-button");
    const popupCloseButton = document.getElementById("grammar-popup-close");

    let activeChange = null;

    function updateControls() {
        const hasInput = inputElement.value.trim().length > 0;
        const hasResult =resultElement.textContent.trim().length > 0;

        fixGrammarButton.disabled = !hasInput;
        copyResultButton.disabled = !hasResult;
    }

    async function copyResult() {
        const text =resultElement.textContent.trim();

        if (!text) {
            return;
        }

        await navigator.clipboard.writeText(text);

        copyResultButton.classList.add("copied");

        setTimeout(() => {
            copyResultButton.classList.remove("copied");
        }, 1200);
    }
    
    async function fixGrammar() {
        const text = inputElement.value.trim();

        if (!text) {
            return;
        }

        resultElement.textContent = "";
        popupElement.hidden = true;
        activeChange = null;
        fixGrammarButton.disabled = true;
        fixGrammarButton.textContent = "Fixing...";

        try {
            const response = await fetch("/text/grammar-fix", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            const data = await response.json();

            if (!response.ok) {
               resultElement.textContent = "Could not fix the grammar.";
                return;
            }

           renderDiff(text, data.corrected_text);
        } catch (error) {
            console.error("Grammar request failed:", error);

           resultElement.textContent =
                "Something went wrong. Please try again.";
        } finally {
            fixGrammarButton.textContent = "Fix Grammar";
            updateControls();
        }
    }

    function renderDiff(originalText, correctedText) {
        const changes = Diff.diffWordsWithSpace(originalText,correctedText);

        resultElement.innerHTML = "";

        let removedText = "";

        changes.forEach((change, index) => {
            if (change.removed) {
                removedText = change.value;

                const nextChange = changes[index + 1];

                if (!nextChange?.added) {
                    const span = document.createElement("span");

                    span.className = "grammar-change grammar-deletion";
                    span.dataset.original = change.value;
                    span.dataset.corrected = "";

                    span.addEventListener("click", () => {
                        activeChange = span;

                        originalElement.textContent = span.dataset.original;
                        correctedElement.textContent = "—";

                        const wordPosition = span.getBoundingClientRect();
                        const resultSection = span.closest(".result-section");
                        const sectionPosition = resultSection.getBoundingClientRect();
                        const desiredLeft =wordPosition.left - sectionPosition.left;

                        popupElement.style.left = `${desiredLeft}px`;
                        popupElement.style.top =`${wordPosition.bottom - sectionPosition.top + 8}px`;
                        popupElement.style.right = "auto";
                        popupElement.hidden = false;

                        const popupWidth = popupElement.offsetWidth;
                        const maxLeft = resultSection.clientWidth - popupWidth;

                        popupElement.style.left = `${Math.max(0, Math.min(desiredLeft, maxLeft))}px`;
                    });

                    resultElement.appendChild(span);
                    removedText = "";
                }
                return;
            }

            if (change.added) {
                const span = document.createElement("span");

                span.className = "grammar-change";
                span.textContent = change.value;

                span.dataset.original = removedText;
                span.dataset.corrected = change.value;

                span.addEventListener("click", () => {
                    activeChange = span;
                    originalElement.textContent =
                        span.dataset.original || "—";

                    correctedElement.textContent =
                        span.dataset.corrected;

                    const wordPosition = span.getBoundingClientRect();
                    const resultSection = span.closest(".result-section");
                    const sectionPosition = resultSection.getBoundingClientRect();

                    popupElement.style.left =
                        `${wordPosition.left - sectionPosition.left}px`;
                    popupElement.style.top =
                        `${wordPosition.bottom - sectionPosition.top + 8}px`;
                    popupElement.style.right = "auto";
                    popupElement.hidden = false;
                });

                resultElement.appendChild(span);

                removedText = "";
                return;
            }

            removedText = "";

            resultElement.appendChild(
                document.createTextNode(change.value)
            );
        });
    }

    function undoChange() {
        if (!activeChange) {
            return;
        }

        const originalText = activeChange.dataset.original;

        if (originalText) {
            activeChange.replaceWith(
                document.createTextNode(originalText)
            );
        } else {
            activeChange.remove();
        }

        popupElement.hidden = true;
        activeChange = null;

        updateControls();
    }

    inputElement.addEventListener("input", updateControls);
    copyResultButton.addEventListener("click", copyResult);
    fixGrammarButton.addEventListener("click", fixGrammar);
    undoButton.addEventListener("click", undoChange);

    clearInputButton.addEventListener("click", () => {
        inputElement.value = "";
        popupElement.hidden = true;
        activeChange = null;
        updateControls();
    });

    popupCloseButton.addEventListener("click", () => {
        popupElement.hidden = true;
        activeChange = null;
    });

    if (window.grammarFixOutsideClickHandler) {
        document.removeEventListener(
            "click",
            window.grammarFixOutsideClickHandler
        );
    }

    window.grammarFixOutsideClickHandler = (event) => {
        const clickedChange = event.target.closest(".grammar-change");
        const clickedPopup = popupElement.contains(event.target);

        if (!clickedChange && !clickedPopup) {
            popupElement.hidden = true;
            activeChange = null;
        }
    };

    document.addEventListener(
        "click",
        window.grammarFixOutsideClickHandler
    );
    updateControls();
}