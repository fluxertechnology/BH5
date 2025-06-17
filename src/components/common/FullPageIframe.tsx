"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

const loading = "/images/shared/axiosLoading.svg";

interface FullPageIframeProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const FullPageIframe: React.FC<FullPageIframeProps> = ({
  url,
  isOpen,
  onClose,
  title,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const dragRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const wasDragged = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const iframeKey = useRef(0);

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      if (dragPos.x === 0 && dragPos.y === 0) {
        setDragPos({
          x: window.innerWidth - 60,
          y: 20,
        });
      }
    };

    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);

    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }, [dragPos.x, dragPos.y]);

  useEffect(() => {
    if (isOpen && url) {
      setIsLoading(true);
      iframeKey.current += 1;
    }
  }, [url, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current || !windowSize.width) return;

      wasDragged.current = true;

      const newX = e.clientX - offset.current.x;
      const newY = e.clientY - offset.current.y;

      const constrainedX = Math.max(0, Math.min(newX, windowSize.width - 40));
      const constrainedY = Math.max(0, Math.min(newY, windowSize.height - 40));

      setDragPos({
        x: constrainedX,
        y: constrainedY,
      });
    },
    [windowSize],
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "default";
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    wasDragged.current = false;
    isDragging.current = true;
    document.body.style.cursor = "grabbing";

    const rect = dragRef.current?.getBoundingClientRect();
    if (rect) {
      offset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    if (wasDragged.current) {
      return;
    }
    setIsLoading(true);
    onClose();
  };

  useEffect(() => {
    return () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = "default";
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[101] bg-white">
      <div
        ref={dragRef}
        onMouseDown={handleMouseDown}
        style={{
          position: "absolute",
          top: dragPos.y,
          left: dragPos.x,
          zIndex: 102,
          cursor: isDragging.current ? "grabbing" : "grab",
          userSelect: "none",
        }}
      >
        <button
          onClick={handleClose}
          className="flex items-center justify-center text-white rounded-full duration-200 shadow-lg hover:scale-110"
          aria-label="Close iframe"
          style={{ pointerEvents: "auto" }}
        >
          <Image
            src="/images/shared/close.svg"
            alt="Close"
            width={24}
            height={24}
            className="w-8 h-8"
            draggable={false}
          />
        </button>
      </div>

      <div
        id="axiosLoading"
        style={{
          opacity: isLoading ? 1 : 0,
          zIndex: 103,
          position: "fixed",
          top: "50%",
          left: "50%",
          width: "40px",
          height: "40px",
          padding: "1px",
          backgroundColor: "#fff",
          border: "1px solid #bbb",
          borderRadius: "50%",
          transform: isLoading
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0)",
          transition: ".3s cubic-bezier(.20,-0.7,.80, 1.7)",
          pointerEvents: "none",
        }}
      >
        <Image
          src={loading}
          width={40}
          height={40}
          style={{
            width: "100%",
            height: "100%",
            verticalAlign: "middle",
          }}
          alt="loading"
          draggable={false}
        />
      </div>

      <iframe
        key={iframeKey.current}
        src={url}
        className="w-full h-full"
        allowFullScreen
        title={title || "FullPageIframe"}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
        onLoad={handleIframeLoad}
        style={{
          opacity: isLoading ? 0.5 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
    </div>
  );
};

export default FullPageIframe;
