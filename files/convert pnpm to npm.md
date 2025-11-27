# switch a Node.js project from pnpm to npm

### Quick checklist

Quick checklist (high level)
	1.	Remove pnpm artifacts (pnpm-lock.yaml, pnpm-workspace.yaml, .npmrc pnpm lines).
	2.	Clean node_modules.
	3.	Create package-lock.json with npm install.
	4.	Update scripts / CI / docs to use npm commands.
	5.	Test build & CI, address dependency quirks (dedupe/peer deps).

### Step-by-step

1) Clean pnpm traces and installed modules

```
# from repo root
rm -f pnpm-lock.yaml
rm -f pnpm-workspace.yaml        # if present (monorepo)
# remove any .npmrc lines enforcing pnpm or "package-manager=pnpm@..."
# then remove node_modules so npm can install cleanly:
rm -rf node_modules
```


2) Convert workspace config (only if you use a monorepo)

If you used pnpm-workspace.yaml, move its packages list into root package.json under "workspaces":

pnpm-workspace.yaml (example)
```
packages:
  - "packages/*"
  - "apps/*"
```

Add to package.json (root):
```
{
  "workspaces": ["packages/*", "apps/*"]
}
```
(If you already had "workspaces" in package.json, just confirm it matches.)

3) Generate package-lock.json and install with npm
```
# Install with npm and generate package-lock.json
npm install
# For CI and reproducible installs, prefer:
npm ci
```

npm install will create package-lock.json. If you want strictly reproducible installs in CI, use npm ci (requires package-lock.json present).

4) Replace pnpm CLI usage in scripts & docs
	•	Search for pnpm usages (scripts, README, CI):

