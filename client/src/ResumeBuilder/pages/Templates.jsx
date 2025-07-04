import React from "react";
import { FaArrowLeft } from 'react-icons/fa';

function Templates({ setTemNo, setStep }) {
  return (
    <div className="relative min-h-[100vh]">
      <button
        className="absolute top-6 left-6 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100"
        onClick={() => (typeof setStep === 'function' ? setStep(false) : window.history.back())}
        title="Back"
      >
        <FaArrowLeft size={20} />
      </button>
      <div className="p-5 flex justify-center flex-col text-center pt-16">
        <div className="text-2xl font-semibold mb-8">Choose Your Resume Template</div>
        <div className="grid lg:grid-cols-2 lg:gap-5 justify-center sm:gap-2 sm:grid-cols-2">
          <button
            onClick={() => setTemNo(1)}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-2 hover:shadow-lg transition-all flex flex-col items-center"
          >
            <span className="font-bold p-2">Template 1</span>
            <div className="w-[210px] h-[297px] flex items-center justify-center overflow-hidden pointer-events-none select-none bg-gray-50 border border-gray-200">
              <img src="/t2.PNG" alt="Template 1 Preview" className="w-full h-full object-contain" />
            </div>
          </button>
          <button
            onClick={() => setTemNo(2)}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-2 hover:shadow-lg transition-all flex flex-col items-center"
          >
            <span className="font-bold p-2">Template 2</span>
            <div className="w-[210px] h-[297px] flex items-center justify-center overflow-hidden pointer-events-none select-none bg-gray-50 border border-gray-200">
              <img src="/t1.PNG" alt="Template 2 Preview" className="w-full h-full object-contain" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Templates;
