import { useRef } from 'react'

export default function ImageBox({ label, image, onImage, onClear, height = '180px' }) {
  const boxRef = useRef(null)

  const handlePaste = (e) => {
    e.preventDefault()
    const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith('image'))
    if (!item) return
    const reader = new FileReader()
    reader.onload = evt => onImage(evt.target.result)
    reader.readAsDataURL(item.getAsFile())
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-[0.72rem] font-semibold tracking-wide text-muted uppercase">{label}</span>
      )}
      <div
        ref={boxRef}
        className={`img-box ${image ? 'has-image' : ''}`}
        style={{ height }}
        tabIndex={0}
        onClick={() => boxRef.current?.focus()}
        onPaste={handlePaste}
      >
        {image ? (
          <>
            <img src={image} alt="evidencia" className="w-full h-full object-contain" />
            <button
              className="absolute top-2 right-2 w-6 h-6 bg-red-500/70 hover:bg-red-500 text-white
                         rounded-md text-xs grid place-items-center z-10 transition-colors"
              onClick={e => { e.stopPropagation(); onClear() }}
            >✕</button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            <svg className="w-8 h-8 stroke-blue-300 fill-none" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
            <span className="text-[0.78rem] text-gray-400 text-center leading-5">
              Imagen / Evidencia<br />
              <kbd className="bg-accent1/15 border border-accent1/30 rounded px-1 text-[0.72rem] text-accent1">
                Ctrl+V
              </kbd>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
