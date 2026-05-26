import { useRef } from 'react'
import { useToast } from '../../hooks/useToast'
import Toast from '../ui/Toast'
import { toBlob, toPng } from 'html-to-image'
import logoBrinks from '../../assets/BRKLogo.png'

const TIPOS = {
  '1':'Verifica Alerta','2':'Norma CRS','3':'Riesgo Crítico',
  '4':'Retención CCTV','5':'Estándar Seg. Electrónica','6':'Seguimiento',
}
const HALLAZGOS = {
  '1':'Sin Causa','2':'Ambiental','3':'Animal','4':'Humana','5':'Intrusión',
}

function RptCard({ title, children }) {
  return (
    <div className="bg-white border border-[#bfc1c4] rounded-[10px] p-3.5 shadow-sm">
      {title && (
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="w-0.5 h-3 rounded-full bg-gradient-to-b from-accent1 to-accent3" />
          <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-accent1">{title}</span>
        </div>
      )}
      {children}
    </div>
  )
}

function KpiChip({ on, label }) {
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full w-full text-center block
      ${on ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
      {label}
    </span>
  )
}

function RptImg({ src, label, height = 'h-[200px]' }) {
  return (
    <div>
      {label && <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-0.5 h-3 rounded-full bg-gradient-to-b from-accent1 to-accent3" />
        <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-accent1">{label}</span>
      </div>}
      <div className={`bg-[#f8faff] border border-dashed border-blue-200 rounded-lg ${height} flex items-center justify-center overflow-hidden mt-1`}>
        {src
          ? <img src={src} alt="" className="w-full h-full" />
          : <span className="text-[11px] text-gray-400 italic p-5 text-center">Imagen / Evidencia</span>}
      </div>
    </div>
  )
}

