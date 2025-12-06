import { AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

export default function ErrorMessage({ 
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
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
        <div className="flex items-start justify-between">
          <div className="flex">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{message}</span>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="ml-4 text-red-700 hover:text-red-900"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}