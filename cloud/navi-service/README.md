---
title: CampusOS Navi Cloud
emoji: 🧭
colorFrom: indigo
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# CampusOS Navi Cloud Service

Intelligent Edge-Cloud Hybrid assistant for CampusOS.
Powered by:
- **Cactus Needle 2** (Deterministic Tool Matcher)
- **Groq Llama 3.3 70B** (Primary Low-Latency LLM Engine)
- **Cerebras Llama 3.1 70B** (Ultra-Fast Hot Fallback Engine)

## Environment Variables to set in Hugging Face Space Settings:
- `GROQ_API_KEY`: Your Groq API key from console.groq.com
- `CEREBRAS_API_KEY`: Your Cerebras API key from cloud.cerebras.ai
- `NAVI_AUTH_TOKEN`: (Optional) Secret token if you want to restrict access to CampusOS
