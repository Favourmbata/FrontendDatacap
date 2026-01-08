"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAiMeasurement } from "@/api/hooks/useAiMeasurement";
import { useSaveManualMeasurement } from "@/api/hooks/useManualMeasurement";
import { Camera, Upload, RotateCcw, Check } from "lucide-react";
import { toast } from "@/app/components/hooks/use-toast";

// Separate component that uses useSearchParams
function AiBodyMeasurementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { analyzeBodyScan, convertFileToBase64, isLoading, error, result, reset } = useAiMeasurement();
  const saveMeasurementMutation = useSaveManualMeasurement();
  const [step, setStep] = useState<'capture' | 'height' | 'processing' | 'results'>('capture');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [sideImage, setSideImage] = useState<string | null>(null);
  const [height, setHeight] = useState<string>("");
  const [alignmentStatus, setAlignmentStatus] = useState<'not-aligned' | 'aligned' | 'processing'>('not-aligned');
  const [currentImageType, setCurrentImageType] = useState<'front' | 'side'>('front');
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    subject: "Self"
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Get form data from URL parameters
  useEffect(() => {
    const firstName = searchParams.get('firstName') || '';
    const lastName = searchParams.get('lastName') || '';
    const subject = searchParams.get('subject') || 'Self';
    
    setFormData({
      firstName,
      lastName,
      subject
    });
  }, [searchParams]);

  // Initialize camera
  useEffect(() => {
    if (step === 'capture') {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [step]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        
        if (currentImageType === 'front') {
          setCapturedImage(imageData);
        } else {
          setSideImage(imageData);
        }
        
        // If we have front image, suggest taking side image
        if (currentImageType === 'front' && !sideImage) {
          setCurrentImageType('side');
        } else {
          setStep('height');
        }
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const imageData = event.target.result as string;
          
          if (currentImageType === 'front') {
            setCapturedImage(imageData);
          } else {
            setSideImage(imageData);
          }
          
          // If we have front image, suggest taking side image
          if (currentImageType === 'front' && !sideImage) {
            setCurrentImageType('side');
          } else {
            setStep('height');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeightSubmit = () => {
    if (!height || isNaN(parseFloat(height))) {
      toast({
        title: "Invalid Height",
        description: "Please enter a valid height in centimeters.",
        variant: "destructive",
      });
      return;
    }
    
    const heightValue = parseFloat(height);
    if (heightValue <= 0 || heightValue > 300) {
      toast({
        title: "Invalid Height",
        description: "Height must be between 1 and 300 cm.",
        variant: "destructive",
      });
      return;
    }
    
    processAiMeasurement();
  };

  const processAiMeasurement = async () => {
    if (!capturedImage) return;
    
    setStep('processing');
    reset(); // Clear any previous errors/results
    
    try {
      // Convert base64 image to the format expected by the API
      let frontImageData = capturedImage;
      // Ensure we have the full data URL format for the API
      if (!frontImageData.startsWith('data:image')) {
        frontImageData = `data:image/jpeg;base64,${frontImageData}`;
      }
      
      let sideImageData = undefined;
      if (sideImage) {
        sideImageData = sideImage;
        if (!sideImageData.startsWith('data:image')) {
          sideImageData = `data:image/jpeg;base64,${sideImageData}`;
        }
      }
      
      const requestData = {
        frontImageData: frontImageData,
        sideImageData: sideImageData,
        userHeight: parseFloat(height),
        scanTimestamp: new Date().toISOString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        subject: formData.subject
      };
      
      await analyzeBodyScan(requestData);
      setStep('results');
    } catch (err) {
      toast({
        title: "Analysis Failed",
        description: error || "Failed to analyze body scan. Please try again.",
        variant: "destructive",
      });
      setStep('height'); // Go back to height input
    }
  };

  const retakeImage = () => {
    setCapturedImage(null);
    setSideImage(null);
    setHeight("");
    setCurrentImageType('front');
    setStep('capture');
    reset();
  };

  const saveMeasurements = async () => {
    if (!result) return;
    
    try {
      // Convert AI measurements to the format expected by the manual measurement API
      const measurementsData = result.data.measurements;
      
      const payload = {
        measurementType: "AI",
        subject: formData.subject,
        firstName: formData.firstName,
        lastName: formData.lastName,
        sections: [
          {
            sectionName: "AI Generated Measurements",
            measurements: [
              { bodyPartName: "Shoulder", size: measurementsData.measurements.shoulder },
              { bodyPartName: "Bust", size: measurementsData.measurements.bust },
              { bodyPartName: "Arm Length", size: measurementsData.measurements.armLength },
              { bodyPartName: "Neck", size: measurementsData.measurements.neck },
              { bodyPartName: "Butt", size: measurementsData.measurements.butt },
              { bodyPartName: "Waist", size: measurementsData.measurements.waist },
              { bodyPartName: "Hips", size: measurementsData.measurements.hips },
              { bodyPartName: "Wrist", size: measurementsData.measurements.wrist },
              { bodyPartName: "Inseam", size: measurementsData.measurements.inseam },
              { bodyPartName: "Chest", size: measurementsData.measurements.chest }
            ]
          }
        ]
      };
      
      await saveMeasurementMutation.mutateAsync(payload);
      
      toast({
        title: "Success",
        description: "AI measurements saved successfully!",
      });
      router.push("/user/body-measurement");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save measurements. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to save measurements:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-center text-gray-800">
              AI Body Measurement
            </h1>
            <p className="text-sm text-gray-500 text-center mt-1">
              {step === 'capture' && `Take ${currentImageType} view photo`}
              {step === 'height' && 'Enter your height'}
              {step === 'processing' && 'Analyzing your measurements'}
              {step === 'results' && 'Your measurements'}
            </p>
          </div>
          
          {/* Progress Indicator */}
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'capture' ? 'bg-purple-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                step === 'capture' ? 'bg-gray-200' : 'bg-purple-600'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'height' ? 'bg-purple-600 text-white' : 
                step === 'capture' ? 'bg-gray-200' : 'bg-purple-600 text-white'
              }`}>
                2
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                step === 'processing' || step === 'results' ? 'bg-purple-600' : 'bg-gray-200'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'results' ? 'bg-purple-600 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4 min-h-[400px]">
            {/* Capture Step */}
            {step === 'capture' && (
              <div className="space-y-4">
                {/* Image Type Selector */}
                <div className="flex justify-center space-x-4 mb-4">
                  <button
                    onClick={() => setCurrentImageType('front')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      currentImageType === 'front' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Front View {capturedImage && '✓'}
                  </button>
                  <button
                    onClick={() => setCurrentImageType('side')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      currentImageType === 'side' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Side View {sideImage && '✓'}
                  </button>
                </div>

                <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[3/4] flex items-center justify-center">
                  {(currentImageType === 'front' && capturedImage) || (currentImageType === 'side' && sideImage) ? (
                    <img 
                      src={currentImageType === 'front' ? capturedImage! : sideImage!} 
                      alt={`${currentImageType} view`} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted
                        className="w-full h-full object-cover"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      
                      {/* Alignment overlay */}
                      <div className="absolute inset-0 border-4 border-dashed border-purple-500 rounded-lg m-4 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 border-4 border-purple-500 rounded-full flex items-center justify-center mx-auto">
                            <div className="w-8 h-8 border-2 border-purple-500 rounded-full"></div>
                          </div>
                          <p className="text-white font-medium mt-2 bg-black bg-opacity-50 px-2 py-1 rounded">
                            {currentImageType === 'front' ? 'Stand facing camera' : 'Stand sideways'}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex justify-center gap-4">
                  {!(currentImageType === 'front' && capturedImage) && !(currentImageType === 'side' && sideImage) ? (
                    <>
                      <button
                        onClick={captureImage}
                        className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-lg hover:bg-purple-700 transition-colors"
                      >
                        <Camera className="w-6 h-6" />
                      </button>
                      
                      <label className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 shadow-lg hover:bg-gray-300 transition-colors cursor-pointer">
                        <Upload className="w-6 h-6" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        if (currentImageType === 'front') {
                          setCapturedImage(null);
                        } else {
                          setSideImage(null);
                        }
                      }}
                      className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 flex items-center gap-2 hover:bg-gray-300 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Retake {currentImageType}
                    </button>
                  )}
                </div>

                {/* Continue Button */}
                {capturedImage && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setStep('height')}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      {sideImage ? 'Continue with both images' : 'Continue with front image only'}
                    </button>
                  </div>
                )}
                
                <div className="text-center text-sm text-gray-500">
                  <p>Front image is required. Side image is optional but recommended for better accuracy.</p>
                </div>
              </div>
            )}
            
            {/* Height Input Step */}
            {step === 'height' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="flex justify-center gap-4 mb-4">
                    {capturedImage && (
                      <div className="text-center">
                        <div className="w-24 h-32 mx-auto bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={capturedImage} 
                            alt="Front view" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Front</p>
                      </div>
                    )}
                    {sideImage && (
                      <div className="text-center">
                        <div className="w-24 h-32 mx-auto bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={sideImage} 
                            alt="Side view" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Side</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={retakeImage}
                    className="mt-2 text-sm text-purple-600 hover:text-purple-800"
                  >
                    Change Images
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Height (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g., 175"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="1"
                    max="300"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Enter your accurate height for precise measurements
                  </p>
                </div>
                
                <button
                  onClick={handleHeightSubmit}
                  disabled={!height}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  Analyze My Measurements
                </button>
              </div>
            )}
            
            {/* Processing Step */}
            {step === 'processing' && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <h3 className="text-lg font-medium text-gray-800">Analyzing...</h3>
                <p className="text-gray-500 text-center">
                  Our AI is processing your body scan to calculate precise measurements
                </p>
              </div>
            )}
            
            {/* Results Step */}
            {step === 'results' && result && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">Analysis Complete!</h3>
                  <p className="text-gray-500 mt-1">
                    Here are your body measurements
                  </p>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(result.data.measurements.measurements).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-medium">
                        {typeof value === 'number' ? `${value.toFixed(2)} cm` : value}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 space-y-3">
                  <button
                    onClick={saveMeasurements}
                    className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Save Measurements
                  </button>
                  <button
                    onClick={retakeImage}
                    className="w-full py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Scan Again
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border-t border-red-200">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Back to Measurements
          </button>
        </div>
      </div>
    </div>
  );
}

// Fallback component for Suspense
function AiBodyMeasurementFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// Main page component that wraps the content in Suspense
export default function AiBodyMeasurement() {
  return (
    <Suspense fallback={<AiBodyMeasurementFallback />}>
      <AiBodyMeasurementContent />
    </Suspense>
  );
}