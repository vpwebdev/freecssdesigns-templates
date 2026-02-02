/* ============================================================
   DIALOGUE — Chat Interface Logic
   Simulated AI responses with typing effect
   ============================================================ */

(function () {
    'use strict';

    // --- DOM References ---
    const sidebar       = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const newChatBtn    = document.getElementById('newChatBtn');
    const threadList    = document.getElementById('threadList');
    const welcome       = document.getElementById('welcome');
    const chat          = document.getElementById('chat');
    const chatMessages  = document.getElementById('chatMessages');
    const inputForm     = document.getElementById('inputForm');
    const messageInput  = document.getElementById('messageInput');
    const sendBtn       = document.getElementById('sendBtn');
    const greetingEl    = document.getElementById('greeting');

    // --- State ---
    let threads = [];
    let activeThreadId = null;
    let isGenerating = false;
    let abortTyping = false;

    // --- Greeting ---
    function setGreeting() {
        const h = new Date().getHours();
        if (h < 12) greetingEl.textContent = 'morning';
        else if (h < 17) greetingEl.textContent = 'afternoon';
        else greetingEl.textContent = 'evening';
    }
    setGreeting();

    // --- Textarea auto-resize ---
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 160) + 'px';
        sendBtn.disabled = !messageInput.value.trim();
    });

    // --- Sidebar toggle ---
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('is-open');
    });

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            sidebar.classList.contains('is-open') &&
            !sidebar.contains(e.target) &&
            !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('is-open');
        }
    });

    // --- Thread Management ---
    function createThread(firstMessage) {
        const thread = {
            id: Date.now().toString(),
            title: firstMessage.length > 40 ? firstMessage.slice(0, 40) + '...' : firstMessage,
            messages: []
        };
        threads.unshift(thread);
        activeThreadId = thread.id;
        renderThreadList();
        return thread;
    }

    function getActiveThread() {
        return threads.find(t => t.id === activeThreadId);
    }

    function renderThreadList() {
        threadList.innerHTML = '';
        threads.forEach(thread => {
            const el = document.createElement('div');
            el.className = 'sidebar__thread' + (thread.id === activeThreadId ? ' is-active' : '');
            el.innerHTML = `<span class="sidebar__thread-text">${escapeHtml(thread.title)}</span>`;
            el.addEventListener('click', () => switchThread(thread.id));
            threadList.appendChild(el);
        });
    }

    function switchThread(id) {
        activeThreadId = id;
        const thread = getActiveThread();
        renderThreadList();
        renderMessages(thread.messages);
        showChat();
        sidebar.classList.remove('is-open');
    }

    function renderMessages(messages) {
        chatMessages.innerHTML = '';
        messages.forEach(msg => {
            appendMessageDOM(msg.role, msg.content, false);
        });
        scrollToBottom();
    }

    // --- New Chat ---
    newChatBtn.addEventListener('click', () => {
        activeThreadId = null;
        showWelcome();
        sidebar.classList.remove('is-open');
        messageInput.focus();
    });

    // --- Prompt Chips ---
    document.querySelectorAll('.prompt-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.dataset.prompt;
            messageInput.value = prompt;
            messageInput.style.height = 'auto';
            messageInput.style.height = messageInput.scrollHeight + 'px';
            sendBtn.disabled = false;
            handleSend();
        });
    });

    // --- Show/Hide states ---
    function showWelcome() {
        welcome.style.display = 'flex';
        chat.style.display = 'none';
    }

    function showChat() {
        welcome.style.display = 'none';
        chat.style.display = 'block';
    }

    // --- Send Message ---
    inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSend();
    });

    // Ctrl/Cmd + Enter to send
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (messageInput.value.trim()) handleSend();
        }
    });

    function handleSend() {
        const text = messageInput.value.trim();
        if (!text || isGenerating) return;

        // Create thread if needed
        if (!activeThreadId) {
            createThread(text);
            showChat();
        }

        const thread = getActiveThread();

        // Add user message
        thread.messages.push({ role: 'user', content: text });
        appendMessageDOM('user', text, true);

        // Clear input
        messageInput.value = '';
        messageInput.style.height = 'auto';
        sendBtn.disabled = true;

        scrollToBottom();

        // Generate AI response
        setTimeout(() => generateResponse(text), 400);
    }

    // --- Append message to DOM ---
    function appendMessageDOM(role, content, animate) {
        const wrapper = document.createElement('div');
        wrapper.className = `message message--${role}`;
        if (animate) wrapper.style.animationDelay = '0s';

        const avatarLabel = role === 'user' ? 'U' : 'D';

        wrapper.innerHTML = `
            <div class="message__avatar">${avatarLabel}</div>
            <div class="message__body">
                <div class="message__role">${role === 'user' ? 'You' : 'Dialogue'}</div>
                <div class="message__text">${role === 'ai' ? formatMarkdown(content) : '<p>' + escapeHtml(content) + '</p>'}</div>
                ${role === 'ai' ? `
                <div class="message__actions">
                    <button class="message__action-btn" title="Copy" onclick="copyMessageText(this)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                    <button class="message__action-btn" title="Good response">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                    </button>
                    <button class="message__action-btn" title="Bad response">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>
                    </button>
                </div>` : ''}
            </div>
        `;

        chatMessages.appendChild(wrapper);
        return wrapper;
    }

    // --- AI Response Generation (simulated) ---
    const responses = {
        'Explain quantum computing in simple terms': `Quantum computing uses the principles of quantum mechanics to process information differently than classical computers.

**Classical bits** are either 0 or 1. **Quantum bits (qubits)** can exist in a *superposition* — effectively being both 0 and 1 simultaneously until measured.

Here's what makes it powerful:

- **Superposition** — A qubit explores multiple states at once, letting quantum computers evaluate many possibilities simultaneously
- **Entanglement** — Two qubits can be linked so the state of one instantly influences the other, regardless of distance
- **Interference** — Quantum algorithms amplify correct answers and cancel out wrong ones

Think of it this way: a classical computer trying to find the exit in a maze tries each path one at a time. A quantum computer explores *all paths simultaneously*.

That said, quantum computers aren't universally faster. They excel at specific problems: cryptography, drug discovery, optimization, and simulating molecular behavior.`,

        'Write a Python function to sort a list': `Here's a clean implementation of a few sorting approaches:

\`\`\`python
def quick_sort(arr):
    """Quicksort — O(n log n) average case."""
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
\`\`\`

For most practical use cases, Python's built-in \`sorted()\` function is the best choice — it uses **Timsort** (a hybrid of merge sort and insertion sort) and runs in O(n log n):

\`\`\`python
# Built-in (recommended)
numbers = [38, 27, 43, 3, 9, 82, 10]
sorted_numbers = sorted(numbers)

# In-place sort
numbers.sort()
\`\`\`

The built-in sort is implemented in C, heavily optimized, and stable (preserves order of equal elements). Use \`quick_sort\` above for learning — use \`sorted()\` for production.`,

        'Draft a professional email to reschedule a meeting': `Here's a concise, professional template:

---

**Subject:** Request to Reschedule — [Meeting Name]

Hi [Name],

I hope this message finds you well. Due to a scheduling conflict, I'm unable to attend our meeting currently set for **[original date/time]**.

Would any of the following alternatives work for you?

- **[Option 1]** — [Day, Date, Time]
- **[Option 2]** — [Day, Date, Time]
- **[Option 3]** — [Day, Date, Time]

I apologize for any inconvenience and appreciate your flexibility. Please let me know what works best, or feel free to suggest a different time entirely.

Best regards,
[Your Name]

---

A few tips: send the reschedule request *as early as possible*, always offer alternatives (don't make them do the work), and keep the tone brief but warm.`,

        'What are the pros and cons of remote work?': `Here's a balanced breakdown:

**Pros**

- **Flexibility** — Work when you're most productive. No rigid 9-to-5 required
- **No commute** — Saves time, money, and reduces environmental impact
- **Broader talent pool** — Companies can hire from anywhere; workers aren't tied to expensive cities
- **Fewer distractions** — No impromptu desk visits or open-office noise (for many people)
- **Better work-life integration** — Handle personal errands, be present for family

**Cons**

- **Isolation** — Loneliness and lack of social interaction are real challenges
- **Blurred boundaries** — When home *is* the office, it's hard to "clock out"
- **Communication overhead** — Asynchronous work requires more intentional documentation
- **Career visibility** — Out of sight can mean out of mind for promotions
- **Infrastructure dependency** — Requires reliable internet, a quiet space, and self-discipline

**The nuanced take:** Remote work isn't universally better or worse — it depends on the individual, the role, and the company culture. Hybrid models are emerging as the most sustainable middle ground for many organizations.`
    };

    function generateResponse(userMessage) {
        isGenerating = true;
        abortTyping = false;
        const thread = getActiveThread();

        // Show typing indicator
        const aiMsg = appendMessageDOM('ai', '', true);
        const textEl = aiMsg.querySelector('.message__text');
        textEl.innerHTML = `
            <div class="typing-indicator">
                <span class="typing-indicator__dot"></span>
                <span class="typing-indicator__dot"></span>
                <span class="typing-indicator__dot"></span>
            </div>`;
        scrollToBottom();

        // Pick response
        let response = responses[userMessage];
        if (!response) {
            response = generateFallback(userMessage);
        }

        // Simulate delay then type
        setTimeout(() => {
            if (abortTyping) {
                finishGeneration(thread, response);
                return;
            }
            typeText(textEl, response, () => {
                finishGeneration(thread, response);
            });
        }, 800 + Math.random() * 600);
    }

    function finishGeneration(thread, response) {
        thread.messages.push({ role: 'ai', content: response });
        isGenerating = false;
        abortTyping = false;
    }

    function generateFallback(userMessage) {
        const msg = userMessage.toLowerCase();

        if (msg.includes('hello') || msg.includes('hi ') || msg.includes('hey')) {
            return `Hello! I'm Dialogue, a simulated AI assistant. I'm a demo interface — I don't have a real language model behind me, but I can show you how the chat experience feels.\n\nTry asking me one of the suggested prompts, or explore the interface. The design is pure HTML, CSS, and vanilla JavaScript — no frameworks, no dependencies.`;
        }
        if (msg.includes('code') || msg.includes('function') || msg.includes('program')) {
            return `I'd be happy to help with code! As a demo, I have pre-written responses for specific prompts. Try asking me to:\n\n- **"Write a Python function to sort a list"** — I'll show you quicksort and Python's built-in sort\n\nIn a real implementation, this interface would connect to an API endpoint that streams tokens from a language model. The typing animation you see simulates that streaming behavior.`;
        }
        if (msg.includes('who') || msg.includes('what are you')) {
            return `I'm **Dialogue** — a ChatGPT-style interface built as a design template. Here's what I am:\n\n- A **single-page chat UI** built with HTML, CSS, and vanilla JS\n- **No frameworks** — no React, no Vue, no dependencies\n- **No API calls** — responses are simulated client-side\n- Part of the **FreeCSSDesigns** open-source template collection\n\nThe design uses IBM Plex Mono for the monospaced interface text and Newsreader for the editorial headings. Pure black and white, light mode only.`;
        }

        return `That's an interesting question. As a demo interface, I have a limited set of pre-built responses. Here are some things you can try:\n\n- **"Explain quantum computing in simple terms"**\n- **"Write a Python function to sort a list"**\n- **"Draft a professional email to reschedule a meeting"**\n- **"What are the pros and cons of remote work?"**\n\nIn a production environment, this interface would connect to a real language model API and stream responses token by token. The architecture is designed for that — the typing animation mirrors how real AI chat applications deliver text.`;
    }

    // --- Typing Animation ---
    function typeText(el, text, onComplete) {
        const formatted = formatMarkdown(text);
        el.innerHTML = '';

        // Create a temp container, parse HTML
        const temp = document.createElement('div');
        temp.innerHTML = formatted;

        // Flatten text nodes with their parent context
        const segments = [];
        flattenNodes(temp, segments);

        let segIdx = 0;
        let charIdx = 0;
        let currentHtml = '';

        // Rebuild element structure
        el.innerHTML = formatted;
        // Now hide all text by making it transparent, then reveal
        const textNodes = getTextNodes(el);
        const allText = textNodes.map(n => n.textContent);
        textNodes.forEach(n => { n.textContent = ''; });

        let nodeIdx = 0;
        let nodeCharIdx = 0;

        function tick() {
            if (abortTyping) {
                // Reveal all remaining
                for (let i = nodeIdx; i < textNodes.length; i++) {
                    textNodes[i].textContent = allText[i];
                }
                scrollToBottom();
                if (onComplete) onComplete();
                return;
            }

            if (nodeIdx >= textNodes.length) {
                scrollToBottom();
                if (onComplete) onComplete();
                return;
            }

            const fullText = allText[nodeIdx];
            const charsPerTick = getSpeed(fullText[nodeCharIdx]);
            const end = Math.min(nodeCharIdx + charsPerTick, fullText.length);
            textNodes[nodeIdx].textContent = fullText.slice(0, end);
            nodeCharIdx = end;

            if (nodeCharIdx >= fullText.length) {
                nodeIdx++;
                nodeCharIdx = 0;
            }

            scrollToBottom();
            const delay = getDelay(fullText[Math.min(end, fullText.length - 1)]);
            requestAnimationFrame(() => setTimeout(tick, delay));
        }

        tick();
    }

    function getSpeed(char) {
        // Type faster for spaces and common chars
        return (char === ' ' || char === '\n') ? 2 : 1;
    }

    function getDelay(char) {
        if (!char) return 12;
        if (char === '.' || char === '!' || char === '?') return 60 + Math.random() * 40;
        if (char === ',') return 30 + Math.random() * 20;
        if (char === '\n') return 20;
        return 8 + Math.random() * 12;
    }

    function getTextNodes(el) {
        const nodes = [];
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            nodes.push(node);
        }
        return nodes;
    }

    function flattenNodes(el, segments) {
        el.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                segments.push(node.textContent);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                flattenNodes(node, segments);
            }
        });
    }

    // --- Markdown-like Formatting ---
    function formatMarkdown(text) {
        let html = text;

        // Code blocks
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || 'code';
            return `<div class="code-block-header"><span>${escapeHtml(language)}</span><button class="copy-btn" onclick="copyCode(this)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</button></div><pre><code>${escapeHtml(code.trim())}</code></pre>`;
        });

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Bold
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

        // Horizontal rule
        html = html.replace(/^---$/gm, '<hr style="border:none;border-top:1px solid var(--gray-200);margin:16px 0;">');

        // Unordered lists
        html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
        html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

        // Paragraphs — split by double newlines
        html = html.split(/\n\n+/).map(block => {
            const trimmed = block.trim();
            if (trimmed.startsWith('<ul>') ||
                trimmed.startsWith('<pre>') ||
                trimmed.startsWith('<div class="code-block') ||
                trimmed.startsWith('<hr')) {
                return trimmed;
            }
            return '<p>' + trimmed.replace(/\n/g, '<br>') + '</p>';
        }).join('\n');

        return html;
    }

    // --- Utilities ---
    function escapeHtml(str) {
        const el = document.createElement('span');
        el.textContent = str;
        return el.innerHTML;
    }

    function scrollToBottom() {
        chat.scrollTop = chat.scrollHeight;
    }

    // --- Global copy functions ---
    window.copyCode = function (btn) {
        const pre = btn.closest('.code-block-header').nextElementSibling;
        const code = pre.querySelector('code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            const orig = btn.innerHTML;
            btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied';
            setTimeout(() => { btn.innerHTML = orig; }, 1500);
        });
    };

    window.copyMessageText = function (btn) {
        const text = btn.closest('.message__body').querySelector('.message__text').textContent;
        navigator.clipboard.writeText(text).then(() => {
            btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
            setTimeout(() => {
                btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
            }, 1500);
        });
    };

})();
