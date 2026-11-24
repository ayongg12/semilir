# SEMILIR BRT Detection Web

A simple mobile-friendly public web app that captures camera frames in the browser and sends them to the SEMILIR Roboflow Workflow through a Vercel serverless function. The Roboflow API key stays on the server.

## Security first
The API key previously pasted into chat should be considered exposed. Revoke/regenerate it in Roboflow and use a NEW key. Do not put the key in `public/index.html`, frontend JavaScript, GitHub, or a public chat.

## Deploy to Vercel
1. Create a GitHub repository and upload the contents of this folder.
2. Import the repository in Vercel.
3. In Vercel Project Settings → Environment Variables, add:
   - Name: `ROBOFLOW_API_KEY`
   - Value: your newly generated private Roboflow API key
   - Environment: Production (and Preview if needed)
4. Redeploy the project.
5. Open the Vercel URL on a phone. HTTPS is required for browser camera access. Allow camera permission and tap **Mulai Kamera**.

## Run locally
Install Node.js, then:

```bash
npm install
npx vercel dev
```

Create a `.env.local` file with `ROBOFLOW_API_KEY=...` (never commit it), then open the local URL. For phone testing on the same network, use an HTTPS tunnel; camera access is generally blocked on plain HTTP except localhost.

## Workflow assumptions
- Workspace: `khoiruls-workspace-ra8mr`
- Workflow: `semilir`
- Workflow input name: `image`
- Workflow input type: `base64`

The API route sends the image as `inputs.image = { type: "base64", value: "..." }`. If your Workflow's input block is configured with a different input name or your Roboflow workflow expects a URL input, update `api/detect.js` to match its exact input schema.

The frontend expects object-detection predictions containing `x`, `y`, `width`, `height`, `class` and `confidence`. If your workflow returns these under a named output, the prediction extractor searches nested response fields. Check the first inference response if the Workflow output schema differs.

## Important operational note
This prototype sends one camera frame roughly every 0.9 seconds to Roboflow Cloud. It is not continuous full-FPS video inference. It requires internet access and uses Roboflow inference credits/plan quota. Do not connect this prototype directly to a physical gate actuator without independent validation, temporal confirmation, fail-safe logic, and manual override.
