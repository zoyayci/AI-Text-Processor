function initTranslator() {
    const inputElement = document.getElementById("input-text");
    const resultElement = document.getElementById("result");
    const translateButton = document.getElementById("translate-button");
    const clearInputButton = document.getElementById("clear-input-button");
    const copyResultButton = document.getElementById("copy-result-button");
    const sourcePicker = document.getElementById("source-language-picker");
    const targetPicker = document.getElementById("target-language-picker");

    let sourceLanguage = "";
    let targetLanguage = "";

    function createLanguagePicker(container, onSelect) {
        const searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.className = "language-search";
        searchInput.placeholder = "Select language...";
        searchInput.autocomplete = "off";

        const dropdown = document.createElement("div");
        dropdown.className = "language-dropdown";
        dropdown.hidden = true;

        container.appendChild(searchInput);
        container.appendChild(dropdown);

        function renderLanguages(searchText = "") {
            dropdown.innerHTML = "";

            const query = searchText.trim().toLowerCase();

            const languages = Object.entries(window.langCodes)
                .filter(([, name]) =>
                    name.toLowerCase().includes(query)
                )
                .sort((a, b) =>
                    a[1].localeCompare(b[1])
                );

            languages.forEach(([code, name]) => {
                const option = document.createElement("button");

                option.type = "button";
                option.className = "language-option";
                option.textContent = name;

                option.addEventListener("click", () => {
                    searchInput.value = name;
                    dropdown.hidden = true;

                    onSelect({
                        code,
                        name,
                    });

                    updateControls();
                });

                dropdown.appendChild(option);
            });
        }

        searchInput.addEventListener("focus", () => {
            renderLanguages(searchInput.value);
            dropdown.hidden = false;
        });

        searchInput.addEventListener("input", () => {
            onSelect(null);

            renderLanguages(searchInput.value);
            dropdown.hidden = false;

            updateControls();
        });

        return {
            searchInput,
            dropdown,
        };
    }

    const sourceDropdown = createLanguagePicker(
        sourcePicker,
        (language) => {
            sourceLanguage = language?.name || "";
        }
    );

    const targetDropdown = createLanguagePicker(
        targetPicker,
        (language) => {
            targetLanguage = language?.name || "";
        }
    );

    function updateControls() {
        const hasInput = inputElement.value.trim().length > 0;

        const hasLanguages = sourceDropdown.searchInput.value.trim().length > 0 && targetDropdown.searchInput.value.trim().length > 0;

        const hasResult = resultElement.textContent.trim().length > 0;

        translateButton.disabled = !hasInput || !hasLanguages;

        copyResultButton.disabled = !hasResult;
        }

    async function translateText() {
        const text = inputElement.value.trim();
        const source = sourceLanguage || sourceDropdown.searchInput.value.trim();

        const target = targetLanguage || targetDropdown.searchInput.value.trim();

        if (!text || !source || !target) {
            return;
        }
        resultElement.textContent = "";

        translateButton.disabled = true;
        translateButton.textContent = "Translating...";

        try {
            const response = await fetch("/text/translator", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text,
                    source_language: source,
                    target_language: target,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                resultElement.textContent =
                    "Could not translate the text.";
                return;
            }

            resultElement.textContent =
                data.translated_text;
        } catch (error) {
            console.error(
                "Translation request failed:",
                error
            );

            resultElement.textContent =
                "Something went wrong. Please try again.";
        } finally {
            translateButton.textContent = "Translate";
            updateControls();
        }
    }

    async function copyResult() {
        const text =
            resultElement.textContent.trim();

        if (!text) {
            return;
        }

        await navigator.clipboard.writeText(text);

        copyResultButton.classList.add("copied");

        setTimeout(() => {
            copyResultButton.classList.remove("copied");
        }, 1200);
    }

    function clearInput() {
        inputElement.value = "";
        updateControls();
    }

    inputElement.addEventListener(
        "input",
        updateControls
    );

    translateButton.addEventListener(
        "click",
        translateText
    );

    copyResultButton.addEventListener(
        "click",
        copyResult
    );

    clearInputButton.addEventListener(
        "click",
        clearInput
    );

    if (window.translatorOutsideClickHandler) {
        document.removeEventListener(
            "click",
            window.translatorOutsideClickHandler
        );
    }

    window.translatorOutsideClickHandler = (event) => {
        if (!sourcePicker.contains(event.target)) {
            sourceDropdown.dropdown.hidden = true;
        }

        if (!targetPicker.contains(event.target)) {
            targetDropdown.dropdown.hidden = true;
        }
    };

    document.addEventListener(
        "click",
        window.translatorOutsideClickHandler
    );

    let syncingHeight = false;

    if (window.translatorResizeObserver) {
        window.translatorResizeObserver.disconnect();
    }

    const resizeObserver = new ResizeObserver((entries) => {
        if (syncingHeight) {
            return;
        }

        syncingHeight = true;

        const resizedElement = entries[0].target;
        const height = resizedElement.offsetHeight;

        if (resizedElement === inputElement) {
            resultElement.style.height = `${height}px`;
        } else {
            inputElement.style.height = `${height}px`;
        }

        requestAnimationFrame(() => {
            syncingHeight = false;
        });
    });

    resizeObserver.observe(inputElement);
    resizeObserver.observe(resultElement);

    window.translatorResizeObserver = resizeObserver;

    resizeObserver.observe(inputElement);
    resizeObserver.observe(resultElement);


    updateControls();
}