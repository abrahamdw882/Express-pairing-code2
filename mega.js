import * as mega from 'megajs';

const auth = {
    email: 'joygloria390276@gmail.com',
    password: '#joygloria1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
};

const upload = (data, name) => {
    return new Promise((resolve, reject) => {
        const storage = new mega.Storage(auth);
        storage.on('error', (err) => {
            console.error('Storage error:', err);
            reject(err);
        });
        storage.on('ready', () => {
            try {
                const uploadFile = storage.upload({ name, allowUploadBuffering: true });

                uploadFile.on('error', (err) => {
                    console.error('Upload error:', err);
                    storage.close();
                    reject(err);
                });

                uploadFile.on('complete', (file) => {
                    file.link((err, url) => {
                        if (err) {
                            console.error('Link generation error:', err);
                            storage.close();
                            reject(err);
                        } else {
                            console.log('File uploaded successfully:', url);
                            storage.close();
                            resolve(url);
                        }
                    });
                });
                if (data && data.pipe) {
                    data.pipe(uploadFile);
                } else {
                    uploadFile.end(data); 
                }
            } catch (err) {
                console.error('Unexpected error:', err);
                storage.close();
                reject(err);
            }
        });
    });
};

export { upload };
