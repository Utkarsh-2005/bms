import { useState } from "react";
interface HeroSlidesProps {
  title: string;
  description: string;
  imageUrl: string;
}
function EventSlides({ title, description, imageUrl }: HeroSlidesProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  console.log("isLoading", isLoading);
  const handleImageLoad = () => {
    setIsLoading(false); // Set loading to false when image loads
  };
  return (
    <div
      className="md:rounded-3xl rounded-xl transition-transform duration-300 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
    >
      <div className="w-full rounded-3xl relative h-full">
        <img
          src={imageUrl}
          alt=""
          className="w-full md:rounded-3xl rounded-xl h-full"
          onLoad={handleImageLoad}
        />
        <div className="bg-[rgb(255,255,255,0.2)] backdrop-blur-2xl md:p-2 py-1 absolute bottom-[0rem] z-20 w-full flex flex-col md:rounded-b-3xl rounded-b-xl border b-1">
          <div className="flex justify-center font-medium text-[0.8rem] md:text-[0.9rem] lg:text-[1.1rem] 2xl:text-[1.2rem] text-white">
            {title}
          </div>
          <div className="text-white px-2 flex justify-center text-center text-[0.4rem] md:text-[0.6rem] 2xl:text-[0.7rem]">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventSlides;
