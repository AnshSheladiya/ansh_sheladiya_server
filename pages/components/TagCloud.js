import axiosInstance from '@/lib/axios';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {useMediaQuery, useTheme } from '@mui/material';

const Tag = ({ name, onClick }) => {
  return (
    <button
      className="px-3 py-2 text-lg text-gray-700 transition duration-200 ease-in-out bg-gray-200 rounded tag hover:bg-gray-300"
      onClick={() => onClick(name)}
    >
      {name}
    </button>
  );
};

const SmallTag = ({ name, onClick }) => {
  return (
    <button
      className="px-2 py-1 text-sm text-gray-700 transition duration-200 ease-in-out bg-gray-200 rounded tag hover:bg-gray-300"
      onClick={() => onClick(name)}
    >
      {name}
    </button>
  );
};

const TagCloud = ({ onTagSelect }) => {
  const [tags, setTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [activeType, setActiveType] = useState("Wallpapers");
  const [showAll, setShowAll] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Define when it's considered "mobile"
  const isWeb = useMediaQuery(theme.breakpoints.up('md'));

  const tagsCounts=isMobile?10:20;
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/categories');
        setTags(response.data.categories);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    if (activeType === "All") {
      setFilteredTags(tags);
    } else {
      const filtered = tags.filter(tag => tag.type === activeType);
      setFilteredTags(filtered);
    }
  }, [activeType, tags]);

  const handleTagSelect = (tag) => {
    onTagSelect(tag);
  };

  const handleTypeToggle = (type) => {
    setActiveType(type);
  };

  const handleShowAll = () => {
    setShowAll(true);
  };

  return (
    <div>
      <h2 className="flex flex-row items-center mt-5 flex-nowrap">
        <span className="flex-grow block border-t border-black"></span>
        <span className="flex-none block mx-4 px-4 py-2.5 text-md rounded leading-none font-medium bg-black text-white">
          Genres
        </span>
        <span className="flex-grow block border-t border-black"></span>
      </h2>

      <div className='flex flex-col my-10'>
        <div className="flex flex-wrap justify-center gap-2 p-4 mx-auto my-1 tag-cloud">
          {/* <button
            className={`px-3 py-2 text-lg rounded hover:bg-gray-300 ${activeType === "All" ? 'bg-gray-300' : 'bg-gray-200'}`}
            onClick={() => handleTypeToggle("All")}
          >
            All
          </button> */}
          <button
  className={`px-4 py-2 text-lg font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300 ease-in-out ${activeType === "Wallpapers" ? 'bg-blue-500 text-white' : 'bg-blue-200 text-blue-600'}`}
  onClick={() => handleTypeToggle("Wallpapers")}
>
  Wallpapers
</button>
<button
  className={`px-4 py-2 text-lg font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-green-500 hover:text-white transition-colors duration-300 ease-in-out ${activeType === "Background" ? 'bg-green-500 text-white' : 'bg-green-200 text-green-600'}`}
  onClick={() => handleTypeToggle("Background")}
>
  Background
</button>
<button
  className={`px-4 py-2 text-lg font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-purple-500 hover:text-white transition-colors duration-300 ease-in-out ${activeType === "Pictures" ? 'bg-purple-500 text-white' : 'bg-purple-200 text-purple-600'}`}
  onClick={() => handleTypeToggle("Pictures")}
>
  Pictures
</button>

        </div>

        <div className='flex flex-wrap justify-center gap-2'>
          {showAll
            ? filteredTags.map((tag, index) => (
                <SmallTag key={index} name={tag.title} onClick={() => handleTagSelect(tag.url)} />
              ))
            : filteredTags.slice(0, tagsCounts).map((tag, index) => (
                <SmallTag key={index} name={tag.title} onClick={() => handleTagSelect(tag.url)} />
              ))}
        </div>

        {!showAll && filteredTags.length > tagsCounts && (
          <div className="flex justify-center mt-4">
          <button
  className="px-2 py-1 text-sm transition duration-200 ease-in-out bg-blue-200 rounded-md hover:bg-blue-300"
  onClick={handleShowAll}
>
  See All
</button>

          </div>
        )}
      </div>
    </div>
  );
};

export default TagCloud;
