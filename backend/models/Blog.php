<?php

require_once __DIR__ . '/../config/db.php';

class Blog
{
    private $conn;

    public function __construct()
    {
        $db         = new Database();
        $this->conn = $db->connect();
    }

    /* =========================
       CREATE BLOG
    ========================= */
    public function create($data)
    {
        $query = "
            INSERT INTO blogs
            (title, content, excerpt, category, author, status, created_at)
            VALUES
            (:title, :content, :excerpt, :category, :author, :status, NOW())
        ";

        $stmt = $this->conn->prepare($query);

        $stmt->execute([
            ":title"    => $data['title'],
            ":content"  => $data['content'],
            ":excerpt"  => $data['excerpt'],
            ":category" => $data['category'],
            ":author"   => $data['author'],
            ":status"   => $data['status'],
        ]);

        return $this->conn->lastInsertId();
    }

    /* =========================
       UPDATE BLOG
    ========================= */
    public function update($data)
    {
        $query = "
            UPDATE blogs
            SET title      = :title,
                content    = :content,
                excerpt    = :excerpt,
                category   = :category,
                author     = :author,
                status     = :status,
                updated_at = NOW()
            WHERE id = :id
        ";

        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ":id"       => $data['id'],
            ":title"    => $data['title'],
            ":content"  => $data['content'],
            ":excerpt"  => $data['excerpt'],
            ":category" => $data['category'],
            ":author"   => $data['author'],
            ":status"   => $data['status'],
        ]);
    }

    /* =========================
       SAVE IMAGE (new blog)
    ========================= */
    public function saveImage($blogId, $imagePath)
    {
        $stmt = $this->conn->prepare("
            INSERT INTO blog_images (blog_id, image_url, is_cover)
            VALUES (:blog_id, :image_url, 1)
        ");

        return $stmt->execute([
            ":blog_id"   => $blogId,
            ":image_url" => $imagePath,
        ]);
    }

    /* =========================
       UPDATE IMAGE (existing blog)
       FIX: replaces the existing cover row instead
       of inserting a second one
    ========================= */
    public function updateImage($blogId, $imagePath)
    {
        // Check if a cover image row already exists
        $check = $this->conn->prepare("
            SELECT id FROM blog_images
            WHERE blog_id = :blog_id AND is_cover = 1
            LIMIT 1
        ");
        $check->execute([":blog_id" => $blogId]);
        $existing = $check->fetch(PDO::FETCH_ASSOC);

        if ($existing) {
            // UPDATE the existing row
            $stmt = $this->conn->prepare("
                UPDATE blog_images
                SET image_url = :image_url
                WHERE blog_id = :blog_id AND is_cover = 1
            ");
        } else {
            // No cover row yet — INSERT one
            $stmt = $this->conn->prepare("
                INSERT INTO blog_images (blog_id, image_url, is_cover)
                VALUES (:blog_id, :image_url, 1)
            ");
        }

        return $stmt->execute([
            ":blog_id"   => $blogId,
            ":image_url" => $imagePath,
        ]);
    }

    /* =========================
       GET ALL BLOGS
    ========================= */
    public function getAll()
    {
        $query = "
            SELECT b.*, i.image_url
            FROM blogs b
            LEFT JOIN blog_images i
                ON b.id = i.blog_id AND i.is_cover = 1
            ORDER BY b.id DESC
        ";

        $stmt = $this->conn->query($query);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /* =========================
       DELETE BLOG
    ========================= */
    public function delete($id)
    {
        // Delete associated images first (foreign key safety)
        $imgStmt = $this->conn->prepare("DELETE FROM blog_images WHERE blog_id = :id");
        $imgStmt->execute([":id" => $id]);

        $stmt = $this->conn->prepare("DELETE FROM blogs WHERE id = :id");
        return $stmt->execute([":id" => $id]);
    }
}