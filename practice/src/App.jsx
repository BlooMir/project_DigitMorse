import { useEffect, useState } from 'react';
import './App.css'
import { MORSE_CODE_DICTIONARY } from './constant/dictionary';

function App() {
  const [input, setInput] = useState(''); // 현재 입력 중인 모스 부호
    const [message, setMessage] = useState(''); // 화면에 표시될 모든 모스 부호
    const [translated, setTranslated] = useState(''); // 번역된 텍스트
    const [lastInputTime, setLastInputTime] = useState(0); // 마지막 입력 시간

    useEffect(() => {
        const translateMorseCode = () => {
            if (input) {
                const translatedText = input.split(' ')
                    .map(symbol => MORSE_CODE_DICTIONARY[symbol] || '?').join('');
                setTranslated(translatedText);
                setMessage(prev => `${prev}${input} / `);
                setInput('');
            }
        };

        if (lastInputTime) {
            const timerId = setTimeout(translateMorseCode, 500);
            return () => clearTimeout(timerId);
        }
    }, [input, lastInputTime]);

    const handleKeyDown = (event) => {
        if (event.code === 'Space' && !event.repeat) {
            event.preventDefault();
            const now = Date.now();
            if (now - lastInputTime > 500 && lastInputTime !== 0) {
                setInput(prev => `${prev} `);
                setMessage(prev => `${prev} `);
            }
            setLastInputTime(now);
        }
    };

    const handleKeyUp = () => {
        const now = Date.now();
        const duration = now - lastInputTime;
        const morseCode = duration < 150 ? '.' : '-';
        setInput(prev => `${prev}${morseCode}`);
        setMessage(prev => `${prev}${morseCode}`);
        setLastInputTime(now);
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [lastInputTime]);

    return (
        <div>
            <p>Press and release the spacebar to enter Morse code:</p>
            <div>Morse Code: {message}</div>
            <div>Translated: {translated}</div>
        </div>
    );
}

export default App
