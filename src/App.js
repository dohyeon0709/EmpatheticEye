import './App.css';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // 📌 ScrollTrigger 추가
import LoadingScreen from './LoadingScreen';

gsap.registerPlugin(ScrollTrigger); // 📌 GSAP 플러그인 등록

const Model = ({ url, position, rotation }) => {
  const { scene } = useGLTF(url, { draco: '/draco-gltf/' });
  const modelRef = useRef();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const updateScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor');
    let animationFrameId;

    const updateCursor = (e) => {
      if (cursor) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      }
    };

    document.addEventListener('mousemove', updateCursor);

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.position.x += (position[0] + scrollY * 0.0016 - modelRef.current.position.x) * 0.01;
      modelRef.current.position.y += (position[1] - scrollY * 0.001 - modelRef.current.position.y) * 0.01;
      modelRef.current.rotation.x += (rotation[1] + scrollY * 0.00013 - modelRef.current.rotation.x) * 0.01;
      modelRef.current.rotation.y += (rotation[0] + scrollY * 0.0024 - modelRef.current.rotation.y) * 0.01;
      modelRef.current.rotation.z += (rotation[2] - scrollY * 0.0002 - modelRef.current.rotation.z) * 0.01;
    }
  });

  useEffect(() => {
    if (modelRef.current) {
      gsap.fromTo(
        modelRef.current.rotation,
        { y: -Math.PI },
        { y: 0, duration: 2, ease: 'power3.out' }
      );

      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          const materialName = child.material.name;
      
          // Glass Basic Black 계열은 투명 유지
          if (materialName.includes("Glass Basic Black")) return;
          if (materialName.includes("Anodized Titanium Polished Red")) return;
          if (materialName.includes("Anodized Titanium Polished Champagne")) return;
      
          // 예제: 나머지 모든 재질을 검은색으로 변경
          child.material.color.set(0x111111);
        }
      });
    }
  }, []);

  return <primitive object={scene} position={position} scale={0.5} ref={modelRef} rotation={rotation} />;
};

// 모델 프리로드 설정
useGLTF.preload("/3dmodel/symphatic_eye_draco.glb", { draco: '/draco-gltf/' });

const MovingLight = () => {
  const lightRef = useRef();
  const [mousePos, setMousePos] = useState([0, 0]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePos([
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      ]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const r = Math.sin(time * 0.5) * 0.5 + 0.5;
    const g = Math.sin(time * 0.7 + Math.PI / 2) * 0.5 + 0.5;
    const b = Math.sin(time * 0.9 + Math.PI) * 0.5 + 0.5;
    const lightColor = `rgb(${Math.floor(r * 255)}, ${Math.floor(g * 255)}, ${Math.floor(b * 255)})`;

    if (lightRef.current) {
      lightRef.current.color.set(lightColor);
      lightRef.current.position.set(mousePos[0] * 5, mousePos[1] * 5, 3);
    }
  });

  return <pointLight ref={lightRef} intensity={10} distance={10} decay={0} />;
};

