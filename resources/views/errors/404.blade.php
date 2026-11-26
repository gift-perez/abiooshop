<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Page not found · {{ config('app.name') }}</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500|instrument-serif:400,400i" rel="stylesheet">
    <style>
        body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0a0a0a; color: #fafafa;
               font-family: 'Instrument Sans', system-ui, sans-serif; text-align: center; padding: 1.5rem; }
        .eyebrow { font-size: .75rem; letter-spacing: .3em; text-transform: uppercase; opacity: .6; }
        h1 { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; font-size: clamp(2.5rem, 8vw, 5rem); line-height: 1; margin: .75rem 0; }
        p { opacity: .7; max-width: 28rem; margin: 0 auto; }
        a { display: inline-block; margin-top: 2rem; padding: .6rem 1.2rem; border-radius: .375rem; background: #fafafa; color: #0a0a0a;
            text-decoration: none; font-weight: 500; font-size: .875rem; }
    </style>
</head>
<body>
    <main>
        <div class="eyebrow">Error 404</div>
        <h1>This page is somebody else's</h1>
        <p>We couldn't find what you were looking for. It may have sold out, moved, or never existed.</p>
        <a href="{{ url('/') }}">Back to the shop</a>
    </main>
</body>
</html>
