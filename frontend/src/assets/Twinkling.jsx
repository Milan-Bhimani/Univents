import { motion } from "framer-motion";

const Twinkling = () => {
  const numStars = 50; // Number of stars

  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: numStars }).map((_, index) => {
        const randomX = Math.random() * 100; // Random horizontal position
        const randomY = Math.random() * 100; // Random vertical position
        const randomSize = Math.random() * 3 + 2; // Random star size
        const randomDelay = Math.random() * 3; // Stagger effect

        return (
          <motion.div
            key={index}
            className="absolute rounded-full bg-white"
            style={{
              width: `${randomSize}px`,
              height: `${randomSize}px`,
              left: `${randomX}vw`,
              top: `${randomY}vh`,
              filter: "blur(2px)", // Soft glow effect
              boxShadow: "0px 0px 10px 4px rgba(255, 255, 255, 0.8)", // Glowing effect
            }}
            animate={{
              opacity: [0.3, 1, 0.3], // Fades in and out
              scale: [1, 1.5, 1], // Slightly enlarges
            }}
            transition={{
              duration: 2 + Math.random() * 3, // Random duration
              repeat: Infinity,
              delay: randomDelay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};

export default Twinkling;