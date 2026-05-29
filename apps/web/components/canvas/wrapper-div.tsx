export default function WrapperDiv({children}: {children: React.ReactNode}) {
  return (
    <div className='px-[5px] py-[5px] flex gap-1 bg-[#2E2D39] rounded-lg'>{children}</div>
  )
}