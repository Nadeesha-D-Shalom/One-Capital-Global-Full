<?php

require_once __DIR__ . '/../models/Message.php';

class MessageController
{
    public function getAll()
    {
        try {
            $model = new Message();
            $messages = $model->getAll();

            echo json_encode([
                "success" => true,
                "data" => $messages
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Failed to fetch messages",
                "error" => $e->getMessage()
            ]);
        }
    }

    public function create()
    {
        $raw = file_get_contents("php://input");
        $input = json_decode($raw, true);

        if (!is_array($input)) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Invalid input. Expected JSON body."
            ]);
            return;
        }

        if (empty(trim($input['full_name'] ?? ''))) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Full name is required"
            ]);
            return;
        }

        if (empty(trim($input['email'] ?? ''))) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Email is required"
            ]);
            return;
        }

        if (empty(trim($input['message'] ?? ''))) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Message is required"
            ]);
            return;
        }

        try {
            $model = new Message();

            $ok = $model->create([
                "full_name" => $input['full_name'] ?? '',
                "email"     => $input['email'] ?? '',
                "phone"     => $input['phone'] ?? '',
                "address"   => $input['address'] ?? '',
                "message"   => $input['message'] ?? ''
            ]);

            echo json_encode([
                "success" => $ok,
                "message" => $ok ? "Message sent successfully" : "Failed to save message"
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Server error",
                "error" => $e->getMessage()
            ]);
        }
    }

    public function markViewed()
    {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Message id is required"
            ]);
            return;
        }

        try {
            $model = new Message();
            echo json_encode([
                "success" => $model->markViewed($id)
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Failed to mark message as viewed",
                "error" => $e->getMessage()
            ]);
        }
    }

    public function moveToTrash()
    {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Message id is required"
            ]);
            return;
        }

        try {
            $model = new Message();
            echo json_encode([
                "success" => $model->moveToTrash($id)
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Failed to move message to trash",
                "error" => $e->getMessage()
            ]);
        }
    }

    public function restore()
    {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Message id is required"
            ]);
            return;
        }

        try {
            $model = new Message();
            echo json_encode([
                "success" => $model->restore($id)
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Failed to restore message",
                "error" => $e->getMessage()
            ]);
        }
    }

    public function deleteForever()
    {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Message id is required"
            ]);
            return;
        }

        try {
            $model = new Message();
            echo json_encode([
                "success" => $model->deleteForever($id)
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Failed to delete message permanently",
                "error" => $e->getMessage()
            ]);
        }
    }
}
