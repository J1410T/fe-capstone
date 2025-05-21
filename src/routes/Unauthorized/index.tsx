import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

/**
 * Trang hiển thị khi người dùng không có quyền truy cập
 */
export function Unauthorized(): React.ReactElement {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-red-50 rounded-full">
            <ShieldAlert className="h-16 w-16 text-red-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          You do not have permission to access!
        </h1>

        <p className="text-gray-600 mb-8">
          You do not have permission to access!.
        </p>

        <button
          onClick={goBack}
          className="flex items-center justify-center mx-auto px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white rounded-md transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
      </div>
    </div>
  );
}

export default Unauthorized;
