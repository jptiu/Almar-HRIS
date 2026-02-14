import { useNavigate } from "react-router-dom";
import { FileQuestion, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-brand-primary-dark via-brand-primary-dark to-brand-primary flex items-center justify-center p-6">
      <div className="glass-container rounded-lg p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-warning/20 mb-6">
          <FileQuestion className="w-10 h-10 text-warning" />
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold text-text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text-primary mb-2">
          Page Not Found
        </h2>
        <p className="text-text-secondary mb-6">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Button variant="ghost" className="w-full" onClick={() => navigate("/")}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;