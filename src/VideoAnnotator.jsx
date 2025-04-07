import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Stage, Layer, Line, Circle } from 'react-konva';
import './index.css'; // Ensure TailwindCSS is imported here
import TrapazoidAnnotator from './TrapazoidAnnotator';

function VideoAnnotator({ codeName }) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 640, height: 360 });
  const [polygon, setPolygon] = useState({
    points: [],
    strokeWidth: 3,
    stroke: 'rgba(249, 177, 21, 0.65)',
    lineCap: 'round',
    lineJoin: 'round',
    fill: 'rgba(249, 177, 21, 0.65)',
    closed: true,
  });
  const [highlightCircle, setHighlightCircle] = useState({
    x: 0,
    y: 0,
    radius: 10,
    fill: '#e55353'
  });
  const [isDraw, setIsDraw] = useState(false);
  const [selected, setSelected] = useState({
    isSelected: false,
    pointIndex: null
  });

  // Update stage size based on the container dimensions
  const updateStageSize = () => {
    if (containerRef.current) {
      setStageSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  };

  useEffect(() => {
    updateStageSize();
    window.addEventListener('resize', updateStageSize);
    return () => window.removeEventListener('resize', updateStageSize);
  }, []);

  const handleStageMouseDown = (e) => {
    const stage = stageRef.current;
    if (!stage) return;
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;
    const { x, y } = pointerPos;

    let foundPoint = false;
    for (let i = 0; i < polygon.points.length; i += 2) {
      const px = polygon.points[i];
      const py = polygon.points[i + 1];
      if ((x - px) ** 2 + (y - py) ** 2 <= 25 ** 2) {
        setHighlightCircle({ x: px, y: py, radius: 10, fill: '#e55353' });
        setSelected({ isSelected: true, pointIndex: i });
        foundPoint = true;
        break;
      }
    }
    if (!foundPoint) {
      setPolygon(prev => ({ ...prev, points: [...prev.points, x, y] }));
      setSelected({ isSelected: false, pointIndex: null });
    }
    setIsDraw(true);
  };

  const handleMouseMove = (e) => {
    if (!isDraw) return;
    const stage = stageRef.current;
    if (!stage) return;
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;
    const { x, y } = pointerPos;
    if (selected.isSelected && selected.pointIndex !== null) {
      setPolygon(prev => {
        const newPoints = [...prev.points];
        newPoints[selected.pointIndex] = x;
        newPoints[selected.pointIndex + 1] = y;
        return { ...prev, points: newPoints };
      });
      setHighlightCircle({ x, y, radius: 10, fill: '#e55353' });
    }
  };

  const handleMouseUp = () => {
    setIsDraw(false);
    setSelected({ isSelected: false, pointIndex: null });
  };

  // Generate circles for highlighting polygon points
  const highlightCircles = [];
  for (let i = 0; i < polygon.points.length; i += 2) {
    highlightCircles.push({
      x: polygon.points[i],
      y: polygon.points[i + 1],
      radius: 8,
      fill: '#f9b115',
      key: i,
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Relative container for both video and canvas */}
      <div ref={containerRef} className="relative w-full h-[500px]">
        {/* Video in an absolute container */}
        <div className="absolute inset-0">
          <ReactPlayer url="./video.mp4" width="100%" height="100%" controls={true} />
        </div>
        {/* Konva Canvas overlay in an absolute container */}
        <div className="absolute inset-0 z-10">
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            onMouseDown={handleStageMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            ref={stageRef}
          >
            <Layer>
              <Line {...polygon} />
              {highlightCircles.map(circle => (
                <Circle {...circle} />
              ))}
              {selected.isSelected && <Circle {...highlightCircle} />}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}

export default VideoAnnotator;