
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface UploadZoneProps {
  onImageSelected: (file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onImageSelected(acceptedFiles[0]);
    }
  }, [onImageSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-10 cursor-pointer transition-colors duration-300 flex flex-col items-center justify-center min-h-[200px] text-center
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mb-4 text-gray-400" />
      <p className="text-lg font-medium">Drag & drop a car photo here</p>
      <p className="text-sm text-gray-500 mt-2">or click to select a file</p>
      <p className="text-xs text-gray-400 mt-4">Supported formats: JPG, PNG</p>
    </div>
  );
};

export default UploadZone;
