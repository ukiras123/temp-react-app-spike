import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Circle } from 'react-konva';
import { debounce } from 'lodash';

// A simple map function for coordinate conversions.
const mapValue = (value, in_min, in_max, out_min, out_max) => {
  return ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

const ProximityDetectionDistanceEditor = ({
  proximityDetectionWizzard, // expects { previewImage, image, distance, knownDistance }
  onUpdateDistance // callback: ({coordinates, meterMeasurement}) => void
}) => {
  // Local state that replicates Vue's data()
  const [showPreview, setShowPreview] = useState(true);
  const [points, setPoints] = useState([]); // Points in "real" image coordinates
  const [naturalWidth, setNaturalWidth] = useState(null);
  const [naturalHeight, setNaturalHeight] = useState(null);
  const [stageWidth, setStageWidth] = useState(0);
  const [stageHeight, setStageHeight] = useState(0);
  const [distance, setDistance] = useState(proximityDetectionWizzard.distance || '');

  // Refs for the image element and Konva stage.
  const imageRef = useRef(null);
  const stageRef = useRef(null);

  // Called when the source image loads or when the window is resized.
  const init = () => {
    if (imageRef.current) {
      const { clientWidth, clientHeight, naturalWidth, naturalHeight } = imageRef.current;
      setStageWidth(clientWidth);
      setStageHeight(clientHeight);
      setNaturalWidth(naturalWidth);
      setNaturalHeight(naturalHeight);
    }
  };

  useEffect(() => {
    // Add a debounced resize event listener.
    const handleResize = debounce(() => {
      init();
    }, 50);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      // Cleanup any external state here if needed.
    };
  }, []);

  // Convert "real" image coordinates to canvas (stage) coordinates.
  const transformFromReal = (p) => {
    if (!naturalWidth || !naturalHeight || !stageWidth || !stageHeight) return p;
    return {
      x: mapValue(p.x, 0, naturalWidth, 0, stageWidth),
      y: mapValue(p.y, 0, naturalHeight, 0, stageHeight),
    };
  };

  // Convert canvas (stage) coordinates back to the real image coordinates.
  const transformToReal = (p) => {
    if (!naturalWidth || !naturalHeight || !stageWidth || !stageHeight) return p;
    return {
      x: mapValue(p.x, 0, stageWidth, 0, naturalWidth),
      y: mapValue(p.y, 0, stageHeight, 0, naturalHeight),
    };
  };

  // Update the known distance (coordinates and meter value) if exactly two points exist.
  const updateKnownDistanceCoordinates = (pts = points) => {
    if (pts.length === 2 && onUpdateDistance) {
      onUpdateDistance({
        coordinates: pts.map(p => [p.x, p.y]),
        meterMeasurement: distance ? parseFloat(parseFloat(distance).toFixed(4)) : null,
      });
    }
  };

  // When dragging a circle, update its corresponding point.
  const onAnchorMove = (index, e) => {
    const pos = { x: e.target.x(), y: e.target.y() };
    const updatedPoint = transformToReal(pos);
    setPoints((prev) => {
      const newPoints = [...prev];
      newPoints[index] = updatedPoint;
      updateKnownDistanceCoordinates(newPoints);
      return newPoints;
    });
  };

  // When dragging ends, update the distance coordinates.
  const onAnchorReleased = () => {
    updateKnownDistanceCoordinates();
  };

  // Handle clicks on the stage to add new anchor points.
  const onAdd = (e) => {
    // Ignore clicks if a circle was clicked.
    if (e.target && e.target.getClassName() === 'Circle') return;
    const stage = stageRef.current;
    if (!stage) return;
    const pointerPosition = stage.getPointerPosition();
    if (pointerPosition) {
      const newPoint = transformToReal(pointerPosition);
      setPoints((prev) => {
        const newPoints = [...prev, newPoint];
        if (newPoints.length > 2) {
          newPoints.shift();
        }
        updateKnownDistanceCoordinates(newPoints);
        return newPoints;
      });
    }
  };

  const handleDistanceChange = (e) => {
    const value = e.target.value;
    setDistance(value);
    if (points.length === 2 && onUpdateDistance) {
      onUpdateDistance({
        coordinates: points.map(p => [p.x, p.y]),
        meterMeasurement: value ? parseFloat(parseFloat(value).toFixed(4)) : null,
      });
    }
  };

  return (
    <div className="flex flex-wrap">
      {/* Left Column */}
      <div className="w-full lg:w-8/12">
        <div className="relative">
          {showPreview && (
            <div className="absolute overflow-hidden w-[20%] transform translate-x-4 translate-y-4 rounded shadow-lg">
              <span
                className="absolute font-bold p-2 text-xs text-primary"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.80)', top: 0, left: 0 }}
              >
                SELECTED AREA
              </span>
              <img
                src={`data:image/png;base64,${proximityDetectionWizzard.previewImage}`}
                alt="preview"
                style={{ maxWidth: '100%' }}
              />
            </div>
          )}
          <img
            ref={imageRef}
            src={`data:image/png;base64,${proximityDetectionWizzard.image}`}
            alt="source"
            className="w-full"
            onLoad={init}
          />
          <Stage
            ref={stageRef}
            width={stageWidth}
            height={stageHeight}
            onClick={onAdd}
            className="absolute top-0 left-0"
          >
            <Layer>
              <Line
                points={points
                  .map(transformFromReal)
                  .flatMap((p) => [p.x, p.y])}
                stroke="rgb(249, 177, 21)"
                strokeWidth={4}
              />
              {points.map((p, index) => {
                const pos = transformFromReal(p);
                return (
                  <Circle
                    key={index}
                    x={pos.x}
                    y={pos.y}
                    radius={6}
                    fill="rgb(249, 177, 21)"
                    draggable
                    onDragMove={(e) => onAnchorMove(index, e)}
                    onDragEnd={onAnchorReleased}
                  />
                );
              })}
            </Layer>
          </Stage>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-4/12 mt-4 lg:mt-0">
        <div className="mb-2">
          <b>Settings</b>
        </div>
        <div>
          {/* Card for controls */}
          <div className="border rounded p-4 mb-4">
            <div className="mb-2">
              <p className="mb-1 text-sm">Show selected area</p>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPreview}
                  onChange={(e) => setShowPreview(e.target.checked)}
                  className="form-switch"
                />
                <span className="ml-2">Toggle</span>
              </label>
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">Distance</label>
              <div className="flex items-center">
                <input
                  type="number"
                  step="0.1"
                  value={distance}
                  onChange={handleDistanceChange}
                  disabled={points.length !== 2}
                  className="border rounded p-2 max-w-[12rem]"
                />
                <span className="ml-2">Meter</span>
              </div>
            </div>
            {points.length !== 2 && (
              <span className="text-sm text-gray-500">
                To enter a distance you must mark two points by clicking on the image above
              </span>
            )}
          </div>
          {/* Info Card */}
          <div className="border rounded p-4 mt-4">
            <div className="flex justify-between items-center">
              {/* Replace this with your preferred icon */}
              <i className="text-blue-500 text-xl">i</i>
            </div>
            <p className="mt-3">
              Please draw a known distance so that the distance between points can be calculated without manipulating depth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProximityDetectionDistanceEditor;
