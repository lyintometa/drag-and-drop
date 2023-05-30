import React from "react";
import { selectPosition, pickUp, setPosition } from "../../redux/modules/nodes";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

interface NodeProps {
  id: string;
}

function Node({ id }: NodeProps) {
  const dispatch = useAppDispatch();
  const position = useAppSelector(selectPosition(id));

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) =>
    dispatch(pickUp({ id, position: { x: e.clientX, y: e.clientY } }));

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) =>
    dispatch(setPosition({ id, position: { x: e.clientX, y: e.clientY } }));

  return (
    <div
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: "200px",
        height: "100px",
        backgroundColor: "white",
        border: "1px solid black",
      }}
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
    />
  );
}

export default Node;
