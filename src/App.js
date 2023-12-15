import React, { useState, useEffect, useRef } from 'react';
import VideoJS from './videoComponent';
import videojs from 'video.js';
import WaveSurfer from 'wavesurfer.js';
import WaveSurferComponent from './Wavesurfer';
import './App.css';

const App = () => {
  const playerRef = useRef(null);
  const waveformRef = useRef(null);
  const [videoFilePath, setVideoFilePath] = useState(null);
  const [videoMetadata, setVideoMetadata] = useState(null);
  const [waveSurfer, setWaveSurfer] = useState(null);
  const [audioFilePath, setAudioFilePath] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');



  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoFilePath
          ? videoFilePath
          : 'http://techslides.com/demos/sample-videos/small.mp4',
        type: 'video/mp4',
      },
    ],
  };



  const handleVideoUpload = (event) => {
    const videoFile = event.target.files[0];
    
    const fileName = videoFile.name;
    setVideoFilePath(URL.createObjectURL(videoFile));
    setVideoFilePath(URL.createObjectURL(videoFile));
    setVideoTitle(fileName);
  
    const video = document.createElement('video');
    video.src = URL.createObjectURL(videoFile);
    video.addEventListener('loadedmetadata', () => {
      const audioTrack = video.captureStream().getAudioTracks()[0];
  
      if (!audioTrack) {
        alert('Video does not contain audio. Please upload a video with audio.');
        setVideoFilePath(null);
        setVideoMetadata(null);
        setAudioFilePath(null);
        return;
      }
  
      const audioBlob = new Blob([audioTrack], { type: 'audio/mp4' });
      setAudioFilePath(URL.createObjectURL(audioBlob));
  
      // Retrieve and set video metadata, gotta figure out which ones more can be added
      const duration = video.duration;
      const width = video.videoWidth;
      const height = video.videoHeight;
      let codec = 'Unknown';
      let tracks = [];
  
      if (video.currentSrc) {
        const mime = video.currentSrc.split('.').pop();
        if (mime) {
          const canPlay = video.canPlayType(`video/${mime}`);
          if (canPlay === 'probably' || canPlay === 'maybe') {
            codec = mime;
          }
        }
      }
  
      if (video.textTracks && video.textTracks.length > 0) {
        tracks = Array.from(video.textTracks).map((track) => ({
          kind: track.kind,
          label: track.label,
          language: track.language,
        }));
      }
  
      setVideoMetadata({
        duration,
        width,
        height,
        codec,
        tracks,
      });
    });


//wavesurfer 

    if (waveformRef.current){
      const wavesurferInstance = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'violet',
      progressColor: 'purple',
      height: 100,
      barWidth: 1,
      barRadius: 2,
      cursorWidth: 1,
      cursorColor: '#333',
    });

    setWaveSurfer(wavesurferInstance);


    if (videoFilePath) {
      wavesurferInstance.load(videoFilePath);
    }
  }else {
    console.error('waveform container not found');
  }
  };

  useEffect(() => {
    if (waveSurfer && videoFilePath) {
      waveSurfer.on('ready', () => {
        waveSurfer.setVolume(0.5);
        waveSurfer.play();
      });
    }
  }, [waveSurfer, videoFilePath]);

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  const handleAudioUpload = (event) => {
    setAudioFilePath(URL.createObjectURL(event.target.files[0]));
  };




  return (
    <>
    <div style={{ backgroundColor: '#FFEBEE' }}>
      <div className='title'>Vidyo <span role="img" aria-label="movie reel">🎞️</span> Player</div>
      <div className='subtitle'>Upload your video <span role="img" aria-label="video camera">📹</span> and audio files <span role="img" aria-label="musical note">🎵</span> and view the deets (Metadata) <span role="img" aria-label="detective (male)">🕵️‍♂️</span></div>
      <div className='video-upload'>
        <input type="file" name="File Input" onChange={handleVideoUpload} />
        </div>
        <div className='video-name'>  
          {videoTitle ? `Now Playing:  ${videoTitle}` : ''}
        </div>
      <div className="video-metadata">
        {videoMetadata && (
          <div className="metadata-box">
            <h3>Video Metadata</h3>
            <p>Duration: {videoMetadata.duration.toFixed(2)} seconds</p>
            <p>Dimensions: {videoMetadata.width}x{videoMetadata.height}</p>
            <p>Codec: {videoMetadata.codec}</p>
            <p>Tracks:</p>
            <ul>
              {videoMetadata.tracks.map((track, index) => (
                <li key={index}>
                  Kind: {track.kind}, Label: {track.label}, Language: {track.language}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="video-upload">
        <div className="video-container" >
          <div className="video-wrapper">
            <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
          </div>
          <div className='audio-text'>Upload your audio</div>
          <div>
            <div className='audio-upload'><input type="file" onChange={handleAudioUpload} />
            {audioFilePath && <WaveSurferComponent audioFile={audioFilePath}  />}</div>
          </div>
        </div>
        {audioFilePath && (
          <div className="waveform-container" ref={waveformRef}>
          </div>
        )}
      </div>
      <footer style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fff' }}>
          Made with love <span role="img" aria-label="heart">❤️</span> for vidyo.ai
        </footer>
      </div>
    </>
  
  );
};

export default App;