import { Fragment, useRef, useState, useEffect } from "react";
import { cl } from "../../utils/misc";
import { IconButton } from "./Button";
import { useStopwatch } from "react-timer-hook";

async function getStream() {
  try {
    console.log("getting media stream");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

    return await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const AudioRecord = ({ audio, setAudio, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const chunksRef = useRef([]);
  const streamRef = useState(null);
  const mediaRecorderRef = useRef(null);

  const timerControls = useStopwatch({ autoStart: false });

  async function startRecording() {
    if (disabled) return;
    if (!mediaRecorderRef.current) {
      const stream = await getStream();
      if (!stream) return;
      const newMediaStream = new MediaRecorder(stream, {});
      streamRef.current = stream;
      mediaRecorderRef.current = newMediaStream;
      return startRecording();
    }

    mediaRecorderRef.current.start();
    mediaRecorderRef.current.ondataavailable = e => {
      chunksRef.current.push(e.data);
    };
    mediaRecorderRef.current.onstop = handleDone;

    setIsRecording(true);
    timerControls.start();
  }

  function handleDone(e) {
    const blob = new Blob(chunksRef.current, { type: "audio/wav; codecs=opus" });
    chunksRef.current = [];
    setAudio(blob);
    setIsRecording(false);
    timerControls.reset(undefined, false);
  }

  function stopRecording() {
    if (!mediaRecorderRef.current) throw new Error(`No media recorder`);
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current = null;
    streamRef.current?.getTracks().forEach(track => {
      track.stop();
      streamRef.current.removeTrack(track);
    });
  }

  function clearRecording() {
    setAudio(null);
  }

  return (
    <div className={cl(
      "w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white min-h-[42px]",
      { "opacity-50 pointer-events-none": disabled }
    )}>
      {!audio && !isRecording && (
        <>
          <IconButton
            icon="microphone"
            iconColor="red"
            onClick={startRecording}
            disabled={disabled}
          />
          <span className="text-gray-500 text-sm">Click to start recording</span>
        </>
      )}

      {isRecording && (
        <>
          <IconButton icon="stop" iconColor="red" onClick={stopRecording} />
          <span className="text-red-500 font-medium">
            {timerControls.minutes}:{timerControls.seconds < 10 && "0"}
            {timerControls.seconds}
          </span>
        </>
      )}

      {audio && !isRecording && (
        <div className="flex items-center gap-2 w-full">
          <IconButton icon="trash" iconColor="red" onClick={clearRecording} />
          <audio src={URL.createObjectURL(audio)} controls className="flex-1 h-8" />
        </div>
      )}
    </div>
  );
};
