<?php

require_once __DIR__ . '/../config/db.php';

class GalleryController
{
    private $conn;

    public function __construct()
    {
        $db = new Database();
        $this->conn = $db->connect();
    }

    /* =========================
       CREATE (UPLOAD IMAGE)
    ========================= */
    public function create()
    {
        header("Content-Type: application/json");

        if (!isset($_FILES['image'])) {
            echo json_encode(["success" => false, "error" => "No image uploaded"]);
            return;
        }

        $title = $_POST['title'] ?? '';
        $file = $_FILES['image'];

        // ================= VALIDATION =================
        $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

        if (!in_array($file['type'], $allowedTypes)) {
            echo json_encode(["success" => false, "error" => "Invalid file type"]);
            return;
        }

        if ($file['size'] > 5 * 1024 * 1024) { // 5MB
            echo json_encode(["success" => false, "error" => "File too large"]);
            return;
        }

        if ($file['error'] !== 0) {
            echo json_encode(["success" => false, "error" => "Upload error"]);
            return;
        }

        // ================= SAFE FILE NAME =================
        $ext = pathinfo($file["name"], PATHINFO_EXTENSION);
        $filename = time() . "_" . uniqid() . "." . $ext;

        // ================= PATH =================
        $targetDir = __DIR__ . '/../uploads/gallery/';
        $targetFile = $targetDir . $filename;

        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        // ================= MOVE FILE =================
        if (!move_uploaded_file($file["tmp_name"], $targetFile)) {
            echo json_encode([
                "success" => false,
                "error" => "Failed to move uploaded file"
            ]);
            return;
        }

        $path = "uploads/gallery/" . $filename;

        // ================= INSERT DB =================
        try {
            $query = "INSERT INTO gallery (title, image_path) VALUES (:title, :path)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ":title" => $title,
                ":path" => $path
            ]);

            echo json_encode(["success" => true]);
        } catch (Exception $e) {
            echo json_encode([
                "success" => false,
                "error" => $e->getMessage()
            ]);
        }
    }

    /* =========================
       READ (GET ALL)
    ========================= */
    public function getAll()
    {
        header("Content-Type: application/json");

        try {
            $stmt = $this->conn->query("SELECT * FROM gallery ORDER BY id DESC");
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "success" => true,
                "data" => $data
            ]);
        } catch (Exception $e) {
            echo json_encode([
                "success" => false,
                "error" => $e->getMessage()
            ]);
        }
    }

    /* =========================
       DELETE
    ========================= */
    public function delete($id)
    {
        header("Content-Type: application/json");

        try {
            // Get image path
            $stmt = $this->conn->prepare("SELECT image_path FROM gallery WHERE id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
                $filePath = __DIR__ . '/../' . $row['image_path'];

                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }

            // Delete DB record
            $stmt = $this->conn->prepare("DELETE FROM gallery WHERE id = ?");
            $stmt->execute([$id]);

            echo json_encode(["success" => true]);

        } catch (Exception $e) {
            echo json_encode([
                "success" => false,
                "error" => $e->getMessage()
            ]);
        }
    }

    /* =========================
       UPDATE (TITLE ONLY)
    ========================= */
    public function update($id)
    {
        header("Content-Type: application/json");

        $title = $_POST['title'] ?? '';

        try {
            $query = "UPDATE gallery SET title = :title WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([
                ":title" => $title,
                ":id" => $id
            ]);

            echo json_encode(["success" => true]);

        } catch (Exception $e) {
            echo json_encode([
                "success" => false,
                "error" => $e->getMessage()
            ]);
        }
    }
}