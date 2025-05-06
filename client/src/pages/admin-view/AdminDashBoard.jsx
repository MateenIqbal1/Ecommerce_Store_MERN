import ProductImageUpload from '@/components/admin-view/ProductImageUpload';
import { Button } from '@/components/ui/button';
import { addFeatureImage, getFeatureImages } from '@/store/CommonSlice';
import { Hand } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const AdminDashBoard = () => {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch=useDispatch()
  const {featureImageList} =useSelector(state=>state.commonFeature)
  console.log(uploadedImageUrl,'uploaded image url');
  
   function handleUploadFeatureImage(){
    dispatch(addFeatureImage(uploadedImageUrl)).then(data=>{
      if(data?.payload?.success){
        dispatch(getFeatureImages())
      }
    })
   }

   useEffect(()=>{
    dispatch(getFeatureImages())
   },[dispatch])
   console.log(featureImageList,'this is feature images list ');
  return (
    <div>
      <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isCustomStyling={true}
            // currentEditedId={currentEditedId}
            // isEditMode={currentEditedId !== null}

          />
<Button onClick={handleUploadFeatureImage} className="mt-5 w-full bg-gray-900 text-white hover:bg-red-600 transition-all duration-300">
  Upload
</Button>
    </div>
  )
}

export default AdminDashBoard