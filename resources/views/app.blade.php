<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Almar HRIS</title>

    <link rel="icon" type="image/svg+xml" href="/images/almar-main-logo.svg">
    <link rel="alternate icon" href="/favicon.ico">

    <!-- ✅ CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/main.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>