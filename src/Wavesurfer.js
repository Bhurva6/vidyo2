import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faBackward } from '@fortawesome/free-solid-svg-icons';

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

  const handleFastForward = () => {
    if (wavesurferInstance.current) {
      const currentPosition = wavesurferInstance.current.getCurrentTime();
      wavesurferInstance.current.seekTo(currentPosition + 5); 
    }
  };

  const handleBackward = () => {
    if (wavesurferInstance.current) {
      const currentPosition = wavesurferInstance.current.getCurrentTime();
      wavesurferInstance.current.seekTo(currentPosition - 5); // Go backward by 5 seconds (adjust as needed)
    }
  };

  return (
    
    <div>
      
      
      <div ref={waveformRef} />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', paddingBottom: '10px' }}>
        
        {/* Backward Button */}
        
        <div onClick={handleBackward} style={{ cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faBackward} color='purple' size='lg' /> {/* Adjust the size here */}
        </div>
        {/* Play Button */}
        <div onClick={handlePlay} style={{ cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faPlay} color='purple' size='2x' />
        </div>
        {/* Pause Button */}
        <div onClick={handlePause} style={{ cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faPause} color='purple' size='2x' />
        </div>
        
        {/* Fast Forward Button */}
        <div onClick={handleFastForward} style={{ cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faForward} color='purple' size='lg' /> {/* Adjust the size here */}
        </div>
      </div>
    </div>
   
  );
};

export default WaveSurferComponent;
