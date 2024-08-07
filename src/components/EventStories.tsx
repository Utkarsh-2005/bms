import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import StorySlide from "./StorySlide";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Controller, EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/api";
import type { EventType } from "@/stores/event";
import axios from "../utils/middleware";


interface StoryProps {
  onOpen: boolean;
  setOpen: (open: boolean) => void;
  activeIndex: number
  // onSwiper: (swiper: SwiperCore) => void;
  // handleSlideChange: (swiper: SwiperCore) => void;
  handleNextClick: () => void; // Add handleNextClick to props
  handlePrevClick: () => void;
}


const style = {
  position: 'absolute',
  display:'flex',
  flexDirection: 'column',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'max',
  bgcolor: 'none',
  boxShadow: 'none',
  p: 4,
  border: 'none',
  outline: 'none'
};

const fetchEvent = async (slug?: string) => {
    const response = await axios.get(`${API.events.getByUrl}/${slug}`, {
      headers: {
        is_guest_user: "yes",
      },
    });
    // console.log(response)
    return response.data.data as EventType;
  };
  


const Stories: React.FC<StoryProps> = ({ onOpen, setOpen, activeIndex, handleNextClick,
  handlePrevClick,}) => {
  // const [childSwiper, setChildSwiper] = useState<SwiperCore | null>(null);
  const { slug } = useParams();
  const { data: eventData } = useQuery({
      queryKey: ["event", slug],
      queryFn: () => fetchEvent(slug),
    });
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  useEffect(() => {
    setCurrentIndex(activeIndex);
  }, [activeIndex, onOpen]);
  // const handleSlideChange = (swiper: SwiperCore) => {
  //   // setCurrentIndex(swiper.activeIndex);
  // };
  const handleNext = () => {
    handleNextClick();
    // Perform additional actions here
    setCurrentIndex((prev)=>(prev+1)%eventData?.stories.length)
  };

  const handlePrev = () => {
    handlePrevClick();
    // Perform additional actions here
    setCurrentIndex((prev)=>(prev+(eventData?.stories.length-1))%eventData?.stories.length)
  };
const handleClose = () => setOpen(false);


  console.log(eventData)
  return (
    <Modal
    open={onOpen}
    onClose={handleClose}
    className="flex justify-center items-center"
    sx={{border:'none'}}
  >
         <Box sx={style}>
        {" "}
        <X
          className="text-white size-12 cursor-pointer text-right"
          onClick={handleClose}
        />
    <Swiper
          effect = {'coverflow'}
          // onSlideChange={handleSlideChange}
          onNavigationNext={handleNext}
          onNavigationPrev={handlePrev}
          initialSlide={activeIndex}
          spaceBetween={45}
          navigation={true}
          grabCursor={true}
          centeredSlides={true}
          loop={false}
          slidesPerView={3}
          autoplay={false}
          allowTouchMove={false}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 300,
            modifier: 1.5,
          }}
          modules={[EffectCoverflow, Navigation, Controller]}
          className="swiper_container sw1 py-8 px-[10px] sm:px-[0] sm:w-[700px] w-screen p-10"
        //  onInit={setChildSwiper}
        //  controller={{
        //   by:"container",
        //   control: swiperInstance,
        // }}
        >
           {eventData?.stories.map((card:any, index:any) => (
            // onClick={() => setOpen(true)}
            <SwiperSlide>
              <StorySlide key={index} VideoUrl={card.videoUrl} activeIndex={activeIndex} index={index} currentIndex={currentIndex}/>
            </SwiperSlide>
          ))}
        </Swiper>
     </Box>
    </Modal>
  );
};

export default Stories;