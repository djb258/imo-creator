# 🌐 Composio + Gemini Connection Guide

## Quick Reference

### **Composio Hosted Service**
```bash
API URL: https://backend.composio.dev
API Key: ak_t-F0AbvfZHUZSUrqAGNn
Alt URL: https://api.composio.dev
```

### **Google Gemini Direct**
```bash
API Key: AIzaSyDp-XJ_6HFZc57f2RaAFXBPXQMOjliF2WY
Model: gemini-2.5-flash
API URL: https://generativelanguage.googleapis.com/v1beta
```

---

## 🔗 How to Connect from Browser/Application

### **Option 1: Direct Composio API Call**

```javascript
// From browser or Node.js
fetch('https://backend.composio.dev/api/v1/actions/{action_name}/execute', {
  method: 'POST',
  headers: {
    'X-API-Key': 'ak_t-F0AbvfZHUZSUrqAGNn',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    input: {
      // Your action parameters
    },
    appName: 'your_app',
    entityId: 'default'
  })
})
```

### **Option 2: Gemini Direct API**

```javascript
// Call Google Gemini directly
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-goog-api-key': 'AIzaSyDp-XJ_6HFZc57f2RaAFXBPXQMOjliF2WY'
  },
  body: JSON.stringify({
    contents: [{
      parts: [{
        text: "Your prompt here"
      }]
    }]
  })
})
```

### **Option 3: Through Composio SDK**

```javascript
// If using Composio SDK
import { Composio } from 'composio-core';

const composio = new Composio({
  apiKey: 'ak_t-F0AbvfZHUZSUrqAGNn',
  baseURL: 'https://backend.composio.dev'
});

// Execute action
const result = await composio.actions.execute({
  actionName: 'YOUR_ACTION',
  input: { /* params */ },
  entityId: 'default'
});
```

---

## 📋 Complete Environment Variables

```bash
# Composio (Hosted Service)
COMPOSIO_API_KEY=ak_t-F0AbvfZHUZSUrqAGNn
COMPOSIO_API_URL=https://backend.composio.dev
COMPOSIO_BASE_URL=https://backend.composio.dev
COMPOSIO_ENTITY_ID=default

# ⚠️ REQUIRED AS OF NOVEMBER 1ST, 2025
COMPOSIO_USER_ID=usr_your_generated_id
COMPOSIO_MCP_URL=http://localhost:3001/tool?user_id=usr_your_generated_id

# Google Gemini (Direct API)
GOOGLE_API_KEY=AIzaSyDp-XJ_6HFZc57f2RaAFXBPXQMOjliF2WY
GEMINI_API_KEY=AIzaSyDp-XJ_6HFZc57f2RaAFXBPXQMOjliF2WY
GEMINI_MODEL=gemini-2.5-flash

# Frontend
FRONTEND_URL=https://imo-creator.vercel.app
```

---

## 🎯 Usage Examples

### **List All Composio Actions**

```bash
curl https://backend.composio.dev/api/v1/actions \
  -H "X-API-Key: ak_t-F0AbvfZHUZSUrqAGNn"
```

### **Execute Gmail Action**

```bash
curl -X POST https://backend.composio.dev/api/v1/actions/GMAIL_SEND_EMAIL/execute \
  -H "X-API-Key: ak_t-F0AbvfZHUZSUrqAGNn" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "to": "recipient@example.com",
      "subject": "Hello",
      "body": "This is a test email"
    },
    "entityId": "default"
  }'
```

### **Generate Text with Gemini**

```bash
curl -X POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyDp-XJ_6HFZc57f2RaAFXBPXQMOjliF2WY \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Explain quantum computing in simple terms"
      }]
    }]
  }'
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────┐
│   Your Browser/Application      │
│   (JavaScript/Python/etc)       │
└────────────┬────────────────────┘
             │
             ├─────────────────────┐
             │                     │
             ▼                     ▼
┌────────────────────┐  ┌──────────────────┐
│  Composio Hosted   │  │  Google Gemini   │
│  backend.composio  │  │  Direct API      │
│  .dev              │  │                  │
│                    │  │  generative      │
│  • Gmail           │  │  language.       │
│  • Drive           │  │  googleapis.com  │
│  • Slack           │  │                  │
│  • 100+ more       │  └──────────────────┘
└────────────────────┘
```

**✅ Everything is hosted - no self-hosting required!**

---

## 🔒 Security Notes

- **API Keys**: Already embedded in this repo (for your use only)
- **CORS**: Composio handles CORS automatically
- **Rate Limits**: Check Composio and Google quotas
- **Entity ID**: Use "default" or your custom entity ID

---

## 📚 Documentation Links

- **Composio Docs**: https://docs.composio.dev
- **Composio API Reference**: https://docs.composio.dev/api
- **Google Gemini Docs**: https://ai.google.dev/docs
- **Available Models**: https://ai.google.dev/models/gemini

---

## ✅ What Was Removed

- ❌ `render.yaml` - Not needed (no self-hosting)
- ❌ All Render URL references
- ❌ Self-hosted MCP server references
- ✅ Updated to Composio hosted service
- ✅ Direct Gemini API access

---

## 🚀 Next Steps

1. **Test Composio Connection**: Try the curl examples above
2. **Browse Available Actions**: Visit https://app.composio.dev to see all 100+ integrated services
3. **Connect More Services**: Use Composio dashboard to authorize Gmail, Drive, etc.
4. **Use Gemini**: Call Gemini directly or through Composio (if they have Gemini integration)

**Everything is ready to use from browser or server!** 🎉
