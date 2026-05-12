import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('URL is required', { status: 400 });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();

    // Insert <base> tag to fix relative paths
    // We try to insert it right after <head>
    let modifiedHtml = html;
    const baseTag = `<base href="${url}">`;

    const scriptTag = `<script>
      // Prevent SecurityError when framed app tries to modify history on different origin
      const noop = () => {};
      try {
        window.history.pushState = noop;
        window.history.replaceState = noop;
      } catch (e) {}
    </script>`;
    
    if (html.includes('<head>')) {
      modifiedHtml = html.replace('<head>', `<head>${baseTag}${scriptTag}`);
    } else if (html.includes('<HEAD>')) {
      modifiedHtml = html.replace('<HEAD>', `<HEAD>${baseTag}${scriptTag}`);
    } else {
      modifiedHtml = baseTag + scriptTag + html;
    }

    return new NextResponse(modifiedHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    return new NextResponse(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          :root {
            --bg: #0c0c0e;
            --card-bg: #141417;
            --border: #1f1f23;
            --text: #ffffff;
            --text-muted: #a1a1aa;
            --accent: #eab308;
          }
          body {
            background-color: var(--bg);
            color: var(--text);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            overflow: hidden;
          }
          .container {
            background-color: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 32px;
            max-width: 400px;
            width: 80%;
            text-align: center;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
          }
          .icon {
            width: 48px;
            height: 48px;
            background-color: rgba(234, 179, 8, 0.1);
            color: var(--accent);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            font-size: 24px;
            font-weight: bold;
          }
          h1 {
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 8px;
          }
          p {
            font-size: 14px;
            color: var(--text-muted);
            margin: 0 0 24px;
            line-height: 1.5;
          }
          button {
            background-color: var(--accent);
            color: #000;
            border: none;
            border-radius: 8px;
            padding: 10px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }
          button:hover {
            opacity: 0.9;
            transform: translateY(-1px);
          }
          button:active {
            transform: translateY(0);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">!</div>
          <h1>Page fail reload</h1>
          <p>We couldn't load this page. The site might refuse to be displayed in an iframe or is currently unavailable.</p>
          <button onclick="window.location.reload()">Reload Page</button>
        </div>
      </body>
      </html>
    `, { 
      status: 500,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
}
