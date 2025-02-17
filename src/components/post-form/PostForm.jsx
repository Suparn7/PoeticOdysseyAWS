import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../Button';
import Input from '../Input';
import RTE from '../RTE';
import Select from '../Select';
import appWriteService from '../../appwrite/config';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { ID } from 'appwrite';
import axios from 'axios';
import '../../styles/loader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faUpload, faSearch, faCheckCircle, faFeather, faPaperPlane, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import userService from '../../appwrite/userService';
import awsS3Service from '../../aws/awsS3Service';
import dynamoService from '../../aws/dynamoService';
import dynamoUserInformationService from '../../aws/dynamoUserInformationService';
import { setUserData } from '../../store/userSlice';
import { addPost, updatePost, deletePost } from '../../store/postSlice';
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

const PostForm = ({ post }) => {
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

  const submit = async (data) => {
    setLoading(true);
    const slug = ID.unique();

    try {
        let uploadedUrl = "";
        const timestamp = Date.now(); // Get the current timestamp
        if (data.image?.[0]) {
          const file = data.image[0];
          
          // Generate a unique filename using email, original file name, and current timestamp
          
          const fileName = `blog-pics/${userData.email}-${timestamp}-${file.name}`;
          
          const fileBody = file;
          const contentType = file.type;
      
          // Upload to S3 using dynamoService
          uploadedUrl = await awsS3Service.uploadFileToS3({
              bucketName: "poetic-odyssey-images", // S3 bucket name
              fileName,
              fileBody,
              contentType,
          });
      
          
        }
      

        if (!data.image && selectedImage) {
          if (selectedImage.startsWith("blob:") || selectedImage.startsWith("data:image")) {
              const blob = await fetch(selectedImage).then((res) => res.blob());
              const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
              const fileName = `blog-pics/${userData.email}-${timestamp}-${file.name}`;
              const fileBody = file;
              const contentType = file.type;

               // Upload to S3 using dynamoService
              uploadedUrl = await awsS3Service.uploadFileToS3({
                bucketName: "poetic-odyssey-images", // S3 bucket name
                fileName,
                fileBody,
                contentType,
              });

          } else if (selectedImage.startsWith("http")) {
            const response = await axios.get(selectedImage, { responseType: 'arraybuffer' });
            const fileBlob = new Blob([response.data], { type: 'image/jpeg' });
            const file = new File([fileBlob], 'image.jpg', { type: 'image/jpeg' });

            const fileName = `blog-pics/${userData.email}-${timestamp}-${file.name}`;
            const fileBody = file;
            const contentType = file.type;

              // Upload to S3 using dynamoService
            uploadedUrl = await awsS3Service.uploadFileToS3({
              bucketName: "poetic-odyssey-images", // S3 bucket name
              fileName,
              fileBody,
              contentType,
            });
          } else {
              throw new Error("Invalid selected image URL.");
          }
        }

        if (post && post.featuredImage) {
          const key = post.featuredImage.split('.com/')[1]; // Extract the S3 key
          await awsS3Service.deleteFileFromS3({
              bucketName: "poetic-odyssey-images", // S3 bucket name
              fileName: key // Use the extracted key
          });
        }
      
        let dbPost;
        if(post){
          dbPost = await dynamoService.updatePost(post.blogId, {
            ...data,
            slug,
            featuredImage: uploadedUrl ? uploadedUrl : undefined,
          })

          // Dispatch updatePost to update local state
          dispatch(updatePost({ 
            postId: dbPost.blogId, 
            updatedData: { 
                ...data,
                slug,
                featuredImage: uploadedUrl ? uploadedUrl : undefined,
            }
          }));
        }else{
          dbPost = await dynamoService.createPost({
            ...data,
            slug,
            userId: userData.userId,
            featuredImage: uploadedUrl ? uploadedUrl : undefined,
            author : userData.name
          });
          await dynamoUserInformationService.addPostCreated(dbPost.userId, dbPost.blogId)
          dispatch(addPost(dbPost)); // Add the newly created post to the store

          const postsCreated = [...new Set([...(userData.postsCreated || []), dbPost.blogId])];
          dispatch(setUserData({postsCreated: postsCreated}));
        }

        if (dbPost) {
            navigate(`/PoeticOdyssey/post/${dbPost.blogId}`);
        }
        
    } catch (error) {
        console.error("Error while saving post:", error);
    } finally {
        setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const selectImageFromSearch = (image) => {
    setSelectedImage(image.src.original);
    setIsImageSelectedFromSearch(true);
    setIsImageSelectedFromPC(false);
    setImages([]);
  };

  const selectImageFromPC = (file) => {
    setSelectedImage(URL.createObjectURL(file));
    setIsImageSelectedFromPC(true);
    setIsImageSelectedFromSearch(false);
  };

  const cancelSelectedImage = () => {
    setSelectedImage(null);
    setIsImageSelectedFromPC(false);
    setIsImageSelectedFromSearch(false);
  };

  const cancel = () => {
    setShowConfirm(false);
  };

  const confirmCancel = () => {
    setShowConfirm(false);
    // Optionally add logic to discard changes or reset the form if needed
    if(post){
      navigate(`/PoeticOdyssey/post/${post.$id}`);
    }else{
      navigate('/PoeticOdyssey')
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

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
    <div className="min-h-screen relative">
      {
          showConfirm && (
              <ConfirmCancel confirmCancel={confirmCancel} cancel={cancel} />
          )
      }

      <form
        className="flex flex-col sm:flex-row justify-center items-center p-6 bg-gray-800 text-white rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 animate__animated animate__fadeIn"
        onSubmit={handleSubmit(submit)}
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
            <ImageGrid images={images} selectImageFromSearch={selectImageFromSearch} />

            {/* Pagination Buttons */}
            {images.length > 0 && (
              <PaginationButtons page={page} totalPages={totalPages} handlePrevPage={handlePrevPage} handleNextPage={handleNextPage}/>
            )}

            {/* Selected Image */}
            {selectedImage && (
                <SelectedImage selectedImage={selectedImage} cancelSelectedImage={cancelSelectedImage} />
            )}

            {/* File Upload */}
            {!isImageSelectedFromSearch && (
              <FileUpload selectImageFromPC={selectImageFromPC}/>
            )}

            {/* Status Select */}
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

export default PostForm;
