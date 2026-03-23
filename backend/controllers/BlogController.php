<?php

require_once __DIR__ . '/../models/Blog.php';

class BlogController
{
    /* =========================
       CREATE OR UPDATE BLOG
       (Frontend always sends FormData via POST;
        presence of 'id' field signals an update)
    ========================= */
    public function create()
    {
        try {
            $model = new Blog();

            $id       = $_POST['id']       ?? null;   // FIX: detect edit mode
            $title    = $_POST['title']    ?? '';
            $content  = $_POST['content']  ?? '';
            $excerpt  = $_POST['excerpt']  ?? '';
            $category = $_POST['category'] ?? '';
            $author   = $_POST['author']   ?? 'Admin';
            $status   = $_POST['status']   ?? 'Draft';

            if (!$title || !$content) {
                echo json_encode([
                    "success" => false,
                    "message" => "Title and content are required"
                ]);
                return;
            }

            $data = [
                "title"    => $title,
                "content"  => $content,
                "excerpt"  => $excerpt,
                "category" => $category,
                "author"   => $author,
                "status"   => $status,
            ];

            // ── FIX: if id present → UPDATE, otherwise → INSERT ──
            if ($id) {
                $data['id'] = $id;
                $model->update($data);
                $blogId = $id;
            } else {
                $blogId = $model->create($data);
            }

            // ── IMAGE UPLOAD ──
            // Only process image if a new one was uploaded
            if (!empty($_FILES['image']['name'])) {

                $uploadDir = __DIR__ . '/../uploads/blog_images/';

                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                $fileName = time() . "_" . basename($_FILES['image']['name']);
                $filePath = $uploadDir . $fileName;

                if (move_uploaded_file($_FILES['image']['tmp_name'], $filePath)) {
                    $relativePath = "uploads/blog_images/" . $fileName;

                    if ($id) {
                        // FIX: on edit, replace existing cover image instead of inserting new row
                        $model->updateImage($blogId, $relativePath);
                    } else {
                        $model->saveImage($blogId, $relativePath);
                    }
                }
            }

            echo json_encode([
                "success" => true,
                "message" => $id ? "Blog updated successfully" : "Blog created successfully"
            ]);

        } catch (Exception $e) {
            echo json_encode([
                "success" => false,
                "message" => $e->getMessage()
            ]);
        }
    }

    /* =========================
       GET ALL BLOGS
    ========================= */
    public function getAll()
    {
        $model = new Blog();
        $data  = $model->getAll();

        echo json_encode([
            "success" => true,
            "data"    => $data
        ]);
    }

    /* =========================
       DELETE BLOG
    ========================= */
    public function delete()
    {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            echo json_encode(["success" => false, "message" => "ID required"]);
            return;
        }

        $model = new Blog();
        $ok    = $model->delete($id);

        echo json_encode(["success" => $ok]);
    }

    /* =========================
       UPDATE BLOG (PUT — JSON)
       Kept for any direct PUT calls
    ========================= */
    public function update()
    {
        try {
            $input = json_decode(file_get_contents("php://input"), true);

            if (!$input || !isset($input['id'])) {
                echo json_encode([
                    "success" => false,
                    "message" => "Invalid input"
                ]);
                return;
            }

            $model = new Blog();
            $ok    = $model->update($input);

            echo json_encode(["success" => $ok]);

        } catch (Exception $e) {
            echo json_encode([
                "success" => false,
                "message" => $e->getMessage()
            ]);
        }
    }
}