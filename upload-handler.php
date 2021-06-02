<?php

$fileUploaded = $_FILES["files"];

for ($i=0; $i < count($fileUploaded['name']); $i++) { 
    $fileName = $fileUploaded['name'][$i];
    $tmp_name  = $fileUploaded['tmp_name'][$i];

    $splitFileName = explode(".", $fileName);
    $uniqueName = uniqid($splitFileName[0]) . "." . end($splitFileName);
    $uploadLoc = 'uploads/' . $uniqueName;
    move_uploaded_file($tmp_name, $uploadLoc);
}

$fileArray = [];
foreach (scandir('uploads/') as $dirFile) {
    if (is_dir($dirFile)) {
        continue;
    }
    $mimeType = mime_content_type('uploads/' . $dirFile);
    $fileDir = ['name' => $dirFile, 'type' => $mimeType];
    array_push($fileArray, $fileDir);
}

echo json_encode(['data' => $fileArray]);

