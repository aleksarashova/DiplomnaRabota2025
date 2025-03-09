import React, { useState, useEffect, useRef } from 'react';
import './timer.css';

import * as Tone from "tone";

import TimerEndedMessage from "../../../popups/messages/timerEndedMessage";

const RecipeTimer: React.FC = () => {
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning && (hours > 0 || minutes > 0 || seconds > 0)) {
            timerRef.current = setInterval(() => {
                setSeconds((prevSeconds) => {
                    if (prevSeconds > 0) return prevSeconds - 1;
                    if (minutes > 0) {
                        setMinutes((prevMinutes) => prevMinutes - 1);
                        return 59;
                    }
                    if (hours > 0) {
                        setHours((prevHours) => prevHours - 1);
                        setMinutes(59);
                        return 59;
                    }
                    return 0;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        }
    }, [isRunning, hours, minutes, seconds]);

    useEffect(() => {
        if (isRunning && hours === 0 && minutes === 0 && seconds === 0) {
            setIsRunning(false);
            setIsTimeUp(true);
            playSound();
        }
    }, [hours, minutes, seconds, isRunning]);

    const startTimer = (): void => {
        if (hours > 0 || minutes > 0 || seconds > 0) {
            setIsRunning(true);
        }
    }

    const stopTimer = (): void => {
        setIsRunning(false);
    }

    const resetTimer = (): void => {
        stopTimer();
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        setIsTimeUp(false);
    }

    const playSound = async () => {
        await Tone.start();
        const synth = new Tone.Synth({
            oscillator: { type: "sine" },
            envelope: { attack: 0.01, decay: 0.5, sustain: 0.1, release: 0.5 }
        }).toDestination();

        const now = Tone.now();

        synth.triggerAttackRelease("C5", "0.3", now);
        synth.triggerAttackRelease("E5", "0.3", now + 0.3);
        synth.triggerAttackRelease("G5", "0.4", now + 0.6);

        setTimeout(() => {
            synth.triggerAttackRelease("C5", "0.3", now + 2);
            synth.triggerAttackRelease("E5", "0.3", now + 2.3);
            synth.triggerAttackRelease("G5", "0.4", now + 2.6);
        }, 2000);
    }

    const handleCloseMessage = (): void => {
        setIsTimeUp(false);
    }

    return (
        <div className="timer-container">
            <div className="timer-inputs">
                <input type="number" className="timer-input" min="0" value={hours} onChange={(e) => setHours(Number(e.target.value))} />h
                <input type="number" className="timer-input" min="0" max="59" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />m
                <input type="number" className="timer-input" min="0" max="59" value={seconds} onChange={(e) => setSeconds(Number(e.target.value))} />s
            </div>
            <div className="timer-buttons">
                <button className="timer-button" onClick={startTimer} disabled={isRunning}>Start</button>
                <button className="timer-button" onClick={stopTimer} disabled={!isRunning}>Stop</button>
                <button className="timer-button" onClick={resetTimer}>Reset</button>
            </div>
            <h2 className="timer-display">
                {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </h2>

            {isTimeUp &&
                <TimerEndedMessage handleCloseMessage={handleCloseMessage} />
            }
        </div>
    );

}

export default RecipeTimer;
