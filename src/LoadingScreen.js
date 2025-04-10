import React, { useEffect, useState } from "react";
import gsap from "gsap";
import "./LoadingScreen.css"; // 스타일을 위한 CSS 파일

const LoadingScreen = ({ onLoadingComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline();

    // 눈동자가 떠오르는 애니메이션
    tl.fromTo(".eye", 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    )
    // 눈이 깜빡이는 효과
    .to(".eye", { opacity: 0, duration: 1, repeat: 2, yoyo: true, delay: 0.5 })
    // 로딩 화면 사라짐
    .to(".loading-screen", {
      opacity: 0,
      duration: 2,
      ease: "power3.out",
      onComplete: () => {
        setIsVisible(false); // 로딩 완료 후 숨기기
        onLoadingComplete(); // 부모 컴포넌트에 알리기
      }
    });

  }, [onLoadingComplete]);

  if (!isVisible) return null;

  const preventClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div 
      className="loading-screen" 
      onClick={preventClick}
      onMouseDown={preventClick} 
      style={{ position: 'fixed', zIndex: 9999, top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="eye">👁️</div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
