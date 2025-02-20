const fm = FileManager.iCloud();
const lastUploadFile = fm.joinPath(fm.documentsDirectory(), "last_upload.txt");

// 📌 Load the last upload timestamp
let lastUploadTime = 0;
if (fm.fileExists(lastUploadFile)) {
    let savedTime = fm.readString(lastUploadFile);
    lastUploadTime = parseInt(savedTime) || 0;
}

// 📸 Get all photos from the camera roll
const allPhotos = await Photos.allAssets();
let newPhotos = [];

// 🕒 Filter only new photos
for (let photo of allPhotos) {
    let creationDate = photo.creationDate.getTime();
    if (creationDate > lastUploadTime) {
        newPhotos.push(photo);
    }
}

// 📝 Save the latest timestamp (if new photos were found)
if (newPhotos.length > 0) {
    let latestPhotoTime = Math.max(...newPhotos.map(p => p.creationDate.getTime()));
    fm.writeString(lastUploadFile, latestPhotoTime.toString());
}

// 🖼️ Output results
console.log(`Found ${newPhotos.length} new photos.`);
if (newPhotos.length > 0) {
    console.log("New photos detected!");
} else {
    console.log("No new photos to upload.");
}

// ✅ Return new photos for the next step (uploading)
return newPhotos;