<?php
// Set the content type based on file extension
$path = $_SERVER['REQUEST_URI'];
$ext = pathinfo($path, PATHINFO_EXTENSION);

switch ($ext) {
    case 'css':
        header('Content-Type: text/css');
        break;
    case 'js':
        header('Content-Type: application/javascript');
        break;
    case 'jpg':
    case 'jpeg':
        header('Content-Type: image/jpeg');
        break;
    case 'png':
        header('Content-Type: image/png');
        break;
}

// Remove query string
$path = parse_url($path, PHP_URL_PATH);

// Serve the file if it exists
$file = __DIR__ . $path;
if (file_exists($file) && !is_dir($file)) {
    readfile($file);
    exit;
}

// If no file found, serve index.html
readfile(__DIR__ . '/index.html');
?> 