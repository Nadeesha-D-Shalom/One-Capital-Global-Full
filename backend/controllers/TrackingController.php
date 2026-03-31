<?php

require_once __DIR__ . '/../config/db.php';

class TrackingController
{
    private $conn;

    public function __construct()
    {
        $db = new Database();
        $this->conn = $db->connect();
    }

    // ================= TRACK PAGE =================
    public function track()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        $page = $data['page'] ?? 'unknown';
        $ip   = $_SERVER['REMOTE_ADDR'];

        $query = "
            INSERT INTO page_views (page, ip_address, visited_at)
            VALUES (:page, :ip, NOW())
        ";

        $stmt = $this->conn->prepare($query);
        $stmt->execute([
            ":page" => $page,
            ":ip"   => $ip
        ]);

        return [
            "success" => true
        ];
    }

    // ================= GET STATS =================
    public function getStats()
    {
        // total views
        $total = $this->conn->query("
            SELECT COUNT(*) as total FROM page_views
        ")->fetch(PDO::FETCH_ASSOC)['total'];

        // per page
        $pages = $this->conn->query("
            SELECT page, COUNT(*) as count
            FROM page_views
            GROUP BY page
            ORDER BY count DESC
        ")->fetchAll(PDO::FETCH_ASSOC);

        return [
            "success" => true,
            "total" => (int)$total,
            "pages" => $pages
        ];
    }
}