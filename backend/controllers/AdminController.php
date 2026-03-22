<?php

require_once __DIR__ . '/../models/Admin.php';

class AdminController
{
    public function login()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['login']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Login and password are required"
            ]);
            return;
        }

        $adminModel = new Admin();
        $admin = $adminModel->findByUsernameOrEmail($data['login']);

        if (!$admin) {
            echo json_encode([
                "success" => false,
                "message" => "Invalid credentials"
            ]);
            return;
        }

        if (!password_verify($data['password'], $admin['password_hash'])) {
            echo json_encode([
                "success" => false,
                "message" => "Invalid credentials"
            ]);
            return;
        }

        unset($admin['password_hash']);

        echo json_encode([
            "success" => true,
            "admin" => $admin
        ]);
    }


    public function getProfile()
    {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            echo json_encode(["success" => false, "message" => "ID required"]);
            return;
        }

        $adminModel = new Admin();
        $admin = $adminModel->getById($id);

        echo json_encode([
            "success" => true,
            "admin" => $admin
        ]);
    }

    public function updateProfile()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        $adminModel = new Admin();

        if ($adminModel->updateProfile($data)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Update failed"]);
        }
    }

    public function changePassword()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        $adminModel = new Admin();

        if (!$adminModel->verifyPassword($data['id'], $data['old_password'])) {
            echo json_encode([
                "success" => false,
                "message" => "Current password is incorrect"
            ]);
            return;
        }

        if ($adminModel->changePassword($data['id'], $data['new_password'])) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Password update failed"]);
        }
    }


    public function getAllAdmins()
    {
        $adminModel = new Admin();
        $admins = $adminModel->getAll();

        echo json_encode([
            "success" => true,
            "admins" => $admins
        ]);
    }

    public function createAdmin()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        // ROLE CHECK
        if ($data['current_role'] !== 'super_admin') {
            echo json_encode([
                "success" => false,
                "message" => "Only super admin can create admins"
            ]);
            return;
        }

        $adminModel = new Admin();

        if ($adminModel->create($data)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }
    }

    public function updateAdmin()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        $adminModel = new Admin();

        if ($adminModel->update($data)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }
    }

    public function deleteAdmin()
    {
        $id = $_GET['id'] ?? null;
        $role = $_GET['role'] ?? null;

        if ($role !== 'super_admin') {
            echo json_encode([
                "success" => false,
                "message" => "Only super admin can delete"
            ]);
            return;
        }

        $adminModel = new Admin();

        if ($adminModel->delete($id)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }
    }

    
}
