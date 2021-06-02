
export const PAB_UPLOADER = {
    tmpFileBucket: {}, // FILE HOLDER BUCKET
    maxFilesize: -1, // ALLOWED MAX FILE SIZE
    maxFileUpload: -1, // MAX FILE UPLOAD
    minFileUpload: -1, // MINIMUM FILE UPLOAD
    uploadedFilesCounter: 0, // FILE COUNTER
    fileContainer: '', // FILE CONTAINER
    fileTypes: [],

    init: (argz) => {
        PAB_UPLOADER.fileContainer = argz.fileContainer
        PAB_UPLOADER.maxFilesize = argz.maxFilesize
        PAB_UPLOADER.maxFileUpload = argz.maxFileUpload
        PAB_UPLOADER.minFileUpload = argz.minFileUpload
        PAB_UPLOADER.fileTypes = argz.fileTypes

        console.info('PAB_UPLOADER: congrats, uploader has been initialized!')

        $(argz.fileInputElement).change(function (e) {
            if (e.target.files) {
                const rawFiles = e.target.files
                for (let i = 0; i < rawFiles.length; i++) {
                    const rawFile = rawFiles[i];
                    if (!PAB_UPLOADER.fileTypes.includes(rawFile.type.split('/')[0] + '/*')) {
                        console.log('File: ', rawFile.name, ' is file type is not allowed, allowed \
                         file types are ', PAB_UPLOADER.fileTypes.join(", "));
                        continue;
                    }
                    if (rawFile.size > PAB_UPLOADER.maxFilesize) {
                        console.log('File: ', rawFile.name, ' is too large, max file size is ', PAB_UPLOADER.maxFilesize);
                        continue;
                    }

                    if (PAB_UPLOADER.uploadedFilesCounter > PAB_UPLOADER.maxFileUpload - 1) {
                        alert('You are only allowed to upload ' + PAB_UPLOADER.maxFileUpload + ' files')
                        return;
                    }

                    PAB_UPLOADER.uploadedFilesCounter += 1;

                    var fileReader = new FileReader();
                    fileReader.onload = function (event) {
                        var file = event.target.result;
    
                        var fileID = rawFile.name.replaceAll(".", "").replaceAll("-", "_")
                        var fileContainer = document.createElement('div');
                        fileContainer.className = 'col-2 img-container mb-5'
                        fileContainer.id = fileID
                        
                        if (rawFile.type.split('/')[0] == 'image') {
                            fileContainer.innerHTML = `
                                <div class="rm-btn"><span>X</span></div>
                                <img src="${file}" class="testxt" style="width: 100%;" alt="img">
                            `
                            
                        }else{
                            fileContainer.innerHTML = `
                                <div class="rm-btn"><span>X</span></div>
                                <div class="bg-secondary">${rawFile.type}</div>
                            `
                        }
    
                        $(PAB_UPLOADER.fileContainer).append(fileContainer);
                        PAB_UPLOADER.tmpFileBucket[fileID] = rawFile;
                        PAB_UPLOADER.deleteFileFromBucket();
                        
                    }
    
                    fileReader.readAsDataURL(rawFile);
    
                    
                }
                
            }
        })

    },



    deleteFileFromBucket: () => {
        var removeBtns = document.getElementsByClassName("rm-btn")
        for (let i = 0; i < removeBtns.length; i++) {
            const rmBtn = removeBtns[i];
            if (rmBtn.classList.contains('rm-evt-added')) {
                continue;
            }
            rmBtn.classList.add('rm-evt-added')
            $(rmBtn).click(function (e) {
                e.stopPropagation();
                console.log("hey i was clicked!");
                var fileID = this.parentElement.id
                delete PAB_UPLOADER.tmpFileBucket[fileID];
                PAB_UPLOADER.uploadedFilesCounter -= 1;
                $(this.parentElement).remove();
            })
            
        }
    },

    getFiles: (form) => {
        var formdata = new FormData(form);
        for (const key in PAB_UPLOADER.tmpFileBucket) {
            if (Object.hasOwnProperty.call(PAB_UPLOADER.tmpFileBucket, key)) {
                const file = PAB_UPLOADER.tmpFileBucket[key];
                formdata.append('files[]', file);
            }
        }

        if (PAB_UPLOADER.uploadedFilesCounter < PAB_UPLOADER.minFileUpload) {
            alert("please upload up to " + PAB_UPLOADER.minFileUpload + ' files');
            return false;
        }else{
            return formdata;
        }


    },

    reset: () => {
        PAB_UPLOADER.uploadedFilesCounter = 0;
        $(PAB_UPLOADER.fileContainer).empty()
        PAB_UPLOADER.tmpFileBucket = {}
    }
}

