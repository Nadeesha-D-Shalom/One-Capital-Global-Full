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
require_once __DIR__ . '/../controllers/TrackingController.php';
require_once __DIR__ . '/../controllers/GalleryController.php';


$method = $_SERVER['REQUEST_METHOD'];

$method = $_SERVER['REQUEST_METHOD'];

// Get the path from the request
$path = '/';

// Method 1: Use PATH_INFO if available
if (isset($_SERVER['PATH_INFO']) && !empty($_SERVER['PATH_INFO'])) {
    $path = $_SERVER['PATH_INFO'];
} else {
    // Method 2: Parse REQUEST_URI
    $uri = $_SERVER['REQUEST_URI'];
    $queryPos = strpos($uri, '?');
    if ($queryPos !== false) {
        $uri = substr($uri, 0, $queryPos);
    }
    
    // Try different ways to extract the path
    if (preg_match('#/api\.php(/.*)?$#', $uri, $matches)) {
        $path = $matches[1] ?? '/';
    } elseif (strpos($uri, '/api.php/') !== false) {
        $path = substr($uri, strpos($uri, '/api.php/') + 8);
    } elseif (($pos = strrpos($uri, 'api.php')) !== false) {
        $path = substr($uri, $pos + 7);
    }
    
    if (empty($path)) {
        $path = '/';
    }
}

// Normalize the path
$path = trim($path);
$path = rtrim($path, "/");
if ($path === '') {
    $path = '/';
}

// ADMIN LOGIN
if ($method === 'POST' && strpos($path, '/admin/login') === 0) {
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
    // TEMP DEBUG
    echo json_encode([
        "success" => true,
        "admins" => [["id" => 1, "username" => "test"]],
        "debug_path" => $path,
        "debug_uri" => $_SERVER['REQUEST_URI']
    ]);
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


// ================= TRACKING =================
if ($method === 'POST' && $path === '/tracking') {
    echo json_encode((new TrackingController())->track());
    exit;
}

if ($method === 'GET' && $path === '/tracking') {
    echo json_encode((new TrackingController())->getStats());
    exit;
}

// ================= GALLERY =================
if ($path === '/gallery') {
    $controller = new GalleryController();

    if ($method === 'GET') {
        $controller->getAll();
        exit;
    }

    if ($method === 'POST') {
        $controller->create();
        exit;
    }

    if ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            echo json_encode([
                "success" => false,
                "error" => "ID is required"
            ]);
            exit;
        }

        $controller->delete($id);
        exit;
    }

    if ($method === 'PUT') {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            echo json_encode([
                "success" => false,
                "error" => "ID is required"
            ]);
            exit;
        }

        $controller->update($id);
        exit;
    }
}



http_response_code(404);
echo json_encode([
    "success" => false,
    "message" => "Route not found",
    "path" => $path
]);
