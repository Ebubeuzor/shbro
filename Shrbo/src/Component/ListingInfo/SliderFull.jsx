import React, { useEffect, useRef } from "react";
import MainSlider from "./MainSlider";
import ThumbnailSlider from "./ThumbnailSlider";
import { Splide, SplideSlide } from "@splidejs/react-splide";

const SliderFull = () => {
  const slider1 = useRef();
  const slider2 = useRef();

  useEffect(() => {
    slider1.current.sync(slider2.current.splide);
  }, [slider1, slider2]);

  return (
    <div className="  w-full relative pt-6 gap-[10px]  h-full flex flex-col justify-between  ">
      <MainSlider slider1={slider1} />
      <ThumbnailSlider slider2={slider2} />
    </div>
  );
};

export default SliderFull;
