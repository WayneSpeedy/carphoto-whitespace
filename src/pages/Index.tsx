
import React, { useState } from 'react';
import UploadZone from '@/components/UploadZone';
import ProcessingIndicator from '@/components/ProcessingIndicator';
import ImagePreview from '@/components/ImagePreview';
import { removeBackground } from '@/utils/backgroundRemover';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleImageSelected = async (file: File) => {
    try {
      setSelectedFile(file);
      setIsProcessing(true);
      
      // Read and display the original image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setOriginalImage(e.target.result);
        }
      };
      reader.readAsDataURL(file);
      
      // Process the image (remove background)
      console.log("Starting background removal process");
      const processed = await removeBackground(file);
      console.log("Background removal completed");
      setProcessedImage(processed);
      
      toast({
        title: "Background removed!",
        description: "Your car image now has a white background.",
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error processing image",
        description: "Please try again with a different image.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Car Photo Background Remover</h1>
          <p className="text-gray-600">Upload a car photo and we'll automatically replace the background with white space.</p>
        </header>
        
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6">
          {!originalImage && !isProcessing && (
            <UploadZone onImageSelected={handleImageSelected} />
          )}
          
          {isProcessing && <ProcessingIndicator />}
          
          {originalImage && processedImage && !isProcessing && (
            <ImagePreview 
              originalImage={originalImage} 
              processedImage={processedImage} 
              onReset={handleReset} 
            />
          )}
        </div>
        
        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Car Photo Whitespace Tool</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
