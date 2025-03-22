import { MessageSquare, Loader2, Image as ImageIcon } from 'lucide-react';

function AnalysisResults({ isAnalyzing, analysis }) {
    return (
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
                <MessageSquare className="w-7 h-7 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
            </div>

            {isAnalyzing ? (
                <div className="flex items-center justify-center py-12 bg-gray-50 rounded-lg">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <span className="ml-4 text-lg text-gray-600">Analyzing your image...</span>
                </div>
            ) : analysis ? (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <p className="text-gray-700 text-lg leading-relaxed">{analysis}</p>
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500 text-lg">Upload an image to receive analysis</p>
                </div>
            )}
        </div>
    );
}

export default AnalysisResults;