export default function Preview({ form, control, imgs, extras, esEstandar }) {
  const previewRef = useRef(null)
  const { toast, mostrar } = useToast()

  const dvrLabel = form.dvrCamara
    ? `CCTV: ${form.dvrCamara.toUpperCase()}`
    : 'CCTV: —'

  const copiar = async () => {
    if (!previewRef.current) return

    try {
      // Esperamos a que las fuentes del sistema estén totalmente cargadas
      await document.fonts.ready
      // Pequeña pausa de seguridad para asegurar el render de imágenes pesadas
      await new Promise(r => setTimeout(r, 150))

      const blob = await toBlob(previewRef.current, {
        quality: 0.95,
        backgroundColor: '#ffffff',
        style: {
          transform: 'scale(1)',
          margin: '0',
        }
      })

      if (!blob) throw new Error('No se pudo generar el Blob')

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      mostrar('✓ Imagen copiada')
    } catch (error) {
      console.error('Error al copiar:', error)
      mostrar('No se pudo copiar la imagen', 'err')
    }
  }

  const descargar = async () => {
    if (!previewRef.current) return

    try {
      await document.fonts.ready
      
      const dataUrl = await toPng(previewRef.current, { 
        quality: 1,
        backgroundColor: '#ffffff' 
      })
      
      const a = document.createElement('a')
      a.download = `inspeccion_sede_${(form.nombreSede || 'sede').replace(/\s+/g, '_')}.png`
      a.href = dataUrl
      a.click()
      mostrar('✓ Descarga iniciada')
    } catch (error) {
      console.error('Error al descargar:', error)
      mostrar('No se pudo descargar', 'err')
    }
  }

  return (
    <div className="mt-8">
      {/* Header de sección */}
      <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[2px] text-muted">
          <div className="w-2 h-2 bg-accent3 rounded-full pulse-dot" />
          Vista previa en tiempo real
        </div>
        <div className="flex gap-2">
          <button onClick={copiar}
            className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-accent1
                       text-[0.78rem] font-bold px-4 py-2 rounded-btn hover:bg-accent1 hover:text-white transition-all focus:outline-none">
            <svg className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copiar imagen
          </button>
          <button onClick={descargar}
            className="flex items-center gap-1.5 gradient-main text-white text-[0.78rem] font-bold
                       px-4 py-2 rounded-btn shadow-btn hover:opacity-90 transition-all">
            <svg className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Descargar PNG
          </button>
        </div>
      </div>

      {/* Reporte */}
      <div ref={previewRef} className="bg-white border-2 rounded-card w-[70%] mx-auto block overflow-hidden">
        <div  className="font-sans bg-white text-ink text-[13px] rounded-card">
          {/* Header reporte */}
          <div className="bg-ink px-5 py-3.5 flex items-center gap-3.5 border-b-4 border-accent1 rounded-tl-lg rounded-tr-lg">
            <div className="w-[60px] h-[40px] grid place-items-center flex-shrink-0
                            font-extrabold text-sm text-white"><img src={logoBrinks} alt="Brinks Logo" className="w-full h-full object-contain block"/></div>
            <div className="flex-1">
              <strong className="text-white text-[15px] font-extrabold block">BRINKS DE COLOMBIA</strong>
              <span className="text-white/50 text-[10px] tracking-wide">Centro Control Monitoreo</span>
            </div>
            <div className="text-right">
              <strong className="text-white font-extrabold text-[18px] block uppercase">
              SEDE {form.nombreSede || 'nombre sede'}
              </strong>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-3 p-3.5 border-2 border-gray-300 box-border">

            {/* Control inspeccionado KPI — solo tipo 5 */}
            {esEstandar && (
              <RptCard title="Control Inspeccionado">
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {[
                    { label: 'A. Principal', val: control.aPrincipal, on: 'Sin Novedad',  off: 'Con Novedad' },
                    { label: 'A. Soporte',   val: control.aSoporte,   on: 'Sin Novedad',  off: 'Con Novedad' },
                    { label: 'CCTV',         val: control.cctv,       on: 'Sin Novedad',  off: 'Con Novedad' },
                    { label: 'DVR-Cam',      val: control.dvr,        on: 'Sin Novedad',  off: '—' },
                  ].map(k => (
                    <div key={k.label} className="bg-[#f8faff] border border-border rounded-lg p-2.5
                                                  flex flex-col gap-1.5 text-center shadow-sm">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted">{k.label}</span>
                      <KpiChip on={k.val} label={k.val ? k.on : k.off} />
                    </div>
                  ))}
                </div>
              </RptCard>
            )}

            {/* Observación */}
            <RptCard title="Observación">
              <span className="text-[11px] text-ink leading-relaxed">
                {form.observacion || 'Sin observaciones.'}
              </span>
            </RptCard>

            {/* Imágenes tipo 5 */}
            {esEstandar && (
              <>
                <RptCard>
                  <div className="grid grid-cols-2 gap-3">
                    <RptImg src={imgs.aPrincipal} label="A. Principal" />
                    <RptImg src={imgs.aSoporte}   label="A. Soporte" />
                  </div>
                </RptCard>
                <RptCard title={dvrLabel}>
                  <RptImg src={imgs.cctv} height="h-[300px]"/>
                </RptCard>
              </>
            )}

            {/* Imagen default (otros tipos) */}
            {!esEstandar && (
              <RptCard title={form.dvrCamara ? form.dvrCamara.toUpperCase() : 'DVR — Cámara'}>
                <RptImg src={imgs.default} height="h-[300px]"/>
              </RptCard>
            )}

            {/* Extras */}
            {extras.map(ex => (
              <RptCard key={ex.id} title={ex.nombre || `Imagen ${ex.id}`}>
                <RptImg src={ex.imagen} height="h-[300px]"/>
              </RptCard>
            ))}

          </div>

          {/* Footer */}
          <div className="bg-gray-100  px-5 py-2 flex items-center justify-between h-8 text-[9px] text-muted border-l-2 border-r-2 border-b-2 border-gray-300 rounded-bl-lg rounded-br-lg">
            <span>Brinks de Colombia</span>
            <span>{new Date().toLocaleString('es-CO')}</span>
          </div>
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  )
}
