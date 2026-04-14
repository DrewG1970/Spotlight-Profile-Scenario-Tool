# Spotlight Scenario Tool

A personalised leadership coaching tool combining Spotlight behavioural profiles with Black Swan Group Tactical Empathy frameworks.

## Access codes
- `AndrewG` — Andrew Gemmell
- `MichelleF` — Michelle Fox

## Deployment to Netlify

### 1. Create a GitHub repo
- Go to github.com and create a new repository (e.g. `spotlight-scenario-tool`)
- Upload these three files/folders maintaining the structure:
  ```
  index.html
  netlify.toml
  netlify/functions/analyse.js
  ```

### 2. Connect to Netlify
- Go to app.netlify.com
- Click "Add new site" → "Import an existing project"
- Connect your GitHub account and select the repo
- Build settings will be auto-detected from netlify.toml
- Click "Deploy site"

### 3. Add your API key
- In Netlify dashboard go to: Site settings → Environment variables
- Click "Add a variable"
- Key: `ANTHROPIC_API_KEY`
- Value: your Anthropic API key (from console.anthropic.com)
- Click Save
- Go to Deploys → "Trigger deploy" → "Deploy site" to redeploy with the key active

### 4. Done
Your site will be live at a URL like `https://your-site-name.netlify.app`

## Adding new clients
To add a new client profile, edit `index.html` and add a new entry to the `PROFILES` object:

```js
"FirstnameL": {
  name: "Firstname Lastname",
  initials: "FL",
  style: "e.g. Forceful + Logical",
  mindset: "e.g. Optimistic",
  spotlight: "e.g. Forcefully Optimistic",
  data: `[paste full profile text here]`
}
```

Then redeploy via GitHub (push the change) and Netlify will auto-deploy.
