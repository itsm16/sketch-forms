import { create } from "zustand";

export type DataItem = {
  id: number;
  shape: 'rectangle' | 'circle' | 'text' | 'line';
  type?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  diameter?: number;
  fill?: string;
  text?: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  dashed?: boolean;
  field_name?: string;
};

type CanvasState = {
  canvasCtx: CanvasRenderingContext2D | null;
  setCanvasCtx: (ctx: CanvasRenderingContext2D) => void;
  data: DataItem[];
  setData: (data: DataItem[]) => void;
}

export const getInsideFormContainer = (data: DataItem[]): DataItem[] => {
  const formContainer = data.find(d => d.type === 'form-container');
  if (!formContainer || !formContainer.width || !formContainer.height) return [];
  const { x: cx, y: cy, width: cw, height: ch } = formContainer;
  return data.filter(d =>
    d.id !== formContainer.id &&
    d.x >= cx && d.x <= cx + cw &&
    d.y >= cy && d.y <= cy + ch
  );
};

export const useCanvasStore = create<CanvasState>((set) => ({
   canvasCtx : null,
   setCanvasCtx : (ctx: CanvasRenderingContext2D) => set({ canvasCtx: ctx }),
   data : [],
   setData : (data: DataItem[]) => set({
     data: [...data.filter(d => d.type !== 'button'), ...data.filter(d => d.type === 'button')],
   }),
}));
