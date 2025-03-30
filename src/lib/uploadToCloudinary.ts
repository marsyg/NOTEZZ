import cloudinary from "./cloudinary";

export async function uploadCloudinary(filename: string, filepath: string) {
  try {
    if (!filename) {
      throw new Error("Please specify a file name...");
    }

    if (!filepath) {
      throw new Error("Please enter required file...");
    }
    console.log({
      filename,
      filepath,
    });

    console.log("Uploading an image");
    const uploadResult = await cloudinary.uploader
      .upload(filepath, {
        resource_type: "auto",
        display_name: filename,
      })
      .catch((error) => {
        throw new Error("Failed to upload file ::",error.message);
      });

    if (!uploadResult) {
      throw new Error("No uploads found...");
    }
    console.log(uploadResult);

    return uploadResult;
  } catch (error : any) {
    console.log("Error ::", error.message)
  }
}