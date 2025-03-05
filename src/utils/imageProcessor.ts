import { pipeline } from "@huggingface/transformers";

// Model for image segmentation
const SEGMENTATION_MODEL = "Xenova/segformer-b0-finetuned-ade-512-512";

// Initialize the segmentation pipeline
let segmenter: any = null;

const initializeSegmenter = async () => {
  if (!segmenter) {
    try {
      console.log("Initializing segmentation model...");
      segmenter = await pipeline("image-segmentation", SEGMENTATION_MODEL);
      console.log("Segmentation model initialized successfully");
    } catch (error) {
      console.error("Error initializing segmentation model:", error);
      throw new Error("Failed to initialize the image processing model");
    }
  }
  return segmenter;
};

export const removeBackground = async (imageFile: File): Promise<string> => {
  try {
    // Initialize the segmenter if not already done
    const model = await initializeSegmenter();
    
    // Convert the file to a format the model can use
    const imageUrl = URL.createObjectURL(imageFile);
    
    // Process the image with the segmentation model
    console.log("Processing image with segmentation model...");
    const result = await model(imageUrl, {
      threshold: 0.5,
      att_mask: true, // Get attention mask
    });
    
    // Create a canvas to manipulate the image
    const img = new Image();
    
    // Return a promise that resolves when the image is processed
    return new Promise((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data for pixel manipulation
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // If we have segmentation results, use them to mask out non-car pixels
        if (result && result.length > 0) {
          // Find the car segment (assuming it's one of the predicted segments)
          const carSegment = result.find((seg: any) => 
            ["car", "vehicle", "automobile", "truck", "bus"].includes(seg.label.toLowerCase())
          );
          
          if (carSegment && carSegment.mask) {
            // Load the mask onto an image
            const maskImg = new Image();
            maskImg.onload = () => {
              // Create a temporary canvas for the mask
              const maskCanvas = document.createElement("canvas");
              maskCanvas.width = img.width;
              maskCanvas.height = img.height;
              const maskCtx = maskCanvas.getContext("2d");
              
              if (!maskCtx) {
                reject(new Error("Could not get mask canvas context"));
                return;
              }
              
              // Draw the mask to the canvas
              maskCtx.drawImage(maskImg, 0, 0, img.width, img.height);
              const maskData = maskCtx.getImageData(0, 0, img.width, img.height).data;
              
              // Apply the mask - set background pixels to white
              for (let i = 0; i < data.length; i += 4) {
                const maskIndex = Math.floor(i / 4) * 4;
                // If pixel is not part of the car (mask is black or nearly black)
                if (maskData[maskIndex] < 50) {
                  // Set pixel to white (background)
                  data[i] = 255;     // R
                  data[i + 1] = 255; // G
                  data[i + 2] = 255; // B
                  // Keep original alpha
                }
              }
              
              // Put the modified image data back on the canvas
              ctx.putImageData(imageData, 0, 0);
              
              // Convert canvas to data URL and resolve promise
              resolve(canvas.toDataURL("image/png"));
            };
            
            maskImg.src = carSegment.mask;
          } else {
            // No car segment found, simple background removal based on edges
            applySimpleBackgroundRemoval(data, canvas.width, canvas.height);
            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL("image/png"));
          }
        } else {
          // Fallback to simple background removal if segmentation fails
          applySimpleBackgroundRemoval(data, canvas.width, canvas.height);
          ctx.putImageData(imageData, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        }
      };
      
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
      
      img.src = imageUrl;
    });
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
};

// Simple background removal as fallback
const applySimpleBackgroundRemoval = (data: Uint8ClampedArray, width: number, height: number) => {
  // This is a simplistic approach - in a real app you'd want more sophisticated algorithms
  // We'll just make the edges white as a placeholder
  const borderSize = Math.floor(Math.min(width, height) * 0.1); // 10% border
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // If pixel is near the edge
      if (x < borderSize || x >= width - borderSize || 
          y < borderSize || y >= height - borderSize) {
        const idx = (y * width + x) * 4;
        data[idx] = 255;     // R
        data[idx + 1] = 255; // G
        data[idx + 2] = 255; // B
        // Keep original alpha
      }
    }
  }
};
