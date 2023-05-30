import React, { useEffect, useRef, useState } from "react";
import Node from "../Node/Node";
import { Vector2D } from "../../redux/modules/nodes";

interface Props {}

function Drawboard({}: Props) {
  const [boxCoords, setBoxCoords] = useState<Vector2D>({
    x: 0,
    y: 0,
  });
  const [boxCoords2, setBoxCoords2] = useState<Vector2D>({
    x: 0,
    y: 0,
  });
  const offSet = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentRef = useRef<string>();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastRenderRef = useRef<number>(Date.now());

  const onDragLastRef = useRef<Vector2D>({ x: 0, y: 0 });

  const isLast = (x: number, y: number) =>
    onDragLastRef.current.x === x && onDragLastRef.current.y === y;

  const handleDrag = (box: string) => (e: React.DragEvent<HTMLDivElement>) => {
    const currentTime = Date.now();
    if (currentTime < lastRenderRef.current + 1000 / 144) return;
    lastRenderRef.current = currentTime;
    if (isLast(e.clientX, e.clientY)) return;
    onDragLastRef.current = { x: e.clientX, y: e.clientY };

    const boxCoordsTemp =
      box === "box1"
        ? { x: e.clientX - offSet.current.x, y: e.clientY - offSet.current.y }
        : boxCoords;
    const boxCoords2Temp =
      box === "box2"
        ? { x: e.clientX - offSet.current.x, y: e.clientY - offSet.current.y }
        : boxCoords2;

    const leftBoxCoords =
      boxCoordsTemp.x < boxCoords2Temp.x ? boxCoordsTemp : boxCoords2Temp;
    const rightBoxCoords =
      boxCoordsTemp.x >= boxCoords2Temp.x ? boxCoordsTemp : boxCoords2Temp;

    const startPoint: Vector2D = {
      x: leftBoxCoords.x + 200,
      y: leftBoxCoords.y + 50,
    };
    const endPoint: Vector2D = {
      x: rightBoxCoords.x,
      y: rightBoxCoords.y + 50,
    };

    drawLine(startPoint, endPoint);
  };

  const drawLine = (start: Vector2D, end: Vector2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const distanceX = Math.max(Math.abs(start.x - end.x) / 3, 30);

    const controlPoint1: Vector2D = {
      x: start.x + distanceX,
      y: start.y,
    };
    const controlPoint2: Vector2D = {
      x: end.x - distanceX,
      y: end.y,
    };

    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(start.x, start.y, 5, 0, 2 * Math.PI); // Start point
    ctx.arc(end.x, end.y, 5, 0, 2 * Math.PI); // End point
    ctx.fill();

    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(controlPoint1.x, controlPoint1.y, 5, 0, 2 * Math.PI); // Start point
    ctx.arc(controlPoint2.x, controlPoint2.y, 5, 0, 2 * Math.PI); // End point
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(
      controlPoint1.x,
      controlPoint1.y,
      controlPoint2.x,
      controlPoint2.y,
      end.x,
      end.y
    );
    ctx.stroke();

    console.log("e");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (currentRef.current === "box1")
      setBoxCoords({
        x: e.clientX - offSet.current.x,
        y: e.clientY - offSet.current.y,
      });
    if (currentRef.current === "box2")
      setBoxCoords2({
        x: e.clientX - offSet.current.x,
        y: e.clientY - offSet.current.y,
      });
  };

  const handleDragStart =
    (id: string) => (e: React.DragEvent<HTMLDivElement>) => {
      if (id === "box1") {
        offSet.current.x = e.clientX - boxCoords.x;
        offSet.current.y = e.clientY - boxCoords.y;
      }
      if (id === "box2") {
        offSet.current.x = e.clientX - boxCoords2.x;
        offSet.current.y = e.clientY - boxCoords2.y;
      }
      currentRef.current = id;
    };

  return (
    <div
      style={{
        margin: "auto",
        height: "1000px",
        width: "1500px",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        border: "1px solid black",
      }}
    >
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          zIndex: 999,
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* <div
          id="box1"
          style={{
            zIndex: 1000,
            position: "absolute",
            left: `${boxCoords.x}px`,
            top: `${boxCoords.y}px`,
            height: "100px",
            width: "200px",
            border: "1px solid black",
            backgroundColor: "white",
            cursor: "move",
            borderRadius: "5px",
          }}
          draggable
          onDragStart={handleDragStart("box1")}
          onDrag={handleDrag("box1")}
        ></div>
        <div
          id="box2"
          style={{
            zIndex: 1000,
            position: "absolute",
            left: `${boxCoords2.x}px`,
            top: `${boxCoords2.y}px`,
            height: "100px",
            width: "200px",
            border: "1px solid black",
            backgroundColor: "white",
            cursor: "move",
            borderRadius: "5px",
          }}
          draggable
          onDragStart={handleDragStart("box2")}
          onDrag={handleDrag("box2")}
        ></div> */}
        <Node id={"randomUUID()"}/>
      </div>
      <canvas
        width={"1500px"}
        height={"1000px"}
        ref={canvasRef}
        style={{ position: "absolute" }}
      />
    </div>
  );
}

export default Drawboard;
