import { PAB_UPLOADER as uploader } from './upload-plugin.js';

$(function () {
    $(".choose-file-btn").click(function (e) {
        e.preventDefault();
        $("#filechooser").click()
    })

    // const uploader = PAB_UPLOADER;
    
    uploader.init({
        fileInputElement: '#filechooser',
        fileContainer: '.images-big-container',
        maxFilesize: 10000000, // ALLOWED MAX FILE SIZE
        maxFileUpload: 5, // MAX FILE UPLOAD
        minFileUpload: 3, // MINIMUM FILE UPLOAD
        fileTypes: ['image/*', 'audio/*'],
    })



    $("#file-upload-form").submit(function (e) {
        e.preventDefault();
        var formdata = uploader.getFiles(this);

        if (formdata == false) { return }

        $.ajax({
            url: 'upload-handler.php',
            data: formdata,
            method: 'POST',
            processData: false,
            contentType: false
        }).done(function (response) {
            var data = JSON.parse(response);
            $(".uploaded-imgs-container").empty();
            uploader.reset();
            for (let d = 0; d < data.data.length; d++) {
                const file = data.data[d];
                var fileContainer = document.createElement('div');
                fileContainer.className = 'col-2'
                
                if (file.type.split('/')[0] == 'image') {
                    fileContainer.innerHTML = `
                        <img src="uploads/${file.name}" class="testxt" style="width: 100%;" alt="img">
                    `
                    
                }else{
                    fileContainer.innerHTML = `
                        <div class="bg-secondary">${file.type}</div>
                    `
                }
    
                $(".uploaded-imgs-container").append(fileContainer);
                
            }

        })
    })


})