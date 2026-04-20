<?php

class Database
{
    private $host = "localhost";
    private $db_name = "onecapit_onecapitaldb";  // onecapitaldb
    private $username = "onecapit_onecapitaluser";  // root
    private $password = "@xwd)9[406u#wx,u";   // @xwd)9[406u#wx,u
    private $conn = null;

    public function connect()
    {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password
            );

            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Database connection failed",
                "error" => $e->getMessage()
            ]);
            exit;
        }

        return $this->conn;
    }
}