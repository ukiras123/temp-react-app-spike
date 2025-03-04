import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Stage, Layer, Line, Circle } from 'react-konva';

const VideoPolygonEditor = ({ editingZone, onZoneChanged, codeName }) => {
  // Assume camera resolution is fixed as 1280x720.
  const cameraResolution = { width: 1280, height: 720 };

  // State similar to Vue’s data.
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [points, setPoints] = useState([]); // holds [x1, y1, x2, y2, …]
  const [isDrawing, setIsDrawing] = useState(false);
  const [curr, setCurr] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState({ isSelected: false });
  const [selectedPointIndex, setSelectedPointIndex] = useState(null); // index for x coordinate; y is index+1
  const [highlightCircle, setHighlightCircle] = useState({ x: 0, y: 0, radius: 10, fill: '#e55353' });

  console.log("points", points);
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const containerRef = useRef(null);

  // Make sure the stage fills the container.
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // When editingZone changes, transform its camera coordinates to stage coordinates.
  useEffect(() => {
    if (editingZone && editingZone.coordinates) {
      const mappedPoints = [];
      editingZone.coordinates.forEach(point => {
        const vX = transformCoordinates(point[0], 0, cameraResolution, stageSize);
        const vY = transformCoordinates(point[1], 1, cameraResolution, stageSize);
        mappedPoints.push(vX, vY);
      });
      setPoints(mappedPoints);
    }
  }, [editingZone, stageSize]);

  // Transformation function: same as Vue's method.
  const transformCoordinates = (coordinate, index, fromRes, toRes) => {
    if (index % 2 === 0) {
      // x coordinate.
      return (coordinate * toRes.width) / fromRes.width;
    } else {
      // y coordinate.
      return (coordinate * toRes.height) / fromRes.height;
    }
  };

  // Convert a flat list to a two-dimensional array (for zone updating).
  const listToTwoDimensionalList = (list, elementsPerSubArray) => {
    const matrix = [];
    for (let i = 0; i < list.length; i += elementsPerSubArray) {
      matrix.push(list.slice(i, i + elementsPerSubArray));
    }
    return matrix;
  };

  // Checks if point (x, y) is within a circle of radius 'rad' centered at (circle_x, circle_y)
  const isInside = (circle_x, circle_y, rad, x, y) => {
    return (x - circle_x) ** 2 + (y - circle_y) ** 2 <= rad * rad;
  };

  // Updates the editing zone by transforming the stage (UI) coordinates back to camera coordinates.
  const updatePointsForEditingZone = () => {
    const transformedPoints = points.map((point, index) =>
      transformCoordinates(point, index, stageSize, cameraResolution)
    );
    const twoDimensionalList = listToTwoDimensionalList(transformedPoints, 2);
    if (onZoneChanged) {
      onZoneChanged(twoDimensionalList);
    }
    // You can also add additional logic to recheck polygon attributes (e.g. intersections) here.
  };

  // Replicates Vue's handleStageMouseDown.
  const handleStageMouseDown = (e) => {
    setIsDrawing(true);
    const pointerPos = stageRef.current.getPointerPosition();
    if (!pointerPos) return;
    setCurr({ x: pointerPos.x, y: pointerPos.y });

    let foundPointClose = false;
    // Loop over existing points like Vue's "for (let index = 0; index < line.getNode().points().length - 1; index++)"
    for (let index = 0; index < points.length; index += 2) {
      const px = points[index];
      const py = points[index + 1];
      if (isInside(px, py, 25, pointerPos.x, pointerPos.y)) {
        setHighlightCircle({ ...highlightCircle, x: px, y: py });
        setSelectedPointIndex(index);
        setSelected({ isSelected: true });
        foundPointClose = true;
        break;
      }
    }
    if (!foundPointClose) {
      // Add a new point.
      setPoints(prev => [...prev, pointerPos.x, pointerPos.y]);
      setSelected({ isSelected: false });
    }
    // Update the external zone (similar to Vue's updatePointsForEditingZone call).
    setTimeout(updatePointsForEditingZone, 0);
  };

  // Replicates Vue's handleMouseMove.
  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const pointerPos = stageRef.current.getPointerPosition();
    if (!pointerPos) return;
    setCurr({ x: pointerPos.x, y: pointerPos.y });
    if (selected.isSelected && selectedPointIndex !== null) {
      setPoints(prev => {
        const newPoints = [...prev];
        newPoints[selectedPointIndex] = pointerPos.x;
        newPoints[selectedPointIndex + 1] = pointerPos.y;
        return newPoints;
      });
      setHighlightCircle({ ...highlightCircle, x: pointerPos.x, y: pointerPos.y });
      setTimeout(updatePointsForEditingZone, 0);
    }
  };

  // Replicates Vue's handleMouseUp.
  const handleMouseUp = () => {
    setIsDrawing(false);
    setSelected({ isSelected: false });
    setSelectedPointIndex(null);
  };

  // Compute the list of circles to highlight vertices (like Vue's highlightCircles computed property).
  const highlightCircles = [];
  for (let i = 0; i < points.length; i += 2) {
    highlightCircles.push({
      x: points[i],
      y: points[i + 1],
      radius: 8,
      fill: '#f9b115',
      id: i // key
    });
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Video container */}
      <div style={{ width: '100%', height: '100%' }}>
        <ReactPlayer
          url="https://b-f123ebe5.kinesisvideo.ap-southeast-2.amazonaws.com/hls/v1/getHLSMasterPlaylist.m3u8?SessionToken=CiCzZCBVC9FymmEv3xIuLt-uPFGZmCxRSFXurjbbHx_7NxIQtQ1y21IEJDGoXFouoJEqoxoZ2RLaak4-YrvVSnpr0_N7FcolBfhQ-L9wmyIgHIwGW2VGF1FaG_8m_n9kDqUSqNrZsUcVXHSWHVdbfM8~"
          width="100%"
          height="100%"
          // You could pass codeName here if needed.
        />
      </div>
      {/* Konva overlay */}
      <div
        id="konva-draw"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 10,
          width: stageSize.width,
          height: stageSize.height
        }}
      >
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onMouseDown={handleStageMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer ref={layerRef}>
            <Line
              points={points}
              stroke="rgba(249, 177, 21, 0.65)"
              strokeWidth={3}
              lineCap="round"
              lineJoin="round"
              closed={points.length >= 6} // at least 3 points needed for a closed shape
            />
            {highlightCircles.map(circle => (
              <Circle
                key={circle.id}
                x={circle.x}
                y={circle.y}
                radius={circle.radius}
                fill={circle.fill}
              />
            ))}
            {selected.isSelected && (
              <Circle
                x={highlightCircle.x}
                y={highlightCircle.y}
                radius={10}
                fill="#e55353"
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default VideoPolygonEditor;
