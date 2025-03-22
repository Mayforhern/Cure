import React from 'react'
import { FileX2, Activity } from 'lucide-react';

const AnalysisBot = () => {
    const handleXRayAnalysis = () => {
        window.location.href = '/analysis/xray';
        // You can replace this with your actual X-ray analysis page URL
    };

    const handleECGAnalysis = () => {
        window.location.href = '/analysis/ecg';
        // You can replace this with your actual ECG analysis page URL
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Medical Analysis Portal</h1>

                <div className="space-y-4">
                    <button
                        onClick={handleXRayAnalysis}
                        className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        <FileX2 size={20} />
                        <span className="font-medium">X-Ray Analysis</span>
                    </button>

                    <button
                        onClick={handleECGAnalysis}
                        className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        <Activity size={20} />
                        <span className="font-medium">ECG Analysis</span>
                    </button>
                </div>

                <p className="mt-6 text-sm text-gray-500 text-center">
                    Select an analysis type to proceed with your medical diagnostics
                </p>
            </div>
        </div>
    )
}

export default AnalysisBot