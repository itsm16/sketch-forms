const writeText = ({ctx, text, x = 600, y = 100, fontFamily = '"Architects Daughter"'}: {ctx: CanvasRenderingContext2D, text: string, x?: number, y?: number, fontFamily?: string}) =>{
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `20px ${fontFamily}`;
    ctx.fillStyle = 'white'; 
    ctx.fillText(text, x, y);
}

export {
    writeText
}