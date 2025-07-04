import React, { useEffect, useState } from 'react';

function BlobToVideo({ blob }) {
  const [videoUrl, setVideoUrl] = useState(null);
  useEffect(() => {
    let url = null;
    async function convertBlobToVideo() {
      const ffmpeg = (await import('ffmpeg.js/ffmpeg-mp4')).default;
      const data = await blob.arrayBuffer();
      const result = await ffmpeg({
        MEMFS: [{ name: 'input.mp4', data }],
        arguments: ['-i', 'input.mp4', 'output.webm'],
      });
      const videoBlob = new Blob([result.MEMFS[0].data], { type: 'video/webm' });
      url = URL.createObjectURL(videoBlob);
      setVideoUrl(url);
    }
    convertBlobToVideo();
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [blob]);

  return (
    <video controls>
      <source src={videoUrl} type="video/webm" />
    </video>
  );
}