import cloudinary from "../utils/cloudinary.js"
export const uploadToCloudinary = (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw",
                folder: "hostel-allocation",
                public_id: `${Date.now()}_${fileName}`,
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        );

        stream.end(fileBuffer);
    });
};