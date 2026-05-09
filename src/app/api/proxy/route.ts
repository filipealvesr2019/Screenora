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
    
    if (html.includes('<head>')) {
      modifiedHtml = html.replace('<head>', `<head>${baseTag}`);
    } else if (html.includes('<HEAD>')) {
      modifiedHtml = html.replace('<HEAD>', `<HEAD>${baseTag}`);
    } else {
      // If no head, just prepend it
      modifiedHtml = baseTag + html;
    }

    return new NextResponse(modifiedHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    return new NextResponse(`Error fetching URL: ${(error as Error).message}`, { status: 500 });
  }
}
