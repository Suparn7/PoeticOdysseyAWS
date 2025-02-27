import axios from 'axios';
import { v4 as uuidv4 } from "uuid";
import awsS3Service from '../aws/awsS3Service';
import dynamoService from '../aws/dynamoService';
import { setUserData } from '../store/userSlice';
import { addPost, updatePost } from '../store/postSlice';
import dynamoUserInformationService from '../aws/dynamoUserInformationService';

export const submit = async (data, userData, post, selectedImage, dispatch, navigate, setLoading) => {
    setLoading(true);
    const slug = uuidv4(); // Generate a unique slug for the post

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
      

        if (!data.image && selectedImage && selectedImage !== post?.featuredImage) {
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

export const handleNextPage = (page, totalPages, setPage) => {
    if (page < totalPages) {
      setPage(page + 1);
    }
};

export const handlePrevPage = (page, setPage) => {
    if (page > 1) {
      setPage(page - 1);
    }
};

export const selectImageFromSearch = (image, setSelectedImage, setIsImageSelectedFromSearch, setIsImageSelectedFromPC, setImages) => {
    setSelectedImage(image.src.original);
    setIsImageSelectedFromSearch(true);
    setIsImageSelectedFromPC(false);
    setImages([]);
};

export const selectImageFromPC = (file, setSelectedImage, setIsImageSelectedFromPC, setIsImageSelectedFromSearch) => {
    setSelectedImage(URL.createObjectURL(file));
    setIsImageSelectedFromPC(true);
    setIsImageSelectedFromSearch(false);
};

export const cancelSelectedImage = (setSelectedImage, setIsImageSelectedFromPC, setIsImageSelectedFromSearch) => {
    setSelectedImage(null);
    setIsImageSelectedFromPC(false);
    setIsImageSelectedFromSearch(false);
};

export const cancel = (setShowConfirm) => {
    setShowConfirm(false);
};

export const confirmCancel = (setShowConfirm, post, navigate) => {
    setShowConfirm(false);
    // Optionally add logic to discard changes or reset the form if needed
    if(post){
      navigate(`/PoeticOdyssey/post/${post.blogId}`);
    }else{
      navigate('/PoeticOdyssey')
    }
};

export const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
};