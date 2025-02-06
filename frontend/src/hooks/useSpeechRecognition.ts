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
      instance.interimResults = false; // Only get final results
      instance.lang = "en-US";

      let accumulatedTranscript = "";

      instance.onstart = () => {
        setIsListening(true);
        accumulatedTranscript = ""; // Reset accumulated transcript at start
        setTranscript(""); // Clear displayed transcript
      };

      instance.onend = () => {
        setIsListening(false);
        setTranscript(accumulatedTranscript.trim()); // Set final transcript when done
      };

      instance.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            accumulatedTranscript += event.results[i][0].transcript + " ";
          }
        }
      };

      setRecognition(instance);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (recordingTimeout) {
        clearTimeout(recordingTimeout);
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.start();

        // Set timeout to stop after 60 seconds
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
      if (recordingTimeout) {
        clearTimeout(recordingTimeout);
        setRecordingTimeout(null);
      }
    }
  }, [recognition, recordingTimeout]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
  };
};
