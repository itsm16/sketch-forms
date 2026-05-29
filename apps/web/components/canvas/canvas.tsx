import rough from 'roughjs'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import localFont from 'next/font/local'

import useToolStore from '~/store/toolStore';
import { useCanvasStore, type DataItem } from '~/store/canvasStore';
import { writeText } from '~/lib/draw.utils';
import Nav from './nav';

const virgilFont = localFont({ src: '../../app/fonts/Virgil.woff2' })

interface CanvasProps {
  initialData?: DataItem[];
  disableZoom?: boolean;
  nav?: boolean;
}

function Canvas({ initialData = [], disableZoom = false, nav = true }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const [isDragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastViewport, setLastViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const [isVisible, setIsVisible] = useState(false);
  const [textInputPosition, setTextInputPosition] = useState({ x: 0, y: 0 });
  const [textCanvasPosition, setTextCanvasPosition] = useState({ x: 0, y: 0 });
  const [inputValue, setInputValue] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDraggingElement, setDraggingElement] = useState(false);
  const [dragElementStart, setDragElementStart] = useState({ x: 0, y: 0 });
  const [dragElementOrigPos, setDragElementOrigPos] = useState({ x: 0, y: 0 });
  const [isDrawingRect, setIsDrawingRect] = useState(false);
  const [rectStart, setRectStart] = useState({ x: 0, y: 0 });
  const [rectCurrent, setRectCurrent] = useState({ x: 0, y: 0 });
  const [editingInputId, setEditingInputId] = useState<number | null>(null);
  const [editingInputValue, setEditingInputValue] = useState('');
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLInputElement>(null);

  // zustand tools
  const { tool, setTool } = useToolStore(state => state)
  const { setCanvasCtx, setData: setStoreData } = useCanvasStore()

  const [data, setData] = useState<DataItem[]>(initialData);

  const screenToCanvas = (clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    return {
      x: (clientX - rect.left - viewport.x) / viewport.zoom,
      y: (clientY - rect.top - viewport.y) / viewport.zoom,
    };
  };

  const distanceToSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  };

  const hitTest = (canvasX: number, canvasY: number): DataItem | null => {
    const ctx = canvasRef.current?.getContext('2d') ?? null;
    const fontSize = 20;
    if (ctx) {
      ctx.font = `${fontSize}px ${virgilFont.style.fontFamily}`;
    }

    for (let i = data.length - 1; i >= 0; i--) {
      const item = data[i]!;
      if (item.shape === 'rectangle') {
        const w = item.width || 100;
        const h = item.height || 100;
        if (canvasX >= item.x && canvasX <= item.x + w && canvasY >= item.y && canvasY <= item.y + h) return item;
      }
      if (item.shape === 'circle') {
        const r = (item.width || 50) / 2;
        const ddx = canvasX - item.x;
        const ddy = canvasY - item.y;
        if (ddx * ddx + ddy * ddy <= r * r) return item;
      }
      if (item.shape === 'line') {
        const x1 = item.x, y1 = item.y;
        const x2 = item.x + (item.width || 100), y2 = item.y + (item.height || 100);
        if (distanceToSegment(canvasX, canvasY, x1, y1, x2, y2) < 10) return item;
      }
      if (item.shape === 'text') {
        const text = item.text || '';
        if (ctx) {
          const metrics = ctx.measureText(text);
          const width = metrics.width;
          const ascent = (metrics.actualBoundingBoxAscent ?? fontSize * 0.8);
          const descent = (metrics.actualBoundingBoxDescent ?? fontSize * 0.2);
          const height = ascent + descent;
          const left = item.x - width / 2;
          const right = item.x + width / 2;
          const top = item.y - height / 2;
          const bottom = item.y + height / 2;
          if (canvasX >= left && canvasX <= right && canvasY >= top && canvasY <= bottom) return item;
        } else {
          // fallback to approximate bounds if no canvas context available
          if (Math.abs(canvasX - item.x) < 150 && Math.abs(canvasY - item.y) < 25) return item;
        }
      }
    }
    return null;
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;

    setCanvasCtx(ctx);

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    ctx.save();

    canvas.style.backgroundColor = '#121212';
    ctx.strokeStyle = 'white';
    
    ctx.translate(viewport.x, viewport.y);
    ctx.scale(viewport.zoom, viewport.zoom);
    
    const rc = rough.canvas(canvas);

    data.forEach((item) => {
      let seed = 10;
      let roughness = 1.5;
      if (item.shape === 'rectangle') {
        if (item.type === 'input-container') {
          ctx.strokeStyle = '#4F72FC';
          ctx.lineWidth = 2 / viewport.zoom;
          ctx.strokeRect(item.x, item.y, item.width || 100, item.height || 100);
          if (item.field_name) {
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.font = `14px ${virgilFont.style.fontFamily}`;
            ctx.fillStyle = 'white';
            ctx.fillText(item.field_name, item.x + 8, item.y + (item.height || 60) / 2);
          }
        } else if (item.type === 'textarea-container') {
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 2 / viewport.zoom;
          ctx.strokeRect(item.x, item.y, item.width || 200, item.height || 120);
          const innerH = item.height || 120;
          const innerW = item.width || 200;
          ctx.strokeStyle = 'rgba(255,255,255,0.2)';
          ctx.lineWidth = 1 / viewport.zoom;
          for (let ly = item.y + 24; ly < item.y + innerH - 4; ly += 20) {
            ctx.beginPath();
            ctx.moveTo(item.x + 6, ly);
            ctx.lineTo(item.x + innerW - 6, ly);
            ctx.stroke();
          }
          if (item.field_name) {
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.font = `13px ${virgilFont.style.fontFamily}`;
            ctx.fillStyle = 'white';
            ctx.fillText(item.field_name, item.x + 8, item.y + 14);
          }
        } else if (item.type === 'button') {
          ctx.strokeStyle = '#FF8787';
          ctx.lineWidth = 2 / viewport.zoom;
          ctx.setLineDash([6 / viewport.zoom, 3 / viewport.zoom]);
          ctx.strokeRect(item.x, item.y, item.width || 100, item.height || 100);
          ctx.setLineDash([]);
          if (item.field_name) {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `14px ${virgilFont.style.fontFamily}`;
            ctx.fillStyle = 'white';
            ctx.fillText(item.field_name, item.x + (item.width || 100) / 2, item.y + (item.height || 50) / 2);
          }
        } else if (item.dashed) {
          ctx.strokeStyle = 'lightblue';
          ctx.lineWidth = 2 / viewport.zoom;
          ctx.setLineDash([8 / viewport.zoom, 4 / viewport.zoom]);
          ctx.strokeRect(item.x, item.y, item.width || 100, item.height || 100);
          ctx.setLineDash([]);
        } else {
          rc.rectangle(
            item.x,
            item.y,
            item.width || 100,
            item.height || 100,
            {
              stroke: 'white',
              fill: item.fill ? item.fill : "",
              roughness,
              seed
            }
          );
        }
      }
      if (item.shape === 'circle') {
        rc.circle(
          item.x,
          item.y,
          item.width || 50,
          {
            fill: item.fill ? item.fill : "",
            stroke: 'white',
            roughness,
            seed
          }
        );
      }

      if (item.shape === 'line') {
        rc.line(
          item.x,
          item.y,
          item.x + (item.width || 100),
          item.y + (item.height || 100),
          {
            stroke: 'white',
            roughness,
            seed
          }
        );
      }
      
      if (item.shape === 'text') {
        writeText({ctx, text: item.text || "", x: item.x, y: item.y, fontFamily: virgilFont.style.fontFamily});
      }
    });

    if (selectedId !== null) {
      const sel = data.find(item => item.id === selectedId);
      if (sel) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2 / viewport.zoom;
        ctx.setLineDash([5 / viewport.zoom, 3 / viewport.zoom]);

        if (sel.shape === 'rectangle') {
          ctx.strokeRect(sel.x - 5, sel.y - 5, (sel.width || 100) + 10, (sel.height || 100) + 10);
        } else if (sel.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(sel.x, sel.y, (sel.width || 50) / 2 + 5, 0, Math.PI * 2);
          ctx.stroke();
        } else if (sel.shape === 'line') {
          const x1 = sel.x, y1 = sel.y;
          const x2 = sel.x + (sel.width || 100), y2 = sel.y + (sel.height || 100);
          ctx.strokeRect(Math.min(x1, x2) - 5, Math.min(y1, y2) - 5, Math.abs(x2 - x1) + 10, Math.abs(y2 - y1) + 10);
        } else if (sel.shape === 'text') {
          ctx.strokeRect(sel.x - 50, sel.y - 15, 100, 30);
        }

        ctx.setLineDash([]);
      }
    }

    if (isDrawingRect) {
      if (tool === 'hr-line') {
        const x = Math.min(rectStart.x, rectCurrent.x);
        const w = Math.abs(rectCurrent.x - rectStart.x);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2 / viewport.zoom;
        ctx.beginPath();
        ctx.moveTo(x, rectStart.y);
        ctx.lineTo(x + w, rectStart.y);
        ctx.stroke();
      } else {
        const minX = Math.min(rectStart.x, rectCurrent.x);
        const minY = Math.min(rectStart.y, rectCurrent.y);
        const w = Math.abs(rectCurrent.x - rectStart.x);
        const h = Math.abs(rectCurrent.y - rectStart.y);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2 / viewport.zoom;
        ctx.setLineDash([8 / viewport.zoom, 4 / viewport.zoom]);
        ctx.strokeRect(minX, minY, w, h);
        ctx.setLineDash([]);
      }
    }

    if (hoveredId !== null) {
      const hovered = data.find(d => d.id === hoveredId);
      if (hovered) {
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2 / viewport.zoom;
        ctx.setLineDash([6 / viewport.zoom, 3 / viewport.zoom]);

        if (hovered.shape === 'rectangle') {
          ctx.strokeRect(hovered.x - 3, hovered.y - 3, (hovered.width || 100) + 6, (hovered.height || 100) + 6);
        } else if (hovered.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(hovered.x, hovered.y, (hovered.width || 50) / 2 + 3, 0, Math.PI * 2);
          ctx.stroke();
        } else if (hovered.shape === 'line') {
          const x1 = hovered.x, y1 = hovered.y;
          const x2 = hovered.x + (hovered.width || 100), y2 = hovered.y + (hovered.height || 100);
          ctx.strokeRect(Math.min(x1, x2) - 3, Math.min(y1, y2) - 3, Math.abs(x2 - x1) + 6, Math.abs(y2 - y1) + 6);
        } else if (hovered.shape === 'text') {
          ctx.strokeRect(hovered.x - 50, hovered.y - 15, 100, 30);
        }

        ctx.setLineDash([]);
      }
    }

    ctx.restore();
  }, [viewport, data, selectedId, isDrawingRect, rectStart, rectCurrent, hoveredId])

  useEffect(() => {
    setStoreData(data);
  }, [data, setStoreData])

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0]!.contentRect;
      canvas.width = width;
      canvas.height = height;

      const loadAndDraw = async () => {
        await document.fonts.load(`20px ${virgilFont.style.fontFamily}`);
        draw();
      };
      loadAndDraw();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [draw])

  const handleWheel = (e: React.WheelEvent) => {
    if (disableZoom) return;
    // e.preventDefault();
    const zoomSpeed = 0.001;
    const newZoom = Math.max(0.1, Math.min(5, viewport.zoom - e.deltaY * zoomSpeed));
    setViewport(prev => ({ ...prev, zoom: newZoom }));
    
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.button !== 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (tool === 'form-container' || tool === 'hr-line') {
      const { x, y } = screenToCanvas(e.clientX, e.clientY);
      setIsDrawingRect(true);
      setRectStart({ x, y });
      setRectCurrent({ x, y });
      canvas.style.cursor = 'crosshair';
      return;
    }

    if (tool === 'delete') {
      const { x: canvasX, y: canvasY } = screenToCanvas(e.clientX, e.clientY);
      const hit = hitTest(canvasX, canvasY);
      if (hit) setData(prev => prev.filter(d => d.id !== hit.id));
      setHoveredId(null);
      canvas.style.cursor = 'pointer';
      return;
    }

    if (tool === 'text') {
      const container = containerRef.current;
      if (!container) return;
      const { x: canvasX, y: canvasY } = screenToCanvas(e.clientX, e.clientY);
      const rect = container.getBoundingClientRect();
      setTextCanvasPosition({ x: canvasX, y: canvasY });
      const inputLeft = viewport.x + canvasX * viewport.zoom;
      const inputTop = viewport.y + canvasY * viewport.zoom;
      setTextInputPosition({ x: inputLeft + 120, y: inputTop });
      setIsVisible(true);
      setInputValue('');
      setTimeout(() => textInputRef.current?.focus(), 0);
      canvas.style.cursor = 'text';
      return;
    }

    if (tool === 'input-container' || tool === 'textarea-container' || tool === 'button-rect') {
      const { x, y } = screenToCanvas(e.clientX, e.clientY);
      const typeMap: Record<string, string> = { 'input-container': 'input-container', 'textarea-container': 'textarea-container', 'button-rect': 'button' };
      const isTextarea = tool === 'textarea-container';
      const newItem: DataItem = {
        id: Date.now(),
        type: typeMap[tool] ?? 'input-container',
        shape: 'rectangle',
        x,
        y,
        width: 200,
        height: isTextarea ? 120 : tool === 'button-rect' ? 50 : 60,
        field_name: '',
      };
      setData(prev => [...prev, newItem]);
      setEditingInputId(newItem.id);
      setEditingInputValue('');
      setTimeout(() => inputContainerRef.current?.focus(), 0);
      canvas.style.cursor = 'crosshair';
      return;
    }

    const { x: canvasX, y: canvasY } = screenToCanvas(e.clientX, e.clientY);
    const hit = hitTest(canvasX, canvasY);

    if (hit) {
      setSelectedId(hit.id);
      setDraggingElement(true);
      setDragElementStart({ x: e.clientX, y: e.clientY });
      setDragElementOrigPos({ x: hit.x, y: hit.y });
      canvas.style.cursor = 'grabbing';
    } else {
      setSelectedId(null);
      setDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setLastViewport({ x: viewport.x, y: viewport.y, zoom: viewport.zoom });
      canvas.style.cursor = 'grabbing';
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();

    if ((tool === 'form-container' || tool === 'hr-line') && isDrawingRect) {
      const { x, y } = screenToCanvas(e.clientX, e.clientY);
      setRectCurrent({ x, y });
      return;
    }

    if (isDraggingElement && selectedId !== null) {
      const deltaX = (e.clientX - dragElementStart.x) / viewport.zoom;
      const deltaY = (e.clientY - dragElementStart.y) / viewport.zoom;
      setData(prev => prev.map(item =>
        item.id === selectedId
          ? { ...item, x: dragElementOrigPos.x + deltaX, y: dragElementOrigPos.y + deltaY }
          : item
      ));
    } else if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setViewport({ x: lastViewport.x + deltaX, y: lastViewport.y + deltaY, zoom: lastViewport.zoom });
    } else {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (tool === 'form-container' || tool === 'hr-line' || tool === 'input-container' || tool === 'textarea-container' || tool === 'button-rect') {
        canvas.style.cursor = 'crosshair';
        return;
      }
      if (tool === 'delete') {
        const { x: canvasX, y: canvasY } = screenToCanvas(e.clientX, e.clientY);
        const hit = hitTest(canvasX, canvasY);
        setHoveredId(hit?.id ?? null);
        canvas.style.cursor = 'pointer';
        return;
      }
      setHoveredId(null);
      const { x: canvasX, y: canvasY } = screenToCanvas(e.clientX, e.clientY);
      canvas.style.cursor = hitTest(canvasX, canvasY) ? 'move' : '';
    }
  };

  const onMouseUp = () => {
    if (tool === 'form-container' && isDrawingRect) {
      const alreadyExists = data.some(d => d.type === 'form-container');

      if (!alreadyExists) {
        const minX = Math.min(rectStart.x, rectCurrent.x);
        const minY = Math.min(rectStart.y, rectCurrent.y);
        const w = Math.abs(rectCurrent.x - rectStart.x);
        const h = Math.abs(rectCurrent.y - rectStart.y);

        if (w > 5 && h > 5) {
          setData(prev => [...prev, {
            id: Date.now(),
            type: 'form-container',
            shape: 'rectangle',
            x: minX,
            y: minY,
            width: w,
            height: h,
            dashed: true,
          }]);
        }
      }

      setIsDrawingRect(false);
      return;
    }

    if (tool === 'hr-line' && isDrawingRect) {
      const dx = rectCurrent.x - rectStart.x;
      if (Math.abs(dx) > 5) {
        const x = Math.min(rectStart.x, rectCurrent.x);
        const w = Math.abs(dx);
        setData(prev => [...prev, {
          id: Date.now(),
          type: 'hr-line',
          shape: 'line',
          x,
          y: rectStart.y,
          width: w,
          height: 0,
        }]);
      }
      setIsDrawingRect(false);
      return;
    }

    setDragging(false);
    setDraggingElement(false);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = tool === 'form-container' || tool === 'hr-line' || tool === 'input-container' || tool === 'textarea-container' || tool === 'button-rect' ? 'crosshair' : tool === 'delete' ? 'pointer' : selectedId ? 'move' : '';
    }
  };

  const handleTextSubmit = () => {
    if (!inputValue.trim()) return;
    
    const canvasX = textCanvasPosition.x;
    const canvasY = textCanvasPosition.y;
    
    const newTextItem: DataItem = {
      id: Date.now(),
      shape: 'text',
      text: inputValue,
      x: canvasX,
      y: canvasY
    };
    
    setData(prev => [...prev, newTextItem]);
    setIsVisible(false);
    setInputValue('');
  };

  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTextSubmit();
    } else if (e.key === 'Escape') {
      setIsVisible(false);
      setInputValue('');
    }
  };

  const onDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedId(null);
    
    const container = containerRef.current;
    if (!container) return;

    const { x: canvasX, y: canvasY } = screenToCanvas(e.clientX, e.clientY);
    const hit = hitTest(canvasX, canvasY);

    if (hit && (hit.type === 'input-container' || hit.type === 'textarea-container' || hit.type === 'button')) {
      setEditingInputId(hit.id);
      setEditingInputValue(hit.field_name || '');
      setTimeout(() => inputContainerRef.current?.focus(), 0);
      return;
    }
    
    const rect = container.getBoundingClientRect();
    setTextCanvasPosition({ x: canvasX , y: canvasY });
    const inputLeft = viewport.x + canvasX * viewport.zoom;
    const inputTop = viewport.y + canvasY * viewport.zoom;
    setTextInputPosition({ x: inputLeft + 120, y: inputTop });
    setIsVisible(true);
    setInputValue('');
    
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 0);
  };

  return (
    <div ref={containerRef} className='relative h-full w-full'>
      {nav && <Nav/>}
      <canvas ref={canvasRef} id="canvas" className="bg-white h-full w-full"
      onWheel={handleWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onDoubleClick={onDoubleClick}
      />
      {isVisible && (
        <input
          ref={textInputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleTextKeyDown}
          onBlur={handleTextSubmit}
          style={{
            position: 'absolute',
            left: textInputPosition.x,
            top: textInputPosition.y,
            transform: 'translate(-50%, -50%)',
            padding: '2px 4px',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontSize: '20px',
            fontFamily: virgilFont.style.fontFamily,
            color: 'white',
            zIndex: 1000
          }}
        />
      )}
      {editingInputId !== null && (() => {
        const item = data.find(d => d.id === editingInputId);
        if (!item || (item.type !== 'input-container' && item.type !== 'textarea-container' && item.type !== 'button')) return null;
        const inputLeft = viewport.x + item.x * viewport.zoom;
        const inputTop = viewport.y + item.y * viewport.zoom;
        const inputW = (item.width || 200) * viewport.zoom;
        const inputH = (item.height || 60) * viewport.zoom;
        return (
          <input
            ref={inputContainerRef}
            type="text"
            value={editingInputValue}
            placeholder="field_name"
            onChange={(e) => setEditingInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setData(prev => prev.map(d =>
                  d.id === editingInputId ? { ...d, field_name: editingInputValue } : d
                ));
                setEditingInputId(null);
                setEditingInputValue('');
              } else if (e.key === 'Escape') {
                setEditingInputId(null);
                setEditingInputValue('');
              }
            }}
            onBlur={() => {
              setData(prev => prev.map(d =>
                d.id === editingInputId ? { ...d, field_name: editingInputValue } : d
              ));
              setEditingInputId(null);
              setEditingInputValue('');
            }}
            style={{
              position: 'absolute',
              left: inputLeft,
              top: inputTop,
              width: inputW,
              height: inputH,
              padding: '4px 8px',
              border: '1px solid white',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: `${14 * viewport.zoom}px`,
              fontFamily: virgilFont.style.fontFamily,
              color: 'white',
              zIndex: 1000,
              boxSizing: 'border-box',
            }}
          />
        );
      })()}
    </div>
  )
}

export default Canvas