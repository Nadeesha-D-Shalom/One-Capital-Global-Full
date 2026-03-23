<?php

require_once __DIR__ . '/../config/db.php';

class Message
{
    private $conn;
    private $table = "contact_messages";

    public function __construct()
    {
        $db = new Database();
        $this->conn = $db->connect();
    }

    public function getAll()
    {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} ORDER BY id DESC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data)
    {
        $query = "INSERT INTO {$this->table}
                    (full_name, email, phone, address, message, viewed, deleted)
                  VALUES
                    (:full_name, :email, :phone, :address, :message, 0, 0)";

        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ":full_name" => trim($data['full_name'] ?? ''),
            ":email"     => trim($data['email'] ?? ''),
            ":phone"     => trim($data['phone'] ?? ''),
            ":address"   => trim($data['address'] ?? ''),
            ":message"   => trim($data['message'] ?? '')
        ]);
    }

    public function markViewed($id)
    {
        $stmt = $this->conn->prepare("UPDATE {$this->table} SET viewed = 1 WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function moveToTrash($id)
    {
        $stmt = $this->conn->prepare("UPDATE {$this->table} SET deleted = 1 WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function restore($id)
    {
        $stmt = $this->conn->prepare("UPDATE {$this->table} SET deleted = 0 WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function deleteForever($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE id = ?");
        return $stmt->execute([$id]);
    }
}