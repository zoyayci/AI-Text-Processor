function initDictionary() {
    const defineButton = document.getElementById("define-button");
    const inputElement = document.getElementById("input-text");
    const clearInputButton = document.getElementById("clear-input-button");
    const resultElement = document.getElementById("result");
    const copyResultButton = document.getElementById("copy-result-button");
    const downloadResultButton = document.getElementById("download-result-button");

    function updateControls() {
        const hasInput =inputElement.value.trim().length > 0;

        const hasResult = resultElement.textContent.trim().length > 0;

        defineButton.disabled = !hasInput;
        copyResultButton.disabled = !hasResult;
        downloadResultButton.disabled = !hasResult;
    }

    
    async function defineWord() {
        const text = inputElement.value.trim();

        if (!text) {
            return;
        }

        resultElement.textContent = "";
        defineButton.disabled = true;
        defineButton.textContent = "Defining...";

        try {
            const response = await fetch("/text/dictionary", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    word: text,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                resultElement.textContent = "Could not define the word/phrase.";
                return;
            }

            renderDefinition(data.definition);
        } catch (error) {
            console.error(
                "Dictionary request failed:",
                error
            );

            resultElement.textContent = "Something went wrong. Please try again.";
        } finally {
            defineButton.textContent = "Define";
            updateControls();
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

    function downloadResult() {
        const text = resultElement.textContent.trim();

        if (!text) {
            return;
        }

        const blob = new Blob([text], {
            type: "text/plain",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;

        const now = new Date();
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();
        link.download = `definition_${day}${month}${year}.txt`;
        
        link.click();

        URL.revokeObjectURL(url);
    }

    function clearInput() {
        inputElement.value = "";
        updateControls();
    }

    function renderDefinition(text) {
        resultElement.textContent = "";

        const lines = text.split("\n");

        lines.forEach((line) => {
            const paragraph = document.createElement("p");

            if (line.startsWith("Definition:")) {
                const label = document.createElement("strong");
                label.textContent = "Definition:";

                paragraph.appendChild(label);
                paragraph.append(
                    line.replace("Definition:", "")
                );
            } else if (line.startsWith("Example:")) {
                const label = document.createElement("strong");
                label.textContent = "Example:";

                paragraph.appendChild(label);
                paragraph.append(
                    line.replace("Example:", "")
                );
            } else {
                paragraph.textContent = line;
            }

            resultElement.appendChild(paragraph);
        });
    }

    inputElement.addEventListener("input", updateControls);
    defineButton.addEventListener("click", defineWord);
    copyResultButton.addEventListener("click", copyResult);
    downloadResultButton.addEventListener("click", downloadResult);
    clearInputButton.addEventListener("click", clearInput);

    updateControls();
}