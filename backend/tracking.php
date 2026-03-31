<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . '/config/db.php';

$db = new Database();
$conn = $db->connect();

$method = $_SERVER['REQUEST_METHOD'];

// ================= POST (TRACK PAGE) =================
if ($method === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    $page = $data['page'] ?? 'unknown';
    $ip   = $_SERVER['REMOTE_ADDR'];

    $query = "
        INSERT INTO page_views (page, ip_address, visited_at)
        VALUES (:page, :ip, NOW())
    ";

    $stmt = $conn->prepare($query);
    $stmt->execute([
        ":page" => $page,
        ":ip"   => $ip
    ]);

    echo json_encode([
        "success" => true
    ]);
    exit;
}


// ================= GET (FETCH STATS) =================
if ($method === 'GET') {

    $total = $conn->query("
        SELECT COUNT(*) as total FROM page_views
    ")->fetch(PDO::FETCH_ASSOC)['total'];

    $pages = $conn->query("
        SELECT page, COUNT(*) as count
        FROM page_views
        GROUP BY page
        ORDER BY count DESC
    ")->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "total" => (int)$total,
        "pages" => $pages
    ]);
    exit;
}

echo json_encode([
    "success" => false,
    "message" => "Invalid request"
]);