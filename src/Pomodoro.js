import React, { useState, useEffect } from 'react';

const Pomodoro = () => {
  const SCENES = {
    WORK: 'WORK',
    BREAK_SHORT: 'BREAK_SHORT',
    BREAK_LONG: 'BREAK_LONG'
  };

  const [activeScene, setActiveScene] = useState(SCENES.WORK);
  const [timers, setTimers] = useState({
    [SCENES.WORK]: { minutes: 25, seconds: 0 },
    [SCENES.BREAK_SHORT]: { minutes: 5, seconds: 0 },
    [SCENES.BREAK_LONG]: { minutes: 10, seconds: 0 }
  });
  const [isActive, setIsActive] = useState(false);

  const showNotification = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          new Notification('Pomodoro Timer', {
            body: 'Timer has finished!',
            // You can customize the icon URL
            icon: 'https://example.com/icon.png'
          });
        }
      });
    }
  };

  useEffect(() => {
    let intervalId;

    if (isActive) {
      intervalId = setInterval(() => {
        setTimers(prevTimers => {
          const currentTimer = prevTimers[activeScene];
          if (currentTimer.seconds > 0) {
            return {
              ...prevTimers,
              [activeScene]: {
                minutes: currentTimer.minutes,
                seconds: currentTimer.seconds - 1
              }
            };
          } else if (currentTimer.minutes > 0) {
            return {
              ...prevTimers,
              [activeScene]: {
                minutes: currentTimer.minutes - 1,
                seconds: 59
              }
            };
          } else {
            clearInterval(intervalId);
            setIsActive(false);
            showNotification(); // Call the showNotification function when the timer finishes
            return prevTimers;
          }
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive, activeScene]);

  const startTimer = () => {
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimers({
      ...timers,
      [activeScene]: {
        minutes: activeScene === SCENES.WORK ? 25 : activeScene === SCENES.BREAK_SHORT ? 5 : 10,
        seconds: 0
      }
    });
  };

  const switchScene = (scene) => {
    setActiveScene(scene);
    resetTimer();
  };

  return (
    <div>
      <button className="pomodoro-btn" onClick={() => switchScene(SCENES.WORK)}>Pomodoro</button>
      <button className="pomodoro-btn" onClick={() => switchScene(SCENES.BREAK_LONG)}>Long Break</button>
      <button className="pomodoro-btn" onClick={() => switchScene(SCENES.BREAK_SHORT)}>Short Break</button>
      <h1>{`${timers[activeScene].minutes.toString().padStart(2, '0')}:${timers[activeScene].seconds.toString().padStart(2, '0')}`}</h1>
      <div className="ssr-btn"> 
      <button className="ssr" onClick={startTimer}>Start</button>
      <button className="ssr" onClick={stopTimer}>Stop</button>
      <button className="ssr" onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

export default Pomodoro;
