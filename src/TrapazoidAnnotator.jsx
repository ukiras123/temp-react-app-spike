import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { Stage, Layer, Line, Circle } from 'react-konva';

const TrapazoidAnnotator = () => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  // Dimensions for our video/Konva stage.
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  // Points stored as [x, y] for: top-left, top-right, bottom-right, bottom-left.
  const [points, setPoints] = useState([]);
  const [activeAnchor, setActiveAnchor] = useState(null);
  // Rotation mode: 0 = horizontal (top/bottom anchors linked by y), 1 = vertical (left/right anchors linked by x)
  const [rotation, setRotation] = useState(0);

  // Default coordinates for horizontal mode.
  const getDefaultPointsHorizontal = useCallback((w, h) => [
    [w * 0.25, h * 0.25], // top-left
    [w * 0.75, h * 0.25], // top-right
    [w * 0.9,  h * 0.75], // bottom-right
    [w * 0.1,  h * 0.75], // bottom-left
  ], []);

  // Default coordinates for vertical mode.
  const getDefaultPointsVertical = useCallback((w, h) => [
    [w * 0.25, h * 0.1],  // top-left (x fixed)
    [w * 0.50, h * 0.3],  // top-right (x fixed)
    [w * 0.50, h * 0.7],  // bottom-right (x fixed)
    [w * 0.25, h * 0.9],  // bottom-left (x fixed)
  ], []);

  // When the video is ready, set dimensions and default points.
  const onVideoReady = () => {
    if (playerRef.current) {
      const internalPlayer = playerRef.current.getInternalPlayer();
      if (internalPlayer.videoWidth && internalPlayer.videoHeight) {
        const width = internalPlayer.videoWidth;
        const height = internalPlayer.videoHeight;
        setDimensions({ width, height });
        // Set initial points based on current rotation mode.
        setPoints(
          rotation === 0
            ? getDefaultPointsHorizontal(width, height)
            : getDefaultPointsVertical(width, height)
        );
      }
    }
  };

  // Update stage dimensions when container resizes.
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current && dimensions.width) {
        const { clientWidth } = containerRef.current;
        const scale = clientWidth / dimensions.width;
        setDimensions(dim => ({
          width: dim.width * scale,
          height: dim.height * scale,
        }));
      }
    };

    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [dimensions.width]);

  // When dragging an anchor, update its coordinate and adjust its paired anchor.
  const handleDragMove = (index, e) => {
    const newPoints = [...points];
    const { x, y } = e.target.position();
    newPoints[index] = [x, y];

    if (rotation === 0) {
      // In horizontal mode, top anchors (0 & 1) share y; bottom anchors (2 & 3) share y.
      if (index === 0) newPoints[1] = [newPoints[1][0], y];
      else if (index === 1) newPoints[0] = [newPoints[0][0], y];
      else if (index === 2) newPoints[3] = [newPoints[3][0], y];
      else if (index === 3) newPoints[2] = [newPoints[2][0], y];
    } else {
      // In vertical mode, left anchors (0 & 3) share x; right anchors (1 & 2) share x.
      if (index === 0) newPoints[3] = [x, newPoints[3][1]];
      else if (index === 3) newPoints[0] = [x, newPoints[0][1]];
      else if (index === 1) newPoints[2] = [x, newPoints[2][1]];
      else if (index === 2) newPoints[1] = [x, newPoints[1][1]];
    }

    setPoints(newPoints);
  };

  // Toggle rotation mode and update default coordinates visibly.
  const toggleRotation = () => {
    const newRotation = rotation === 0 ? 1 : 0;
    setRotation(newRotation);
    if (playerRef.current) {
      const internalPlayer = playerRef.current.getInternalPlayer();
      if (internalPlayer.videoWidth && internalPlayer.videoHeight) {
        const w = internalPlayer.videoWidth;
        const h = internalPlayer.videoHeight;
        // Update points based on new rotation mode.
        setPoints(
          newRotation === 0
            ? getDefaultPointsHorizontal(w, h)
            : getDefaultPointsVertical(w, h)
        );
      }
    }
  };

  // Flatten points for the Konva Line.
  const flatPoints = points.flat();

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Video with Konva overlay */}
      <div className="w-full lg:w-3/4 relative" ref={containerRef}>
        <ReactPlayer
          ref={playerRef}
          url="https://www.w3schools.com/html/mov_bbb.mp4"
          width="100%"
          height="auto"
          onReady={onVideoReady}
          playing
          muted
        />
        {dimensions.width > 0 && (
          <Stage
            width={dimensions.width}
            height={dimensions.height}
            className="absolute top-0 left-0"
          >
            <Layer>
              <Line points={flatPoints} fill="rgba(249, 177, 21, 0.65)" closed />
              {points.map((point, index) => (
                <Circle
                  key={index}
                  x={point[0]}
                  y={point[1]}
                  radius={activeAnchor === index ? 10 : 8}
                  fill={activeAnchor === index ? '#e55353' : 'rgb(249, 177, 21)'}
                  draggable
                  onDragStart={() => setActiveAnchor(index)}
                  onDragMove={(e) => handleDragMove(index, e)}
                  onDragEnd={() => setActiveAnchor(null)}
                />
              ))}
            </Layer>
          </Stage>
        )}
      </div>

      {/* Settings Panel */}
      <div className="w-full lg:w-1/4 p-4">
        <h2 className="text-lg font-bold mb-4">Area Settings</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Threshold (Meter)
          </label>
          <input
            type="number"
            step="0.1"
            className="w-full border rounded p-2"
            // Add your threshold state/logic here if needed.
          />
          <p className="text-xs text-gray-500 mt-1">
            The minimum distance people & vehicles can be detected together before a breach is raised.
          </p>
        </div>
        <button
          onClick={toggleRotation}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Rotate to {rotation === 0 ? 'Vertical' : 'Horizontal'}
        </button>
      </div>
    </div>
  );
};

export default TrapazoidAnnotator;
