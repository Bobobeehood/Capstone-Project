const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'bobobee',
    api_key: '945532834286984',
    api_secret: 'A6yxru6hQ0LbRkgsWA5suOe8GGo'
});

exports.uploads = (file) => new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
        file,
        { folder: 'teamwork uploads' },
        (error, result) => {
            if (error) {
                throw new Error(error);
            }
            resolve({ url: result.url, id: result.public_id });
        }
    );
});

exports.delete = (publicId) => new Promise((resolve, reject) => {
    cloudinary.v2.uploader.destroy(
        publicId,
        (error, result) => {
            if (error) {
                throw new Error(error);
            }
            resolve(result);
        }
    );
});
