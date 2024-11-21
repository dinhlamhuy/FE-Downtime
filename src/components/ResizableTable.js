import React, { useState, useRef } from "react";

// Thêm các hàm xử lý độ rộng cột
const ResizableTable = ({ children }) => {
    console.log({ children })
  const [columnWidths, setColumnWidths] = useState([]);
  const resizingColumn = useRef(null);

  const handleMouseDown = (index, e) => {
    resizingColumn.current = { index, startX: e.clientX, startWidth: columnWidths[index] || 100 };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!resizingColumn.current) return;
    const { index, startX, startWidth } = resizingColumn.current;
    const newWidth = Math.max(50, startWidth + (e.clientX - startX));
    setColumnWidths((prevWidths) => {
      const updatedWidths = [...prevWidths];
      updatedWidths[index] = newWidth;
      return updatedWidths;
    });
  };

  const handleMouseUp = () => {
    resizingColumn.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{background:'blue'}}>
          {React.Children.map(children[0], (child, index) => (
            <th
              key={index}
              style={{
                width: columnWidths[index] || "auto",
                position: "relative",
              }}
            >
              {child.props.children}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "5px",
                  height: "100%",
                  cursor: "col-resize",
                  zIndex: 1,
                }}
                onMouseDown={(e) => handleMouseDown(index, e)}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children[1]}</tbody>
    </table>
  );
};
export default ResizableTable