// App.js에 추가할 언어 데이터
const textContent = {
  ko: {
    title: "공감하는 눈",
    description: [
      "공감하는 눈은 표정이 다양한 사람의 골격을 가졌지만, 아이러니하게도 그 눈동자는 표정이 드러나지 않는 말의 눈동자를 가졌습니다.",
      "표정 없이도 사람과 정말 가까운 교감을 나눴던 이 눈동자는 표정을 가지게 되었습니다.",
      "눈동자는 당신의 표정을 읽고, 행동을 관찰하며, 마음 깊은 곳에 공감합니다.",
      "마지막으로, 눈을 감으며 그 모든 감정을 눈 안에 담아냅니다.",
      "눈으로 세상을 본다는 것은, 빛이 수정체를 지나 망막에 상이 맻히는 것입니다.",
      "당신의 눈으로 들어오는 모든 빛줄기는 굴절되어 축소되며, 망막이라는 작은 화면에 세상이 담깁니다.",
      "그러나 그 작고 단순해진 이미지 속에서 우리는 거대한 세상을 이해하고, 의미를 찾습니다. ",
      "이것이 우리가 세상을 보는 방식입니다.",
      "공감하는 눈으로 당신을 들여다본다면 어떨까요?",
      "당신의 행동과 표정, 그리고 감정은 완벽하고 어두운 투명 구체를 통과하며 점점 작아집니다. ",
      "하지만 그 작아진 감정은 오히려 더 본질에 가까워집니다. ",
      "공감하는 눈은 그 본질을 관찰하고, 이해하고, 끝내는 담아냅니다. ",
      "눈동자는 세상의 거대함과 인간 내면의 깊이를 동시에 담아내는 창입니다. ",
      "그것이 바로 공감하는 눈이 세상을 바라보는 방식입니다."
    ],
  },
  en: {
    title: "Empathetic Eye",
    description: [
      "Empathetic Eye has the skeletal structure of a person with diverse expressions, but ironically, its pupil has the expressionless eye of a horse.",
      "This eye, which shared intimate connections with people even without expressions, has now gained its own expression.",
      "The pupil reads your expressions, observes your actions, and empathizes deeply with your heart.",
      "Finally, it closes, containing all those emotions within.",
      "Seeing the world through eyes means that light passes through the lens and forms an image on the retina.",
      "All light rays entering your eyes are refracted and reduced, capturing the world on the small screen called the retina.",
      "However, in these small and simplified images, we understand the vast world and find meaning.",
      "This is how we see the world.",
      "What if we look at you through empathetic eyes?",
      "Your actions, expressions, and emotions pass through a perfect dark transparent sphere and gradually become smaller.",
      "But these reduced emotions become closer to their essence.",
      "The empathetic eye observes, understands, and ultimately contains this essence.",
      "The pupil is a window that simultaneously captures the vastness of the world and the depth of human inner self.",
      "This is how the empathetic eye views the world."
    ],
  }
};

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef(null);
  const canvasRef = useRef();
  const [scrollDirection, setScrollDirection] = useState(null); // 스크롤 방향 상태 추가
  const [isScrolling, setIsScrolling] = useState(false); // 스크롤 중인지 상태 추가
  let scrollInterval = useRef(null); // useRef로 interval 관리
  const [showHint, setShowHint] = useState(false);
  const inactivityTimerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [language, setLanguage] = useState('ko'); // 언어 상태 추가

  const startScrolling = (event) => {
    if (event.type === 'mousedown') {
      event.preventDefault();
      const scrollSpeed = event.button === 2 ? -1 : 1;
      setScrollDirection(scrollSpeed > 0 ? 'down' : 'up');
      setIsScrolling(true);

      // 이전 interval이 있다면 제거
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }

      // 새로운 interval 설정
      scrollInterval.current = setInterval(() => {
        window.scrollBy(0, scrollSpeed);
      }, 20);
    }
  };

  const stopScrolling = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
    setIsScrolling(false);
    setScrollDirection(null);
  };

  // 컴포넌트 언마운트 시 interval 정리
  useEffect(() => {
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded && canvasRef.current) {
      gsap.fromTo(canvasRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 2, ease: 'power2.out' }
      );

      // 기존 텍스트 애니메이션
      const lines = document.querySelectorAll('.description p');
      lines.forEach(line => {
        gsap.fromTo(line,
          { 
            opacity: 0, 
            filter: 'blur(15px)',
            scale: 1.2
          },
          { 
            opacity: 1, 
            filter: 'blur(0px)',
            scale: 1,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: line,
              start: 'top 40%',
              end: 'top 20%',
              toggleActions: "play reverse play reverse",
              markers: false
            }
          }
        );
      });

      // 크레딧 애니메이션 추가
      const credits = document.querySelectorAll('.credit-line');
      credits.forEach((credit, index) => {
        gsap.fromTo(credit,
          {
            opacity: 0,
            y: 30,
            filter: 'blur(5px)'
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.5,
            delay: index * 0.5, // 각 라인마다 0.5초씩 딜레이
            ease: 'power3.out',
            scrollTrigger: {
              trigger: credit,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
              markers: false
            }
          }
        );
      });

      const contactButtons = document.querySelector('.contact-buttons');
      gsap.fromTo(contactButtons,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contactButtons,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
            markers: false
          }
        }
      );
    }
  }, [isLoaded]);

  useEffect(() => {
    const audio = new Audio('/music/Meeting_Again-Emily_A_Sprague.mp3');
    audio.loop = true;
    audio.volume = 0.2;
    audioRef.current = audio;

    const playAudio = () => {
      audio.play().catch((error) => console.log('자동 재생 실패:', error));
    };

    window.addEventListener('click', playAudio); // 클릭 시 음악 자동 재생
    return () => {
      window.removeEventListener('click', playAudio);
      audio.pause();
    };
  }, []);

  const [showClickMessage, setShowClickMessage] = useState(true);

const handleUserClick = () => {
  setShowClickMessage(false);
};

