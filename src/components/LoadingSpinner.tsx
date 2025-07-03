
import { ChefHat } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <ChefHat className="h-12 w-12 text-orange-500 animate-bounce" />
        <div className="absolute inset-0 h-12 w-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-1">
          Cooking up your recipe...
        </h3>
        <p className="text-gray-500 text-sm">
          Our AI chef is preparing something delicious for you
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
