import { TfiLayoutLineSolid } from "react-icons/tfi";
import { PiCursorLight, PiCursorFill, PiCircleFill, PiCircleLight, PiPenFill, PiPenLight, PiArrowBendRightDownLight, PiArrowBendRightDownFill, PiTextAaLight, PiTextAaFill, PiTextboxLight, PiTextboxFill, PiTrashLight, PiTrashFill } from "react-icons/pi";
import { BsTextareaT, BsTextareaResize } from "react-icons/bs";
import { BiJoystickButton } from "react-icons/bi";
import useToolStore from '~/store/toolStore';
import { useCanvasStore, getInsideFormContainer } from '~/store/canvasStore';
import WrapperDiv from './wrapper-div';
import { RoughNotation } from 'react-rough-notation';

export default function Nav() {
    const { tool, setTool } = useToolStore<{ tool: string, setTool: (tool: string) => void }>(state => state)
    const { canvasCtx, data } = useCanvasStore()

    return (
        <nav className='flex w-full justify-center items-center my-4 absolute z-10'>
            <WrapperDiv>
                <button title="cursor" className={`h-9 w-9 flex items-center justify-center rounded-lg ${tool === "cursor" ? "bg-white text-black" : "text-white hover:bg-white/10"}`} onClick={() => setTool("cursor")}>{tool === "cursor" ? <PiCursorFill fillOpacity={0.8} size={20} /> : <PiCursorLight size={20} />}</button>
                <button title="form-container" className={`h-9 w-9 flex items-center justify-center rounded-lg ${tool === "form-container" ? "bg-white text-black" : "text-white hover:bg-white/10"}`} onClick={() => setTool("form-container")}>{tool === "form-container" ? <BsTextareaT fillOpacity={0.8} size={20} /> : <BsTextareaT size={20} />}</button>
                <button title="input-container" className={`h-9 w-9 flex items-center justify-center rounded-lg ${tool === "input-container" ? "bg-white text-black" : "text-white hover:bg-white/10"}`} onClick={() => setTool("input-container")}>{tool === "input-container" ? <PiTextboxFill size={20} /> : <PiTextboxLight size={20} />}</button>
                <button title="textarea-container" className={`h-9 w-9 flex items-center justify-center rounded-lg ${tool === "textarea-container" ? "bg-white text-black" : "text-white hover:bg-white/10"}`} onClick={() => setTool("textarea-container")}>{tool === "textarea-container" ? <BsTextareaResize fillOpacity={0.8} size={20} /> : <BsTextareaResize size={20} />}</button>
                {/* <button title="hr-line" className={`h-9 w-9 flex items-center justify-center rounded-lg ${tool === "hr-line" ? "bg-white text-black" : "text-white hover:bg-white/10"}`} onClick={() => setTool("hr-line")}><TfiLayoutLineSolid size={20} /></button> */}
                <button title="button-rect" className={`h-9 w-9 flex items-center justify-center rounded-lg ${tool === "button-rect" ? "bg-white text-black" : "text-white hover:bg-white/10"}`} onClick={() => setTool("button-rect")}>{tool === "button-rect" ? <BiJoystickButton fillOpacity={0.8} size={20} /> : <BiJoystickButton size={20} />}</button>
                <button title="arrow" className={`h-9 w-9 flex items-center justify-center rounded-lg ${tool === "arrow" ? "bg-white text-black" : "text-white hover:bg-white/10"}`} onClick={() => setTool("arrow")}>{tool === "arrow" ? <PiArrowBendRightDownFill size={20} /> : <PiArrowBendRightDownLight size={20} />}</button>
                <button title="text" className={`h-9 w-9 flex items-center justify-center rounded-lg ${tool === "text" ? "bg-white text-black" : "text-white hover:bg-white/10"}`} onClick={() => setTool("text")}>{tool === "text" ? <PiTextAaFill size={20} /> : <PiTextAaLight size={20} />}</button>
                <button title="delete" className={`h-9 w-9 flex items-center justify-center rounded-lg ${tool === "delete" ? "bg-white text-black" : "text-white hover:bg-white/10"}`} onClick={() => setTool("delete")}>{tool === "delete" ? <PiTrashFill size={20} /> : <PiTrashLight size={20} />}</button>
            </WrapperDiv>
            <button className='absolute right-10 text-white text-xl' onClick={() => {
              console.log({ canvasCtx, data: getInsideFormContainer(data) });
            }}>
                <RoughNotation type="box" show={true} color="#FF8787" strokeWidth={3} padding={[10, 20]}>
                    Save
                </RoughNotation>
            </button>
        </nav>
    )
}