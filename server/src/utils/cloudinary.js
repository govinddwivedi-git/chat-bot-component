import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        
        // Check if environment variables are set
        if (!process.env.CLOUDINARY_API_KEY) {
            console.error("Cloudinary API key is not set in environment variables");
            return null;
        }
        
        console.log(localFilePath);
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        return response;

    } catch (error) {
        console.error("Cloudinary upload error:", error.message);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        }
        return null;
    }
}

// New function for base64 uploads (for Vercel)
const uploadBase64ToCloudinary = async (base64Data, options = {}) => {
    try {
        if (!base64Data) return null;
        
        if (!process.env.CLOUDINARY_API_KEY) {
            console.error("Cloudinary API key is not set in environment variables");
            return null;
        }
        
        console.log("Uploading base64 data to cloudinary");
        const response = await cloudinary.uploader.upload(base64Data, {
            resource_type: "auto",
            ...options
        });
        
        console.log("Base64 file uploaded to cloudinary:", response.url);
        return response;
    } catch (error) {
        console.error("Cloudinary base64 upload error:", error.message);
        return null;
    }
}

export {uploadOnCloudinary, uploadBase64ToCloudinary}