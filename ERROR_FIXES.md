# Moonwave Error Fixes

This document explains the errors that were encountered and how they were resolved.

## Errors Fixed

### 1. X-Frame-Options Meta Tag Error
**Error**: `X-Frame-Options may only be set via an HTTP header sent along with a document. It may not be set inside <meta>.`

**Cause**: X-Frame-Options is a security header that can only be set via HTTP headers, not HTML meta tags.

**Fix**: 
- Removed the X-Frame-Options meta tag from `index.html`
- The X-Frame-Options header is properly set in `nginx.conf` with `add_header X-Frame-Options "DENY" always;`

### 2. MIME Type Error for TypeScript Files
**Error**: `Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "application/octet-stream"`

**Cause**: The server was serving TypeScript files with incorrect MIME type.

**Fix**: Updated `nginx.conf` to serve TypeScript and JavaScript files with the correct MIME type:
```nginx
location ~* \.(ts|tsx)$ {
    add_header Content-Type "application/javascript; charset=utf-8";
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(js|mjs)$ {
    add_header Content-Type "application/javascript; charset=utf-8";
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Missing Files (404 Errors)
**Errors**: 
- `/moonwave_log.png:1 Failed to load resource: the server responded with a status of 404`
- `manifest.json:1 Failed to load resource: the server responded with a status of 404`
- `sw.js:1 Failed to load resource: the server responded with a status of 404`

**Cause**: Required files were missing from the deployment.

**Fix**: 
- Created `public/sw.js` service worker file
- Ensured `public/manifest.json` and `public/moonwave_log.png` exist
- Updated deployment script to copy all required files to `dist/` directory

### 4. Service Worker Registration Error
**Error**: `SW registration failed: TypeError: Failed to register a ServiceWorker for scope ('https://oh.moonwave.kr/') with script ('https://oh.moonwave.kr/sw.js'): A bad HTTP response code (404) was received when fetching the script.`

**Cause**: Service worker file was missing and had incorrect caching headers.

**Fix**: 
- Created proper service worker file
- Added specific nginx location for service worker with no-cache headers:
```nginx
location = /sw.js {
    add_header Content-Type "application/javascript; charset=utf-8";
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}
```

### 5. Deprecated Meta Tag Warning
**Warning**: `<meta name="apple-mobile-web-app-capable" content="yes"> is deprecated. Please include <meta name="mobile-web-app-capable" content="yes">`

**Cause**: Using deprecated meta tag for PWA capabilities.

**Fix**: Removed the deprecated `apple-mobile-web-app-capable` meta tag from `index.html`.

## Deployment Instructions

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Run the deployment script**:
   ```bash
   ./scripts/deploy.sh
   ```

3. **Deploy to server**:
   - Copy the contents of `dist/` directory to your web server
   - Ensure nginx configuration is properly set up
   - Restart nginx: `sudo systemctl restart nginx`

## File Structure After Fixes

```
public/
├── manifest.json          # PWA manifest
├── moonwave_log.png       # App logo
├── sw.js                  # Service worker
└── robots.txt

dist/ (after build)
├── index.html
├── manifest.json          # Copied from public/
├── moonwave_log.png       # Copied from public/
├── sw.js                  # Copied from public/
└── assets/                # Built JavaScript/CSS files
```

## Prevention Tips

1. **Always include required files in public directory**
2. **Use proper MIME types in server configuration**
3. **Set security headers via HTTP headers, not meta tags**
4. **Keep service worker files uncached for proper updates**
5. **Test deployment locally before pushing to production**
6. **Use the deployment script to ensure all files are included**

## Testing

After deployment, verify:
- [ ] No console errors
- [ ] Service worker registers successfully
- [ ] PWA manifest loads correctly
- [ ] App logo displays properly
- [ ] All assets load with correct MIME types