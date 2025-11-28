import { CheckCircle } from "lucide-react";

export default function SuccessMessage() {
    // Success Message (Hidden by default)

  return (
    <div className="hidden bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
      <div className="flex">
        <CheckCircle className="w-5 h-5 mr-2 mt-0.5" />
        <span>Registration successful! Welcome to Hoterra.</span>
      </div>
    </div>
  )
}
