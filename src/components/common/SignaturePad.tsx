import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface SignaturePadProps {
  onComplete: (signatureDataUrl: string) => void;
  onClose: () => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onComplete, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        setContext(ctx);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;
    setIsDrawing(true);
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const saveSignature = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    onComplete(dataUrl);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="border-2 border-gray-300 rounded-lg mb-4">
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            className="w-full h-48 cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={clearCanvas}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Clear
          </Button>
          <Button onClick={saveSignature} size="sm" className="flex-1">
            Save Signature
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-2 text-center">
          Draw your signature above, then click Save
        </p>
      </div>
    </div>
  );
};

export default SignaturePad;
