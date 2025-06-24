import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import BackButton from './BackButton';

const CreateEventBanner = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateImage = (file) => {
    return new Promise((resolve, reject) => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        reject('Invalid file type. Please upload JPG, PNG, or GIF.');
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        if (img.width < 1170 || img.height < 504) {
          reject('Image dimensions must be at least 1170x504 pixels.');
          return;
        }
        resolve(true);
      };
      img.onerror = () => reject('Failed to load image.');
    });
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setError('');
    
    try {
      await validateImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    multiple: false
  });

  const handleSubmit = () => {
    if (!image) {
      setError('Please upload an event banner image.');
      return;
    }
    setIsSubmitting(true);

    try {
      const eventData = JSON.parse(localStorage.getItem('tempEventData'));
      eventData.bannerImage = image;
      localStorage.setItem('tempEventData', JSON.stringify(eventData));
      navigate('/create-event/ticket');
    } catch (err) {
      setError('Failed to save banner image. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/create-event/edit');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <BackButton />

      {/* Progress Bar */}
      <div className="flex items-center w-full max-w-5xl mx-auto mt-5">
        <div className="flex-1">
          <div className="flex-1 flex items-center">
            <div className="flex-1 flex items-center">
              <div className="w-full h-1 bg-gray-300"></div>
              <div className="w-6 h-6 bg-white border-2 border-gray-800 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="w-full h-1 bg-gray-300"></div>
              <div className="w-6 h-6 bg-white border-2 border-gray-800 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="w-full h-1 bg-gray-300"></div>
              <div className="w-6 h-6 bg-white border-2 border-gray-800 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="w-full h-1 bg-gray-600"></div>
              <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-between mt-2">
            <span className="text-gray-400 font-semibold">Edit</span>
            <span className="text-gray-400">Banner</span>
            <span className="text-yellow-400">Ticketing</span>
            <span className="text-gray-400">Review</span>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <h2 className="text-2xl font-semibold text-amber-400 text-left ml-20 mt-5">Upload Event Banner</h2>
      
      {/* Image Preview */}
      {image ? (
        <div className="mt-8 max-w-3xl mx-auto">
          <div className="aspect-[1170/504] w-full rounded-lg overflow-hidden border-2 border-yellow-400/30">
            <img
              src={image}
              alt="Event Banner Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button 
            onClick={() => setImage(null)}
            className="mt-4 text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            Remove Image
          </button>
        </div>
      ) : (
        <div 
          {...getRootProps()} 
          className={`mt-8 max-w-3xl mx-auto p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all
            ${isDragActive ? 'border-yellow-400 bg-yellow-400/5' : 'border-gray-600 hover:border-yellow-400/50'}`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <svg
              className={`mx-auto h-12 w-12 ${isDragActive ? 'text-yellow-400' : 'text-gray-400'}`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              />
            </svg>
            <p className="mt-4 text-sm text-gray-400">
              {isDragActive ? (
                'Drop the image here'
              ) : (
                'Drag and drop your event banner here, or click to select'
              )}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Image must be at least 1170×504 pixels (JPG, PNG, or GIF)
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 max-w-3xl mx-auto text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}

      {/* Buttons Section */}
      <div className="flex justify-end items-center mt-8 gap-4 max-w-3xl mx-auto">
        <button 
          onClick={handleBack}
          className="px-6 py-2 text-white bg-gray-700 rounded-xl font-medium hover:bg-gray-600 transition-all"
        >
          Back
        </button>
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting || !image}
          className={`px-6 py-2 rounded-xl font-medium transition-all ${isSubmitting || !image ? 
            'bg-yellow-400/50 text-gray-700 cursor-not-allowed' : 
            'bg-yellow-400 text-gray-900 hover:bg-yellow-500'}`}
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default CreateEventBanner;