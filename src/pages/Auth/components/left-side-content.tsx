import { Check } from "lucide-react";
import { Link } from "react-router";

const LeftSideContent = () => {
    return (
        <div className="flex-1 flex flex-col justify-center items-center lg:items-start px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 lg:py-0">
            {/* Logo */}
            <Link to="/" className="block mb-8 sm:mb-12 lg:mb-16 w-full max-w-lg">
                <div className="flex items-center gap-3">
                    <div className="w-16 h-8 bg-white rounded flex items-center justify-center">
                        <span className="text-black font-bold text-xl">URS</span>
                    </div>
                    <span className="text-lg sm:text-xl font-semibold">
                        User Registration System
                    </span>
                </div>
            </Link>

            {/* Main Content */}
            <div className="max-w-lg w-full">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                    {/* Create AI short videos in minutes */}
                    Simplify User Registration with Our Efficient System
                </h1>

                <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-8 sm:mb-10 lg:mb-12 leading-relaxed">
                    {/* An intelligent short video creation tool that helps you easily create engaging
                    content for social media without editing experience. */}
                    Our User Registration System streamlines the sign-up process, ensuring a smooth
                </p>

                {/* Features */}
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check strokeWidth={3.5} className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-300 text-sm sm:text-base">
                            {/* Turn text into video in just a few minutes */}
                            Easy and quick user registration process
                        </span>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check strokeWidth={3.5} className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-300 text-sm sm:text-base">
                            {/* Thousands of professional templates and effects */}
                            Secure data handling and privacy protection
                        </span>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check strokeWidth={3.5} className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-300 text-sm sm:text-base">
                            {/* Optimized for TikTok, Instagram, and YouTube Shorts */}
                            User-friendly interface for all age groups
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default LeftSideContent;
