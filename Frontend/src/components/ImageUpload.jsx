import { Upload, RefreshCw } from 'lucide-react';

function ImageUpload({ selectedImage, fileInputRef, handleImageUpload, resetAnalysis }) {
    return (
        <div className="mb-8">
            <div className={`border-3 border-dashed rounded-2xl p-10 text-center
                ${selectedImage ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
                transition-all duration-300 transform hover:scale-[1.02]`}>
                {!selectedImage ? (
                    <div className="cursor-pointer space-y-4" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-16 h-16 text-blue-500 mx-auto" />
                        <div>
                            <p className="text-xl font-semibold text-gray-700 mb-2">Upload an image for analysis</p>
                            <p className="text-gray-500">Click to browse or drag and drop your medical image</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <img
                            src={selectedImage}
                            alt="Uploaded image"
                            className="max-h-80 mx-auto rounded-lg shadow-lg"
                        />
                        <button
                            onClick={resetAnalysis}
                            className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                            title="Reset"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                />
            </div>
        </div>
    );
}

export default ImageUpload;