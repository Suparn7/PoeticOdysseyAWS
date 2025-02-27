import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import '../../styles/loader.css';
import CancelButton from '../AddPostComponent/CancelButton';
import TitleInput from '../AddPostComponent/TitleInput';
import ContentInput from '../AddPostComponent/ContentInput';
import SearchInput from '../AddPostComponent/SearchInput';
import ImageGrid from '../AddPostComponent/ImageGrid';
import PaginationButtons from '../AddPostComponent/PaginationButtons';
import SelectedImage from '../AddPostComponent/SelectedImage';
import FileUpload from '../AddPostComponent/FileUpload';
import SubmitButton from '../AddPostComponent/SubmitButton';
import ConfirmCancel from '../AddPostComponent/ConfirmCancel';
import {
  submit,
  handleNextPage,
  handlePrevPage,
  selectImageFromSearch,
  selectImageFromPC,
  cancelSelectedImage,
  cancel,
  confirmCancel,
  handleKeyDown
} from '../../actions/addPostActions';

const AddPostComponent = ({ post }) => {
  const { register, handleSubmit, control, setValue, getValues } = useForm({
    defaultValues: {
      title: "",
      content: "",
      status: "active",
      image: null
    }
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false); // Modal for confirmation
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isImageSelectedFromPC, setIsImageSelectedFromPC] = useState(false); 
  const [isImageSelectedFromSearch, setIsImageSelectedFromSearch] = useState(false);
  const dispatch = useDispatch()

  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    const loadTimeout = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);
  
    if (post) {
      setValue("title", post.title);
      setValue("content", post.content);
      setValue("status", post.status || "active");
  
      if (post.featuredImage) {
        //const filePreview = appWriteService.getFilePreview(post.featuredImage);
        setSelectedImage(post.featuredImage);
        setIsImageSelectedFromPC(false);
        setIsImageSelectedFromSearch(false);
      }
    }
  
    return () => clearTimeout(loadTimeout);
  }, [post, setValue]);

  useEffect(() => {
    if (searchQuery.length > 2 && !isImageSelectedFromPC) {
      axios
        .get("https://api.pexels.com/v1/search", {
          params: { query: searchQuery, page, per_page: 3 },
          headers: {
            Authorization: "PPVYc9ltXDmzqkE0eLqnOd1QVIKRuzF0qoolxhBZsiirbc8OPRPgNbGo",
          },
        })
        .then((response) => {
          setImages(response.data.photos);
          setTotalPages(Math.ceil(response.data.total_results / 3));
        })
        .catch((error) => {
          console.error("Error fetching images from Pexels", error);
        });
    }
  }, [searchQuery, page, isImageSelectedFromPC]);

  if (initialLoading) {
    return (
      <div className="loader-overlay">
        <div className="loader-container animate__animated animate__fadeIn">
          <div className="loader"></div>
          {/* <h2 className="loading-text text-white animate__animated animate__fadeIn"></h2> */}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader-container animate__animated animate__fadeIn">
          <div className="loader"></div>
          {/* <h2 className="loading-text text-white animate__animated animate__fadeIn">Saving post...</h2> */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-fit relative">
      {
          showConfirm && (
              <ConfirmCancel confirmCancel={() => confirmCancel(setShowConfirm, post, navigate)} cancel={() => cancel(setShowConfirm)} />
          )
      }

      <form
        className="flex flex-col sm:flex-row justify-center items-center p-6 bg-gray-800 text-white rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 animate__animated animate__fadeIn"
        onSubmit={handleSubmit((data) => submit(data, userData, post, selectedImage, dispatch, navigate, setLoading))}
      >
        {/* Cancel Button at Top Right */}
        <CancelButton setShowConfirm={setShowConfirm} />

        <div className="w-full sm:w-2/3 px-4 mb-4 sm:mb-0">
          
          <TitleInput register={register} handleKeyDown={handleKeyDown} />
          <ContentInput control={control} getValues={getValues} />

        </div>

        <div className="w-full sm:w-1/3 px-4">
            {/* Search Input */}
            <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} isImageSelectedFromPC={isImageSelectedFromPC} handleKeyDown={handleKeyDown} />

            {/* Image Grid */}
            <ImageGrid images={images} selectImageFromSearch={(image) => selectImageFromSearch(image, setSelectedImage, setIsImageSelectedFromSearch, setIsImageSelectedFromPC, setImages)} />

            {/* Pagination Buttons */}
            {images.length > 0 && (
              <PaginationButtons page={page} totalPages={totalPages} handlePrevPage={() => handlePrevPage(page, setPage)} handleNextPage={() => handleNextPage(page, totalPages, setPage)}/>
            )}

            {/* Selected Image */}
            {selectedImage && (
                <SelectedImage selectedImage={selectedImage} cancelSelectedImage={() => cancelSelectedImage(setSelectedImage, setIsImageSelectedFromPC, setIsImageSelectedFromSearch)} />
            )}

            {/* File Upload */}
            {!isImageSelectedFromSearch && (
              <FileUpload selectImageFromPC={(file) => selectImageFromPC(file, setSelectedImage, setIsImageSelectedFromPC, setIsImageSelectedFromSearch)}/>
            )}

            {/* Status Select: TODO ADD ANY FILTER IF YOU WANT */}
            {/* <Select
            options={["active", "inactive"]}
            label="Status"
            className="mb-4 relative transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-60 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg p-2 shadow-lg shadow-blue-400/30 hover:shadow-xl hover:scale-110 cursor-pointer"
            {...register("status", { required: true })}
            onChange={(e) => e.target.value} 
           
            /> */}

            {/* Submit Button */}
            <SubmitButton post={post} />
          </div>
      </form>
    </div>

  );
};

export default AddPostComponent;