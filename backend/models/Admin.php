<?php

require_once __DIR__ . '/../config/db.php';

class Admin
{
    private $conn;
    private $table = "admins";

    public function __construct()
    {
        $database = new Database();
        $this->conn = $database->connect();
    }

    public function findByUsernameOrEmail($login)
    {
        $query = "SELECT * FROM {$this->table} 
                  WHERE username = :login OR email = :login 
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":login", $login);
        $stmt->execute();

        return $stmt->fetch();
    }

    public function getById($id)
    {
        $query = "SELECT id, username, full_name, email, role, status, created_at, updated_at 
              FROM {$this->table} WHERE id = :id LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        return $stmt->fetch();
    }

    public function updateProfile($data)
    {
        $query = "UPDATE {$this->table}
              SET full_name = :full_name,
                  email = :email,
                  role = :role,
                  status = :status,
                  updated_at = NOW()
              WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ":id" => $data['id'],
            ":full_name" => $data['full_name'],
            ":email" => $data['email'],
            ":role" => $data['role'],
            ":status" => $data['status']
        ]);
    }

    public function changePassword($id, $newPassword)
    {
        $hash = password_hash($newPassword, PASSWORD_BCRYPT);

        $query = "UPDATE {$this->table}
              SET password_hash = :password,
                  updated_at = NOW()
              WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ":id" => $id,
            ":password" => $hash
        ]);
    }

    public function verifyPassword($id, $password)
    {
        $query = "SELECT password_hash FROM {$this->table} WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        $admin = $stmt->fetch();

        if (!$admin) return false;

        return password_verify($password, $admin['password_hash']);
    }


    public function getAll()
    {
        $query = "SELECT id, username, full_name, email, role, status, created_at 
              FROM {$this->table} ORDER BY id DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function create($data)
    {
        $hash = password_hash($data['password'], PASSWORD_BCRYPT);

        $query = "INSERT INTO {$this->table}
              (username, email, password_hash, full_name, role, status, created_at)
              VALUES (:username, :email, :password, :full_name, :role, :status, NOW())";

        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ":username" => $data['username'],
            ":email" => $data['email'],
            ":password" => $hash,
            ":full_name" => $data['full_name'],
            ":role" => $data['role'],
            ":status" => $data['status']
        ]);
    }

    public function update($data)
    {
        $query = "UPDATE {$this->table}
              SET full_name = :full_name,
                  email = :email,
                  role = :role,
                  status = :status,
                  updated_at = NOW()
              WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        return $stmt->execute([
            ":id" => $data['id'],
            ":full_name" => $data['full_name'],
            ":email" => $data['email'],
            ":role" => $data['role'],
            ":status" => $data['status']
        ]);
    }

    public function delete($id)
    {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([":id" => $id]);
    }
}
