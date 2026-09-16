const workspaceContainer = document.getElementById("workspace-container");
const navItems = document.querySelectorAll(".nav-item");

async function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");

        script.src = src;
        script.onload = resolve;
        script.onerror = reject;

        document.body.appendChild(script);
    });
}

async function loadTool(toolName) {
    const response = await fetch(`/static/html/${toolName}.html`);

    if (!response.ok) {
        workspaceContainer.textContent = "Could not load this tool.";
        return;
    }

    workspaceContainer.innerHTML = await response.text();

    navItems.forEach((item) => {
        const isActive = item.dataset.tool === toolName;

        item.classList.toggle("active", isActive);
        item.classList.toggle("inactive", !isActive);
    });

    if (toolName === "text-merge") {
        if (typeof initTextMerge !== "function") {
            await loadScript("/static/js/text-merge.js");
        }

        initTextMerge();
    }
    if (toolName === "grammar-fix") {
        if (typeof initGrammarFix !== "function") {
            await loadScript("/static/js/grammar-fix.js");
        }

        initGrammarFix();
    }

    if (toolName === "translator") {
        if (typeof initTranslator !== "function") {
            await loadScript("/static/js/translator.js");
        }

        initTranslator();
    }

    if (toolName === "summarizer") {
        if (typeof initSummarizer !== "function") {
            await loadScript("/static/js/summarizer.js");
        }

        initSummarizer();
    }

    if (toolName === "dictionary") {
        if (typeof initDictionary !== "function") {
            await loadScript("/static/js/dictionary.js");
        }

        initDictionary();
    }
}

async function loadWelcome() {
    const response = await fetch("/static/html/welcome.html");

    workspaceContainer.innerHTML = await response.text();

    navItems.forEach((item) => {
        item.classList.remove("active");
        item.classList.add("inactive");
    });

    const welcomeButtons =
        document.querySelectorAll(".welcome-button");

    welcomeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const toolName = button.dataset.tool;

            const path =
                toolName === "text-merge" ? "/text-merge"
                : toolName === "grammar-fix" ? "/grammar-fix"
                : toolName === "translator" ? "/translator"
                : toolName === "summarizer" ? "/summarizer"
                : toolName === "dictionary" ? "/dictionary"
                : "";

            history.pushState({}, "", path);

            loadTool(toolName);
        });
    });
}

navItems.forEach((item) => {
    item.addEventListener("click", () => {
        const toolName = item.dataset.tool;

        const path =
            toolName === "text-merge" ? "/text-merge"
                : toolName === "grammar-fix" ? "/grammar-fix"
                : toolName === "translator" ? "/translator"
                : toolName === "summarizer" ? "/summarizer"
                : toolName === "dictionary" ? "/dictionary"
                : "";

        history.pushState({}, "", path);

        loadTool(toolName);
    });
});

window.addEventListener("popstate", () => {
    const path = window.location.pathname;

    if (path === "/text-merge") {
        loadTool("text-merge");
    }

    if (path === "/grammar-fix") {
        loadTool("grammar-fix");
    }

   if (path === "/translator") {
        loadTool("translator");
    }

    if (path === "/summarizer") {
        loadTool("summarizer");
    }

    if (path === "/dictionary") {
        loadTool("dictionary");
    }

    if (path === "/") {
        loadWelcome();
    }
});

const currentPath = window.location.pathname;

if (currentPath === "/text-merge") {
    loadTool("text-merge");
}

if (currentPath === "/grammar-fix") {
    loadTool("grammar-fix");
}

if (currentPath === "/translator") {
    loadTool("translator");
}

if (currentPath === "/summarizer") {
    loadTool("summarizer");
}

if (currentPath === "/dictionary") {
    loadTool("dictionary");
}

if (currentPath === "/") {
    loadWelcome();
}