<?php

require_once __DIR__ . '/../config/db.php';

class Market
{
    private $conn;
    private $table = "market_data";

    public function __construct()
    {
        $db = new Database();
        $this->conn = $db->connect();
    }

    public function getAll()
    {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} ORDER BY id DESC");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function create($data)
    {
        try {
            $query = "INSERT INTO {$this->table}
                (name, price, change_value, volume, is_active, updated_at)
                VALUES (:name, :price, :change_value, :volume, 1, NOW())";

            $stmt = $this->conn->prepare($query);

            return $stmt->execute([
                ":name" => trim($data['name'] ?? ''),
                ":price" => is_numeric($data['price'] ?? null) ? $data['price'] : 0,
                ":change_value" => is_numeric($data['change_value'] ?? null) ? $data['change_value'] : 0,
                ":volume" => trim($data['volume'] ?? '')
            ]);
        } catch (PDOException $e) {
            error_log("Market create error: " . $e->getMessage());
            return false;
        }
    }

    public function update($data)
    {
        try {
            $query = "UPDATE {$this->table}
                SET name = :name,
                    price = :price,
                    change_value = :change_value,
                    volume = :volume,
                    updated_at = NOW()
                WHERE id = :id";

            $stmt = $this->conn->prepare($query);

            return $stmt->execute([
                ":id" => $data['id'],
                ":name" => trim($data['name'] ?? ''),
                ":price" => is_numeric($data['price'] ?? null) ? $data['price'] : 0,
                ":change_value" => is_numeric($data['change_value'] ?? null) ? $data['change_value'] : 0,
                ":volume" => trim($data['volume'] ?? '')
            ]);
        } catch (PDOException $e) {
            error_log("Market update error: " . $e->getMessage());
            return false;
        }
    }

    public function delete($id)
    {
        try {
            $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE id = :id");
            return $stmt->execute([":id" => $id]);
        } catch (PDOException $e) {
            error_log("Market delete error: " . $e->getMessage());
            return false;
        }
    }
}