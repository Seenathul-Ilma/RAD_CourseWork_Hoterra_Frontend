import { AlertCircle } from "lucide-react";

export default function ErrorMessage() {
  return (
    <div className="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex">
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
                <span>Invalid email or password. Please try again.</span>
            </div>
        </div>
  )
}
