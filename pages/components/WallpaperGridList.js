import React from "react";
import Masonry from "react-responsive-masonry";
import { FaEye, FaDownload } from "react-icons/fa";
import { saveAs } from "file-saver"; // Import saveAs from file-saver
import { useMediaQuery, useTheme } from "@mui/material";

const WallpaperGridList = ({ wallpapers }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Define when it's considered "mobile"
  const isWeb = useMediaQuery(theme.breakpoints.up("md"));

  const handleEyeButtonClick = (imageUrl) => {
    // Open the image in a new tab
    window.open(imageUrl, "_blank");
  };

  const handleDownloadButtonClick = async (imageUrl) => {
    try {
      // Fetch the image using the image proxy API
      const response = await fetch("/api/image-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: imageUrl }),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const blob = await response.blob();

      // Save the image using file-saver
      const timestamp = new Date().getTime(); // Get current timestamp
      const filename = `wallpaper_${timestamp}.jpg`; // Construct unique filename
      saveAs(blob, filename);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="px-4 mx-auto max-w-7xl">
      <Masonry columnsCount={isMobile ? 2 : 4} gutter="10px">
        {wallpapers.map((wallpaper, index) => (
          <div key={index} className="masonry-item">
            <div className="relative aspect-w-1 aspect-h-1">
              <img
                src={wallpaper.imageUrl}
                className="object-cover w-full h-full transition duration-300 transform rounded-md shadow-lg hover:scale-105"
                alt=""
              />
              <div className="absolute top-0 right-0 flex flex-col m-2">
                <button
                  className="p-1 mb-1 text-white rounded-full hover:bg-gray-700"
                  onClick={() => handleEyeButtonClick(wallpaper.imageUrl)}
                >
                  <FaEye className={`${isMobile?'text-sm':'text-xs'}`} />{" "}
                  {/* Add text-sm class to make the icon smaller */}
                </button>
                <button
                  className="p-1 text-white rounded-full hover:bg-gray-700"
                  onClick={() => handleDownloadButtonClick(wallpaper.imageUrl)}
                >
                  <FaDownload className={`${isMobile?'text-sm':'text-xs'}`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default WallpaperGridList;
