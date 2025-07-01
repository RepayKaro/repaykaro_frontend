import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { TrashIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Variants } from "framer-motion";

interface Screenshot {
  _id: string;
  screen_shot: string;
  isActive: boolean;
  createdAt: string;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

const UploadModal = ({
  isOpen,
  onClose,
  onUpload,
  isUploading,
}: UploadModalProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; screenshotId: string | null }>({
    isOpen: false,
    screenshotId: null
  });
  const [isDragging, setIsDragging] = useState(false);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [uploadedScreenshots, setUploadedScreenshots] = useState<Screenshot[]>([]);
  
const modalVariants: Variants = {
  hidden: { opacity: 0, y: -20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 500
    }
  },
  exit: { opacity: 0, y: 20, scale: 0.95 }
};

  const fetchScreenshots = async (): Promise<void> => {
    try {
      const response = await fetch('/api/screenshots', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setUploadedScreenshots(data.screenshots || []);
      }
    } catch (error) {
      console.error('Error fetching screenshots:', error);
      toast.error('Failed to fetch screenshots');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchScreenshots();
    }
  }, [isOpen]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      try {
        await onUpload(selectedFile);
        // Reset state
        setPreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  const handleDeleteClick = (screenshotId: string) => {
    setDeleteConfirmation({ isOpen: true, screenshotId });
  };

  const handleConfirmDelete = async () => {
    const screenshotId = deleteConfirmation.screenshotId;
    if (!screenshotId) return;

    toast.promise(
      (async () => {
        try {
          const response = await fetch(`/api/screenshots/${screenshotId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();
          if (!data.success) {
            throw new Error(data.message || 'Failed to delete screenshot');
          }

          await fetchScreenshots();
          return 'Screenshot deleted successfully';
        } catch (error) {
          console.error('Delete error:', error);
          throw new Error('Failed to delete screenshot');
        } finally {
          setDeleteConfirmation({ isOpen: false, screenshotId: null });
        }
      })(),
      {
        loading: 'Deleting screenshot...',
        success: (message) => message,
        error: (err) => err.message
      }
    );
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] overflow-y-auto p-4"
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          className="fixed inset-0 bg-black/70 dark:bg-black/80"
          variants={backdropVariants}
          onClick={onClose}
        />

        <div className="flex min-h-screen items-center justify-center">
          <motion.div
            ref={modalRef}
            className="relative w-full max-w-xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 text-left shadow-2xl border border-gray-200 dark:border-gray-700"
            variants={modalVariants}
          >
            {/* Delete Confirmation Dialog */}
            <AnimatePresence>
              {deleteConfirmation.isOpen && (
                <motion.div
                  className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 dark:bg-black/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-6 shadow-2xl border border-gray-200 dark:border-gray-700 m-4"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                  >
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Delete Screenshot
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Are you sure you want to delete this screenshot? This action cannot be undone.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                      <motion.button
                        type="button"
                        onClick={() => setDeleteConfirmation({ isOpen: false, screenshotId: null })}
                        className="rounded-full bg-white dark:bg-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white shadow-lg ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={handleConfirmDelete}
                        className="rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-red-500"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={onClose}
              className="absolute right-3 top-3 sm:right-4 sm:top-4 text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={isUploading}
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </motion.button>
           
            <div className="flex flex-col lg:flex-row gap-6 mt-4">
              {/* Upload Section */}
              {!user?.isPaid && (
                <motion.div 
                  className="flex-1"
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                  custom={0}
                >
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                    Upload Payment Screenshot
                  </h3>

                  <div className="mt-2">
                    <motion.div
                      className={`flex justify-center rounded-lg border-2 border-dashed ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600'} px-4 sm:px-6 py-8 sm:py-10 transition-colors duration-200`}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="text-center">
                        {preview ? (
                          <motion.div 
                            className="mb-4 relative"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Image
                              src={preview || ''}
                              alt="Preview"
                              className="mx-auto rounded-lg shadow-md"
                              width={400}
                              height={256}
                              style={{ maxHeight: '16rem', objectFit: 'contain' }}
                            />
                            <motion.button
                              onClick={() => {
                                setPreview(null);
                                setSelectedFile(null);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                              }}
                              className="absolute -top-2 -right-2 p-1 bg-gray-800 text-white rounded-full shadow-lg"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </motion.button>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-500" />
                            <motion.div 
                              className="mt-2"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <label
                                htmlFor="file-upload"
                                className={`relative cursor-pointer rounded-md font-semibold text-indigo-600 dark:text-indigo-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                <span>Select a file</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  ref={fileInputRef}
                                  disabled={isUploading}
                                />
                              </label>
                              <p className="pl-1 text-gray-500 dark:text-gray-400">or drag and drop</p>
                              <p className="text-xs leading-5 text-gray-600 dark:text-gray-400 mt-2">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </motion.div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  <motion.div 
                    className="mt-6 flex flex-col sm:flex-row justify-end gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.button
                      type="button"
                      onClick={onClose}
                      className="rounded-full bg-white dark:bg-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white shadow-lg ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isUploading}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!selectedFile || isUploading}
                      className={`rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg ${selectedFile && !isUploading
                        ? 'bg-indigo-600 hover:bg-indigo-500'
                        : 'bg-indigo-400 cursor-not-allowed'
                        }`}
                      whileHover={{ scale: selectedFile && !isUploading ? 1.05 : 1 }}
                      whileTap={{ scale: selectedFile && !isUploading ? 0.95 : 1 }}
                    >
                      {isUploading ? (
                        <span className="flex items-center justify-center">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          Uploading...
                        </span>
                      ) : (
                        'Upload'
                      )}
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}

              {/* Uploaded Screenshots Section */}
              <motion.div 
                className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 pt-4 lg:pt-0 lg:pl-6"
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                custom={1}
              >
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Uploaded Screenshots
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols gap-4 max-h-[400px] overflow-y-auto pr-2">
                  {uploadedScreenshots.length > 0 ? (
                    uploadedScreenshots.map((screenshot, index) => (
                      <motion.div
                        key={screenshot._id}
                        className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 aspect-[4/3]"
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ scale: 1.02 }}
                        layout
                      >
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <Image
                          src={screenshot.screen_shot}
                          alt="Payment Screenshot"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-contain transition-opacity duration-300"
                          onLoadingComplete={(img) => {
                            img.classList.remove('opacity-0');
                            img.previousElementSibling?.classList.add('hidden');
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder.png';
                            target.previousElementSibling?.classList.add('hidden');
                          }}
                          unoptimized={true}
                        />
                        {screenshot.isActive && !user?.isPaid && (
                          <motion.button
                            onClick={() => handleDeleteClick(screenshot._id)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 shadow-lg"
                            title="Delete screenshot"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </motion.button>
                        )}
                        <motion.div 
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-2 z-10"
                          initial={{ opacity: 0, y: 10 }}
                          whileHover={{ opacity: 1, y: 0 }}
                        >
                          {new Date(screenshot.createdAt).toLocaleDateString()}
                        </motion.div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      className="col-span-full text-center text-gray-500 dark:text-gray-400 py-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      No screenshots uploaded yet
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadModal;