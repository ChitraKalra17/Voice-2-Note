import { useState, useRef, useCallback, useEffect } from 'react';

const useSpeechRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [language, setLanguage] = useState('en-US');
    const [error, setError] = useState(null);
    const [isSupported, setIsSupported] = useState(true);
    const recognitionRef = useRef(null);

    const languages = {
        'en-US': 'English',
        'hi-IN': 'Hindi',
        'es-ES': 'Spanish',
        'fr-FR': 'French',
        'de-DE': 'German',
    };

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            setIsSupported(false);
            setError('Speech Recognition API is not supported in your browser');
            return;
        }

        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognition.onresult = (event) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    final += transcript + ' ';
                } else {
                    interim += transcript;
                }
            }

            setInterimTranscript(interim);
            setTranscript((prev) => prev + final);
        };

        recognition.onerror = (event) => {
            setError(`Error: ${event.error}`);
        };

        recognition.onend = () => {
            setIsListening(false);
            setInterimTranscript('');
        };

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, []);

    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = language;
        }
    }, [language]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            setTranscript('');
            setInterimTranscript('');
            recognitionRef.current.start();
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    }, [isListening]);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setInterimTranscript('');
    }, []);

    return {
        transcript,
        interimTranscript,
        isListening,
        language,
        setLanguage,
        languages,
        error,
        isSupported,
        startListening,
        stopListening,
        resetTranscript,
    };
};

export default useSpeechRecognition;