<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../controllers/AdminController.php';
require_once __DIR__ . '/../controllers/MarketController.php';
require_once __DIR__ . '/../controllers/BlogController.php';
require_once __DIR__ . '/../controllers/MessageController.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'] ?? '/';
$uri = strtok($uri, '?');

$path = '/';
$apiPosition = strpos($uri, 'api.php');

if ($apiPosition !== false) {
    $path = substr($uri, $apiPosition + strlen('api.php'));
    if ($path === '') {
        $path = '/';
    }
}

// ADMIN LOGIN
if ($method === 'POST' && $path === '/admin/login') {
    (new AdminController())->login();
    exit;
}

// ADMIN PROFILE
if ($method === 'GET' && $path === '/admin/profile') {
    (new AdminController())->getProfile();
    exit;
}

if ($method === 'PUT' && $path === '/admin/profile') {
    (new AdminController())->updateProfile();
    exit;
}

if ($method === 'POST' && $path === '/admin/change-password') {
    (new AdminController())->changePassword();
    exit;
}

// ADMIN CRUD
if ($method === 'GET' && $path === '/admin/admins') {
    (new AdminController())->getAllAdmins();
    exit;
}

if ($method === 'POST' && $path === '/admin/admins') {
    (new AdminController())->createAdmin();
    exit;
}

if ($method === 'PUT' && $path === '/admin/admins') {
    (new AdminController())->updateAdmin();
    exit;
}

if ($method === 'DELETE' && $path === '/admin/admins') {
    (new AdminController())->deleteAdmin();
    exit;
}

// MARKET CRUD
if ($method === 'GET' && $path === '/market') {
    (new MarketController())->getAll();
    exit;
}

if ($method === 'POST' && $path === '/market') {
    (new MarketController())->create();
    exit;
}

if ($method === 'PUT' && $path === '/market') {
    (new MarketController())->update();
    exit;
}

if ($method === 'DELETE' && $path === '/market') {
    (new MarketController())->delete();
    exit;
}

// BLOG ROUTES
if ($method === 'POST' && $path === '/blog') {
    (new BlogController())->create();
    exit;
}

if ($method === 'GET' && $path === '/blog') {
    (new BlogController())->getAll();
    exit;
}

if ($method === 'PUT' && $path === '/blog') {
    (new BlogController())->update();
    exit;
}

if ($method === 'DELETE' && $path === '/blog/delete') {
    (new BlogController())->delete();
    exit;
}

// MESSAGE CRUD
if ($method === 'GET' && $path === '/messages') {
    (new MessageController())->getAll();
    exit;
}

if ($method === 'POST' && $path === '/messages') {
    (new MessageController())->create();
    exit;
}

if ($method === 'PUT' && $path === '/messages/view') {
    (new MessageController())->markViewed();
    exit;
}

if ($method === 'PUT' && $path === '/messages/trash') {
    (new MessageController())->moveToTrash();
    exit;
}

if ($method === 'PUT' && $path === '/messages/restore') {
    (new MessageController())->restore();
    exit;
}

if ($method === 'DELETE' && $path === '/messages/delete') {
    (new MessageController())->deleteForever();
    exit;
}

http_response_code(404);
echo json_encode([
    "success" => false,
    "message" => "Route not found",
    "path" => $path
]);