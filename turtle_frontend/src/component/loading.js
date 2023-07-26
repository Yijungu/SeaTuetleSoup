import React from "react";
import { useSpring, animated } from "react-spring";
import "./loading.css";

const Loading = () => {
  const props = useSpring({
    loop: true,
    from: { y: 2 },
    to: [{ y: -2 }, { y: 2 }],
    config: { duration: 300 },
    delay: 0,
  });

  const props2 = useSpring({
    loop: true,
    from: { y: 2 },
    to: [{ y: -2 }, { y: 2 }],
    config: { duration: 300 },
    delay: 50,
  });

  const props3 = useSpring({
    loop: true,
    from: { y: 2 },
    to: [{ y: -2 }, { y: 2 }],
    config: { duration: 300 },
    delay: 100,
  });

  return (
    <div className="loading">
      <animated.div
        style={{ transform: props.y.to((y) => `translateY(${y}px)`) }}
      />
      <animated.div
        style={{ transform: props2.y.to((y) => `translateY(${y}px)`) }}
      />
      <animated.div
        style={{ transform: props3.y.to((y) => `translateY(${y}px)`) }}
      />
    </div>
  );
};

export default Loading;
