import { CheckCircle, X } from "lucide-react";
import { useEffect } from "react";

export default function SuccessMessage({ 
  message, 
  onClose 
}: { 
  message: string;
  onClose?: () => void;
}) {
  if (!message) return null;

  useEffect(() => {
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      onClose?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in">
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
        <div className="flex items-start justify-between">
          <div className="flex">
            <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{message}</span>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="ml-4 text-green-700 hover:text-green-900"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}