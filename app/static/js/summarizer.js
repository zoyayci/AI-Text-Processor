function initSummarizer() {
    const summarizeButton = document.getElementById("summarize-button");
    const inputElement = document.getElementById("input-text");
    const clearInputButton = document.getElementById("clear-input-button");
    const resultElement = document.getElementById("result");
    const inputSection = document.querySelector(".input-section");
    const actionRow = document.querySelector(".action-row");
    const copyResultButton = document.getElementById("copy-result-button");
    const downloadResultButton = document.getElementById("download-result-button");

    function updateControls() {
        const hasInput =inputElement.value.trim().length > 0;

        const hasResult = resultElement.textContent.trim().length > 0;

        summarizeButton.disabled = !hasInput;
        copyResultButton.disabled = !hasResult;
        downloadResultButton.disabled = !hasResult;
    }

    
    async function summarizeText() {
        const text = inputElement.value.trim();

        if (!text) {
            return;
        }

        resultElement.textContent = "";
        summarizeButton.disabled = true;
        summarizeButton.textContent = "Summarizing...";

        try {
            const response = await fetch("/text/summarizer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                resultElement.textContent = "Could not summarize the text.";
                return;
            }

            resultElement.textContent = data.summarized_text;
        } catch (error) {
            console.error(
                "Summarizer request failed:",
                error
            );

            resultElement.textContent = "Something went wrong. Please try again.";
        } finally {
            summarizeButton.textContent = "Summarize";
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
        link.download = `summary_${day}${month}${year}.txt`;
        
        link.click();

        URL.revokeObjectURL(url);
    }

    function clearInput() {
        inputElement.value = "";
        updateControls();
    }

    inputElement.addEventListener("input", updateControls);
    summarizeButton.addEventListener("click", summarizeText);
    copyResultButton.addEventListener("click", copyResult);
    downloadResultButton.addEventListener("click", downloadResult);
    clearInputButton.addEventListener("click", clearInput);

    updateControls();
}