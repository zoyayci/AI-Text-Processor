function initTextMerge() {
    const mergeButton = document.getElementById("merge-button");
    const addTextButton = document.getElementById("add-text-button");
    const resultElement = document.getElementById("result");
    const inputSection = document.querySelector(".input-section");
    const actionRow = document.querySelector(".action-row");
    const copyResultButton = document.getElementById("copy-result-button");
    const downloadResultButton = document.getElementById("download-result-button" );

    const MIN_TEXTS = 2;
    const MAX_TEXTS = 5;

    function getTextBlocks() {
        return document.querySelectorAll(".text-block");
    }

    function updateTextNumbers() {
        getTextBlocks().forEach((block, index) => {
            const number = index + 1;

            const label = block.querySelector("label");
            const textarea = block.querySelector("textarea");
            const deleteButton = block.querySelector(".delete-button");

            label.textContent = `Text ${number}`;
            label.setAttribute("for", `text-${number}`);

            textarea.id = `text-${number}`;
            textarea.placeholder = `Enter text ${number}...`;

            deleteButton.setAttribute(
                "aria-label",
                `Delete text ${number}`
            );
        });
    }

    function updateControls() {
        const blocks = getTextBlocks();
        const textCount = blocks.length;
        const hasResult =
            resultElement.textContent.trim().length > 0;

        copyResultButton.disabled = !hasResult;
        downloadResultButton.disabled = !hasResult;

        blocks.forEach((block) => {
            block.querySelector(".delete-button").disabled =
                textCount <= MIN_TEXTS;
        });

        addTextButton.disabled = textCount >= MAX_TEXTS;
    }

    function createTextBlock() {
        const block = document.createElement("div");

        block.className = "text-block";

        block.innerHTML = `
            <div class="text-block-header">
                <label></label>

                <button
                    class="delete-button"
                    type="button"
                    aria-label="Delete text"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4 7h16"></path>
                        <path d="M9 7V4h6v3"></path>
                        <path d="M7 7l1 13h8l1-13"></path>
                        <path d="M10 11v5"></path>
                        <path d="M14 11v5"></path>
                    </svg>
                </button>
            </div>

            <textarea class="text-input"></textarea>
        `;

        return block;
    }

    function addText() {
        if (getTextBlocks().length >= MAX_TEXTS) {
            return;
        }

        const block = createTextBlock();

        inputSection.insertBefore(block, actionRow);

        updateTextNumbers();
        updateControls();
    }

    function deleteText(event) {
        const deleteButton =
            event.target.closest(".delete-button");

        if (!deleteButton) {
            return;
        }

        if (getTextBlocks().length <= MIN_TEXTS) {
            return;
        }

        deleteButton.closest(".text-block").remove();

        updateTextNumbers();
        updateControls();
    }

    function downloadResult() {
        const text = resultElement.textContent.trim();

        if (!text) {
            return;
        }

        const now = new Date();

        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();

        const filename =`merged_text_${day}${month}${year}.txt`;

        const blob = new Blob([text], {type: "text/plain;charset=utf-8",});

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = filename;
        link.click();

        URL.revokeObjectURL(url);
    }

    async function mergeTexts() {
        const texts = Array.from(
            document.querySelectorAll(".text-input")
        ).map((textarea) => textarea.value);

        resultElement.textContent = "";

        updateControls();

        mergeButton.disabled = true;
        mergeButton.textContent = "Merging...";

        try {
            const response = await fetch("/text/merge", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ texts }),
            });

            const data = await response.json();

            if (!response.ok) {
                resultElement.textContent =
                    "Please enter between 2 and 5 non-empty texts.";

                return;
            }

            resultElement.textContent = data.merged_text;

            updateControls();
        } catch (error) {
            console.error(
                "Merge request failed:",
                error
            );

            resultElement.textContent =
                "Something went wrong while processing the texts. Please try again.";
        } finally {
            mergeButton.disabled = false;
            mergeButton.textContent = "Merge texts";
        }
    }

    async function copyResult() {
        const text = resultElement.textContent.trim();

        if (!text) {
            return;
        }

        await navigator.clipboard.writeText(text);

        copyResultButton.classList.add("copied");

        setTimeout(() => {
            copyResultButton.classList.remove("copied");
        }, 1200);
    }

    addTextButton.addEventListener("click", addText);
    inputSection.addEventListener("click", deleteText);
    mergeButton.addEventListener("click", mergeTexts);
    copyResultButton.addEventListener("click", copyResult);
    downloadResultButton.addEventListener("click", downloadResult);

    updateControls();
}