useEffect(() => {
  const playAudio = () => {
    if (audioRef.current && isLoaded) {
      audioRef.current.play().catch((error) => console.log('자동 재생 실패:', error));
    }
    if (isLoaded) {
      setShowClickMessage(false); // 로딩이 완료된 후 클릭해야만 메시지 숨기기
    }
  };

  window.addEventListener('click', playAudio);
  return () => {
    window.removeEventListener('click', playAudio);
  };
}, [isLoaded]);

  // 함수를 useCallback으로 감싸서 불필요한 재생성 방지
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    setShowHint(false);
    
    // 8초 동안 활동이 없으면 힌트 표시
    inactivityTimerRef.current = setTimeout(() => {
      // 스크롤 중이 아닐 때만 힌트 표시
      if (!isScrolling) {
        setShowHint(true);
      }
    }, 700);
  }, [isScrolling, setShowHint]); // 이 함수 내에서 사용하는 상태나 props를 의존성으로 추가
  
  // 컴포넌트 마운트 시 타이머 시작
  useEffect(() => {
    if (isLoaded) {
      resetInactivityTimer();
      
      // 마우스 움직임, 클릭, 키보드 이벤트 감지
      const handleUserActivity = () => resetInactivityTimer();
      
      window.addEventListener('mousemove', handleUserActivity);
      window.addEventListener('mousedown', handleUserActivity);
      window.addEventListener('keydown', handleUserActivity);
      
      return () => {
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
        window.removeEventListener('mousemove', handleUserActivity);
        window.removeEventListener('mousedown', handleUserActivity);
        window.removeEventListener('keydown', handleUserActivity);
      };
    }
  }, [isLoaded, resetInactivityTimer]);
  
  // 마우스 위치 추적 이벤트 리스너 추가
  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  // 단순화된 Hint 컴포넌트
  const Hint = () => {
    if (!showHint || !isLoaded || isScrolling) return null;
    
    const hintStyle = {
      left: `${mousePosition.x}px`,
      top: `${mousePosition.y + 60}px`, // 커서보다 60px 아래
    };
    
    return (
      <div className="mouse-hint" style={hintStyle}>
        Click & Hold
      </div>
    );
  };

  // 언어 전환 버튼 컴포넌트
  const LanguageToggle = () => {
    return (
      <div className="language-buttons">
        <button 
          className={`language-button ${language === 'ko' ? 'active' : ''}`}
          onClick={() => setLanguage('ko')}
          aria-label="한국어"
        >
          KO
        </button>
        <button 
          className={`language-button ${language === 'en' ? 'active' : ''}`}
          onClick={() => setLanguage('en')}
          aria-label="English"
        >
          EN
        </button>
      </div>
    );
  };

  return (
    <>
      {/* 언어 전환 버튼 추가 */}
      <LanguageToggle />
      
      {showClickMessage && (
        <div className="click-message" onClick={handleUserClick} >
          - Click to Start -
        </div>
      )}
      <div className={`custom-cursor ${scrollDirection ? `scroll-${scrollDirection}` : ''}`}>
        {scrollDirection && (
          <div className="scroll-arrow">
            {scrollDirection === 'down' ? '↓' : '↑'}
          </div>
        )}
      </div>
      <div className={`App ${scrollDirection ? `scroll-${scrollDirection}` : ''}`}
           onMouseDown={startScrolling} // 마우스 버튼을 누를 때 스크롤 시작
           onMouseUp={stopScrolling} // 마우스 버튼을 떼면 스크롤 중지
           onMouseLeave={stopScrolling} // 마우스가 영역을 벗어나면 스크롤 중지
           onContextMenu={(event) => event.preventDefault()} // 우클릭 기본 메뉴 방지
      >
        {!isLoaded && <LoadingScreen onLoadingComplete={() => setIsLoaded(true)} />}
        {isLoaded && (
          <div ref={canvasRef} style={{ opacity: 0 }}>
            <div className="overlay">
              <h1 className="title">{textContent[language].title}</h1>
              <div className="description">
                {textContent[language].description.map((text, index) => (
                  <React.Fragment key={index}>
                    <p>{text}</p>
                    <br/>
                  </React.Fragment>
                ))}
                <div className="credits">
                  <div className="credit-line">Made By</div>
                  <div className="credit-line">Designed by 남도현 / 3D Model by 이준희</div>
                  <div className="credit-line">Contact</div>
                  <div className="contact-buttons">
                    <a 
                      href="https://dohyeon0709.github.io/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="contact-button"
                      aria-label="Portfolio"
                    >
                      <svg viewBox="0 0 24 24" className="contact-icon">
                        <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://github.com/dohyeon0709" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="contact-button"
                      aria-label="GitHub"
                    >
                      <svg viewBox="0 0 24 24" className="contact-icon">
                        <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a 
                      href="mailto:dohy0709@naver.com" 
                      className="contact-button"
                      aria-label="Email"
                    >
                      <svg viewBox="0 0 24 24" className="contact-icon">
                        <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <Canvas 
              camera={{ position: [0, 1, 5], fov: 50 }}
              dpr={[0.75, 1.5]} // 해상도 범위 낮춤
              performance={{ min: 0.5 }} // 성능 제한 설정
              frameloop="always" // 항상 렌더링으로 변경
              gl={{ 
                powerPreference: "high-performance", 
                antialias: false, // 안티앨리어싱 비활성화
                stencil: false, // 스텐실 버퍼 비활성화
                depth: true // 깊이 버퍼 활성화 (3D 렌더링에 필요)
              }}
            >
              <Environment preset="dawn" background={false} />
              <ambientLight intensity={1} />
              <MovingLight />
              <Model url={"/3dmodel/symphatic_eye_draco.glb"} position={[-1.3, -0.5, -1]} rotation={[-0.2,0,0.45]}/>
            </Canvas>
          </div>
        )}
      </div>
      <Hint />
    </>
  );
}

export default App;
