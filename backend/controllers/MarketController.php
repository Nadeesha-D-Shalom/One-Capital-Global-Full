<?php

require_once __DIR__ . '/../models/Market.php';

class MarketController
{
    public function getAll()
    {
        $model = new Market();
        $data = $model->getAll();

        echo json_encode([
            "success" => true,
            "data" => $data
        ]);
    }

    public function create()
    {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!$input) {
            echo json_encode([
                "success" => false,
                "message" => "Invalid input"
            ]);
            return;
        }

        $model = new Market();
        $ok = $model->create($input);

        echo json_encode([
            "success" => $ok,
            "message" => $ok ? "Market item created successfully" : "Database insert failed"
        ]);
    }

    public function update()
    {
        $input = json_decode(file_get_contents("php://input"), true);

        if (!$input || empty($input['id'])) {
            echo json_encode([
                "success" => false,
                "message" => "Invalid update input"
            ]);
            return;
        }

        $model = new Market();
        $ok = $model->update($input);

        echo json_encode([
            "success" => $ok,
            "message" => $ok ? "Market item updated successfully" : "Database update failed"
        ]);
    }

    public function delete()
    {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            echo json_encode([
                "success" => false,
                "message" => "ID is required"
            ]);
            return;
        }

        $model = new Market();
        $ok = $model->delete($id);

        echo json_encode([
            "success" => $ok,
            "message" => $ok ? "Market item deleted successfully" : "Database delete failed"
        ]);
    }
}