---
description: Run a multi-agent review of the codebase in parallel
---

# Parallel Multi-Agent Audit Workflow

This workflow orchestrates multiple, concurrent conversations to audit the Zaidi Ya Misuli codebase using the specialized agents.

The user wants one agent (Antigravity) to act as an orchestrator, dispatching prompts to the specialized agents in parallel and waiting for their results.

## Instructions for Orchestrator

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and create three **new** VS Code chats.
2. In the first chat, you will act as **Cipher**. Paste the following prompt:

    ```text
    You act as Cipher (Backend & Config Specialist).

    CONTEXT: The user has a Vite + Tailwind HTML project in the `f:/Work/Websites/Zaidi Ya Misuli/zaidi-ya-misuli-v2` directory.
    
    TASK: Review the `package.json`, `vite.config.js`, and `tailwind.config.js` files for build scripts, plugins, and dependencies.
    Fix any deprecated settings, incorrect syntax, or plugin mismatches. After your fixes, verify that the project can be built using `npm run build`. When finished, provide a concise summary of what you fixed and whether the build was successful.
    ```

3. In the second chat, you will act as **Jabari**. Paste the following prompt:

    ```text
    You act as Jabari (Data & Content Architect).

    CONTEXT: The user has a static Vite HTML project in the `f:/Work/Websites/Zaidi Ya Misuli/zaidi-ya-misuli-v2` directory.
    
    TASK: Review all `*.html` files and `main.js`. Verify all relative paths for intra-site links (`href`), image sources (`src`), and any data links. Ensure consistency in `<head>` metadata (`<title>`, `<meta>`). Fix any broken paths or SEO/content structuring issues you find. When finished, provide a concise summary of your fixes.
    ```

4. In the third chat, you will act as **Amara**. Paste the following prompt:

    ```text
    You act as Amara (Frontend & UI Specialist).

    CONTEXT: The user has a Vite + Tailwind HTML project in the `f:/Work/Websites/Zaidi Ya Misuli/zaidi-ya-misuli-v2` directory.
    
    TASK: Review all `*.html` files and `main.js`. Check the Tailwind CSS class usage for correctness, responsiveness, and design consistency. Check the standard Javascript DOM manipulation logic in `main.js` to ensure it doesn't throw `null` reference errors when elements aren't present on the page. Fix any visual bugs or JavaScript console errors related to the UI. When finished, provide a concise summary of your fixes.
    ```

5. Wait for all three agents to complete their tasks in their respective windows.
6. Once they have all reported their status, review their summaries.
7. Run the dev server (`npm run dev`).
8. Start the Browser Subagent to perform a final visual QA across the website to verify the combined changes from the parallel tasks.
