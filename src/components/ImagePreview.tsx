
import React from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImagePreviewProps {
  originalImage: string | null;
  processedImage: string | null;
  onReset: (e: React.MouseEvent) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ originalImage, processedImage, onReset }) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'car-with-white-background.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {originalImage && (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 text-center">Original Image</h3>
            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-2">
              <img src={originalImage} alt="Original car" className="max-h-[300px] object-contain" />
            </div>
          </div>
        )}
        
        {processedImage && (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2 text-center">Processed Image</h3>
            <div className="flex items-center justify-center bg-white rounded-lg p-2">
              <img src={processedImage} alt="Car with white background" className="max-h-[300px] object-contain" />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-center gap-4">
        <Button variant="outline" size="sm" onClick={onReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Process another image
        </Button>
        
        <Button size="sm" onClick={handleDownload} disabled={!processedImage}>
          <Download className="h-4 w-4 mr-2" />
          Download processed image
        </Button>
      </div>
    </div>
  );
};

export default ImagePreview;
