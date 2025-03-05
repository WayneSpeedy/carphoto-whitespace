
import React from 'react';
import { Loader2 } from 'lucide-react';

const ProcessingIndicator: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <h3 className="font-medium text-lg">Processing image...</h3>
      <p className="text-sm text-gray-500 mt-2">Removing background and applying white space.</p>
    </div>
  );
};

export default ProcessingIndicator;
