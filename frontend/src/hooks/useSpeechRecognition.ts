import { useState, useCallback, useEffect } from "react";

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const [recordingTimeout, setRecordingTimeout] =
    useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const instance = new SpeechRecognition();
      instance.continuous = true;
      instance.interimResults = false;
      instance.lang = "en-US";

      let finalTranscript = "";

      instance.onstart = () => {
        setIsListening(true);
        finalTranscript = ""; // Reset transcript at start
      };

      instance.onend = () => {
        setIsListening(false);
        setTranscript(finalTranscript);
      };

      instance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join("");

        setTranscript(transcript);
      };

      setRecognition(instance);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (recordingTimeout) {
        clearTimeout(recordingTimeout);
        recognition.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        setTranscript("");
        recognition.start();

        const timeout = setTimeout(() => {
          if (recognition) {
            recognition.stop();
          }
        }, 60000); // 60 seconds

        setRecordingTimeout(timeout);
      } catch (error) {
        if ((error as any).message === "Already recording") {
          recognition.stop();
          setTimeout(() => recognition.start(), 100);
        }
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setTranscript("");
    }
  }, [recognition]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
  };
};
