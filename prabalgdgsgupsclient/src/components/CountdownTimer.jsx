import { useState, useEffect } from 'react';

const CountdownTimer = () => {
  // Target date: April 13, 2025 at 12:45 PM
  const targetDate = new Date('April 13, 2025 12:45:00').getTime();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setIsExpired(true);
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="max-w mx-auto p-6  rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-white">
        The Ultimate Hackathon Journey Begins!
      </h2>
      
      {isExpired ? (
        <div className="text-center text-3xl font-bold text-green-600 py-8">
          The time has arrived!
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className=" p-4 rounded-lg">
            <div className="text-4xl font-bold text-blue-600">{timeLeft.days}</div>
            <div className="text-sm text-white mt-1">Days</div>
          </div>
          <div className="p-4 rounded-lg">
            <div className="text-4xl font-bold text-blue-600">{timeLeft.hours}</div>
            <div className="text-sm text-white mt-1">Hours</div>
          </div>
          <div className="p-4 rounded-lg">
            <div className="text-4xl font-bold text-blue-600">{timeLeft.minutes}</div>
            <div className="text-sm text-white mt-1">Minutes</div>
          </div>
          <div className="p-4 rounded-lg">
            <div className="text-4xl font-bold text-blue-600">{timeLeft.seconds}</div>
            <div className="text-sm text-white mt-1">Seconds</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;