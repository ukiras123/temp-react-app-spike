import React from 'react';
import './index.css'; // Ensure TailwindCSS is imported here
import TrapazoidAnnotator from './TrapazoidAnnotator';
import VideoAnnotator from './VideoAnnotator';


export default function App() {
  return (
    <div className="min-h-screen">
      <VideoAnnotator codeName="sample" />
      <TrapazoidAnnotator codeName="sample" />
    </div>
  );
}
