import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

const WaveSurferComponent = ({ audioFile }) => {
  const waveformRef = useRef(null);
  const wavesurferInstance = useRef(null);

  useEffect(() => {
    wavesurferInstance.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'violet',
      progressColor: 'purple',
      height: 100,
      barWidth: 1,
      barRadius: 2,
      cursorWidth: 1,
      cursorColor: '#333',
    });

    wavesurferInstance.current.load(audioFile);

    return () => {
      wavesurferInstance.current.destroy();
    };
  }, [audioFile]);

  const handlePlay = () => {
    if (wavesurferInstance.current) {
      wavesurferInstance.current.play();
    }
  };

  const handlePause = () => {
    if (wavesurferInstance.current) {
      wavesurferInstance.current.pause();
    }
  };

  return (
    <div>
      <div ref={waveformRef} />
      <div style={{ display: 'flex', justifyContent: 'center', gap:'10px', paddingBottom:'10px' }}>
        <button onClick={handlePlay} style={{ padding: '8px' }}>
          <FontAwesomeIcon icon={faPlay} color='purple'/>
        </button>
        <button onClick={handlePause} style={{ padding: '8px' }}>
          <FontAwesomeIcon icon={faPause} color='purple'/>
        </button>
      </div>
    </div>
  );
};

export default WaveSurferComponent;
