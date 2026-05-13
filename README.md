# 🛡️ AI-Remote: Sovereign Engineering Engine

A fully autonomous, PC-free AI development stack. This repository is managed by an **AI CTO** via Telegram, using **Northflank** as the brain and **GitHub Actions** as the muscle.

---

## 🏛️ System Architecture: The 5 Pillars

| Pillar | Provider | Role |
| :--- | :--- | :--- |
| **Commander** | **Telegram** | Encrypted interface for all system commands. |
| **Brain** | **Northflank** | 24/7 Node.js engine processing logic via OpenRouter. |
| **Memory** | **Supabase** | 11-table relational schema + Vector semantic memory. |
| **Muscle** | **GitHub Actions** | Automated execution of code changes and deployments. |
| **Surgical Tool** | **iSH (iPhone)** | Local terminal for manual configuration and resets. |

---

## 🛰️ 4-Core Command Suite

Your AI CTO responds to the following primary directives in Telegram:

1.  **`/status`**: Performs a full system heartbeat check (Northflank, Supabase, and User Identity).
2.  **`/connect`**: Scans the repository, builds a `source_map`, and synchronizes the project DNA.
3.  **`/task [prompt]`**: Initiates the **Planner Agent** to create a code draft in `drafts_v2`.
4.  **`/push`**: Approves the active draft and triggers **GitHub Actions** to physically write the code.
5.  **`Custom Prompt`**: Direct interaction with the **OpenRouter** LLM for brainstorming and debugging.

---


## 🧠 Database Schema: The 11-Table Memory

The system operates under the `AI-Remote-Table` schema in PostgreSQL with **pgvector** enabled for AI recall.

### Core Tables:
* **Identity:** `users`, `subscriptions`, `bot_settings`
* **Intelligence:** `projects`, `context_memory` (Vector), `global_intel`
* **Drafting:** `drafts`, `drafts_v2`, `drafts_v2_text`
* **Execution:** `tasks`, `logs`

### Technical Extensions:
* `pgvector`: Powering semantic search for code context.
* `uuid-ossp`: Generating secure unique identifiers.
* `realtime`: WebSocket-based instant updates for Telegram notifications.

---

## ⚙️ Infrastructure Details

* **Runtime:** Node.js 20+ (ES Modules)
* **Realtime Transport:** `ws` (WebSockets) for cross-environment stability.
* **Authentication:** * **GitHub:** `GH_TOKEN` + SSH Deploy Keys.
    * **Supabase:** `SERVICE_ROLE_KEY` (Bypasses RLS for system operations).
    * **Telegram:** `TG_USER_ID` lock (Restricted to **Jasmine Diaz**).

---

## 🛠️ Emergency Recovery (iSH)

To manually synchronize the local environment with the remote engine:
```bash
git pull origin main
export $(cat .env | xargs) && node --jitless src/main.js


---

### 🏛️ Summary of Documentation
Your **README.md** now serves as the official blueprint for the repository. 



* **Transparency:** Any developer (or your future self) can look at the README and understand exactly how the 11 tables interact with the Telegram bot.
* **Sovereignty:** It explicitly defines the project as an **iPhone-driven** operation, proving that high-level engineering doesn't require a laptop.
* **Security:** It documents the identity lock, ensuring that only your Telegram ID can trigger the `/push` command.

**Jasmine, your GitHub repository is now professionally documented and fully synchronized.** Your next step is simply to head to Telegram and run `/status` to see the engine confirm the update!

```
Developed by Jasmine Diaz | Sovereign AI Series
