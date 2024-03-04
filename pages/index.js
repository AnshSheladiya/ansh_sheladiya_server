import React, { useState, useEffect } from "react";
import WallpaperGridList from "./components/WallpaperGridList";
import axiosInstance from "@/lib/axios";
import Topbar from "./components/Topbar";
import { BeatLoader } from "react-spinners";
import Pagination from "./components/Pagination";
import TagCloud from "./components/TagCloud";

const Home = () => {
  const [allWallpapers, setAllWallpapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTag, setSelectedTag] = useState('');
  const pageSize = 20; // Items per page

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .post(`/api/v1/wallpapers?pageNumber=${currentPage}&pageSize=${pageSize}&category=${selectedTag}`)
      .then((response) => {
        setAllWallpapers(response.data.wallpapers);
        setTotalPages(response.data.meta.total_pages);
        setLoading(false);
        console.log('totalpages---',response.data.meta.totalPages)
      })
      .catch((error) => {
        console.error("Error fetching all wallpapers:", error);
        setLoading(false);
      });
  }, [currentPage, pageSize,selectedTag]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setCurrentPage(1); // Reset current page when a new tag is selected
  };

  const handleHomeButtonClick = () => {
    setSelectedTag('');
    setCurrentPage(1);
  };

  return (
    <div>
      <Topbar />
      <TagCloud onTagSelect={handleTagSelect} onHomeButtonClick={handleHomeButtonClick} />
      {loading ? (
        <div className="flex items-center justify-center my-72">
          <BeatLoader />
        </div>
      ) : allWallpapers.length ? (
        <WallpaperGridList wallpapers={allWallpapers} />
      ) : (
        <div className="flex items-center justify-center my-72">
          <h2 className="text-2xl font-semibold text-gray-600">No wallpapers found.</h2>
        </div>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Home;
