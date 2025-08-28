import React from 'react';
import Lottie from 'lottie-react';
import './HumanCharacter.css';

const HumanCharacter = ({ characterType, isSpeaking, className = '' }) => {
  // Simple, guaranteed-to-work Lottie animations
  const getLottieData = () => {
    switch (characterType) {
      case 'professor':
        return {
          animationData: {
            "v": "5.5.7",
            "fr": 24,
            "ip": 0,
            "op": 48,
            "w": 200,
            "h": 200,
            "nm": "Professor",
            "ddd": 0,
            "assets": [],
            "layers": [
              {
                "ddd": 0,
                "ind": 1,
                "ty": 4,
                "nm": "Circle",
                "sr": 1,
                "ks": {
                  "o": {"a": 0, "k": 100},
                  "r": {"a": 1, "k": [{"t": 0, "s": [0]}, {"t": 48, "s": [360]}]},
                  "p": {"a": 0, "k": [100, 100, 0]},
                  "a": {"a": 0, "k": [0, 0, 0]},
                  "s": {"a": 0, "k": [100, 100, 100]}
                },
                "ao": 0,
                "shapes": [
                  {
                    "ty": "gr",
                    "it": [
                      {
                        "d": 1,
                        "ty": "el",
                        "s": {"a": 0, "k": [60, 60]},
                        "p": {"a": 0, "k": [0, 0]}
                      },
                      {
                        "ty": "fl",
                        "c": {"a": 0, "k": [0.31, 0.8, 0.77, 1]},
                        "o": {"a": 0, "k": 100}
                      }
                    ]
                  }
                ],
                "ip": 0,
                "op": 48,
                "st": 0,
                "bm": 0
              }
            ]
          },
          fallback: '👩‍🏫'
        };
      case 'techexpert':
        return {
          animationData: {
            "v": "5.5.7",
            "fr": 24,
            "ip": 0,
            "op": 48,
            "w": 200,
            "h": 200,
            "nm": "Tech Expert",
            "ddd": 0,
            "assets": [],
            "layers": [
              {
                "ddd": 0,
                "ind": 1,
                "ty": 4,
                "nm": "Circle",
                "sr": 1,
                "ks": {
                  "o": {"a": 0, "k": 100},
                  "r": {"a": 0, "k": 0},
                  "p": {"a": 0, "k": [100, 100, 0]},
                  "a": {"a": 0, "k": [0, 0, 0]},
                  "s": {"a": 1, "k": [{"t": 0, "s": [100]}, {"t": 24, "s": [120]}, {"t": 48, "s": [100]}]}
                },
                "ao": 0,
                "shapes": [
                  {
                    "ty": "gr",
                    "it": [
                      {
                        "d": 1,
                        "ty": "el",
                        "s": {"a": 0, "k": [60, 60]},
                        "p": {"a": 0, "k": [0, 0]}
                      },
                      {
                        "ty": "fl",
                        "c": {"a": 0, "k": [1, 0.42, 0.61, 1]},
                        "o": {"a": 0, "k": 100}
                      }
                    ]
                  }
                ],
                "ip": 0,
                "op": 48,
                "st": 0,
                "bm": 0
              }
            ]
          },
          fallback: '👨‍💻'
        };
      default:
        return {
          animationData: {
            "v": "5.5.7",
            "fr": 24,
            "ip": 0,
            "op": 48,
            "w": 200,
            "h": 200,
            "nm": "Default",
            "ddd": 0,
            "assets": [],
            "layers": [
              {
                "ddd": 0,
                "ind": 1,
                "ty": 4,
                "nm": "Circle",
                "sr": 1,
                "ks": {
                  "o": {"a": 0, "k": 100},
                  "r": {"a": 0, "k": 0},
                  "p": {"a": 0, "k": [100, 100, 0]},
                  "a": {"a": 0, "k": [0, 0, 0]},
                  "s": {"a": 0, "k": [100, 100, 100]}
                },
                "ao": 0,
                "shapes": [
                  {
                    "ty": "gr",
                    "it": [
                      {
                        "d": 1,
                        "ty": "el",
                        "s": {"a": 0, "k": [60, 60]},
                        "p": {"a": 0, "k": [0, 0]}
                      },
                      {
                        "ty": "fl",
                        "c": {"a": 0, "k": [0.5, 0.5, 0.5, 1]},
                        "o": {"a": 0, "k": 100}
                      }
                    ]
                  }
                ],
                "ip": 0,
                "op": 48,
                "st": 0,
                "bm": 0
              }
            ]
          },
          fallback: '👤'
        };
    }
  };

  const lottieData = getLottieData();
  const [lottieError, setLottieError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Debug logging
  console.log(`HumanCharacter render: ${characterType}`, {
    lottieData,
    isLoading,
    lottieError
  });

  const handleLottieError = (error) => {
    console.error(`Lottie error for ${characterType}:`, error);
    setLottieError(true);
    setIsLoading(false);
  };

  const handleLottieLoad = () => {
    console.log(`Successfully loaded ${characterType} animation`);
    setIsLoading(false);
  };

  // Force fallback after 3 seconds if Lottie doesn't load
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log(`Forcing fallback for ${characterType} after timeout`);
        setLottieError(true);
        setIsLoading(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isLoading, characterType]);

  // If Lottie fails to load, fall back to animated CSS
  if (lottieError) {
    return (
      <div className={`human-character fallback ${className}`}>
        <div className="animated-character">
          <span className="character-fallback">{lottieData.fallback}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`human-character ${className} ${isSpeaking ? 'speaking' : ''}`}>
      <Lottie
        animationData={lottieData.animationData}
        loop={true}
        autoplay={true}
        onError={handleLottieError}
        onLoad={handleLottieLoad}
        className="lottie-animation"
        style={{
          width: '80px',
          height: '80px'
        }}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice'
        }}
      />
    </div>
  );
};

export default HumanCharacter;
