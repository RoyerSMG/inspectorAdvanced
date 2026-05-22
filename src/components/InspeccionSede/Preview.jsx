import { useRef } from 'react'
import { useToast } from '../../hooks/useToast'
import Toast from '../ui/Toast'

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

function RptImg({ src, label }) {
  return (
    <div>
      {label && <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-0.5 h-3 rounded-full bg-gradient-to-b from-accent1 to-accent3" />
        <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-accent1">{label}</span>
      </div>}
      <div className="bg-[#f8faff] border border-dashed border-blue-200 rounded-lg min-h-[140px]
                      flex items-center justify-center overflow-hidden mt-1">
        {src
          ? <img src={src} alt="" className="w-full h-full object-contain" />
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
    const html2canvas = (await import('https://esm.sh/html2canvas@1.4.1')).default
    const canvas = await html2canvas(previewRef.current, { scale: 2 })
    canvas.toBlob(blob => {
      if (!blob) return
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        .then(() => mostrar('✓ Imagen copiada'))
        .catch(() => mostrar('No se pudo copiar', 'err'))
    })
  }

  const descargar = async () => {
    const html2canvas = (await import('https://esm.sh/html2canvas@1.4.1')).default
    const canvas = await html2canvas(previewRef.current, { scale: 2 })
    const a = document.createElement('a')
    a.download = `inspeccion_sede_${(form.nombreSede || 'sede').replace(/\s+/g, '_')}.png`
    a.href = canvas.toDataURL()
    a.click()
    mostrar('✓ Descarga iniciada')
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
                       text-[0.78rem] font-bold px-4 py-2 rounded-btn hover:bg-accent1 hover:text-white transition-all">
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
      <div className="bg-white border border-border rounded-card shadow-card overflow-hidden">
        <div ref={previewRef} className="font-sans bg-white text-ink text-[13px]">

          {/* Header reporte */}
          <div className="bg-ink px-5 py-3.5 flex items-center gap-3.5 border-b-4 border-accent1">
            <div className="w-9 h-9 bg-accent1 rounded-full grid place-items-center flex-shrink-0
                            font-extrabold text-sm text-white">B</div>
            <div className="flex-1">
              <strong className="text-white text-[15px] font-extrabold block">BRINKS DE COLOMBIA</strong>
              <span className="text-white/50 text-[10px] tracking-wide">Centro Control Monitoreo</span>
            </div>
            <div className="text-right">
              <strong className="text-white font-extrabold text-[13px] block">
                sede {form.nombreSede || 'nombre sede'}
              </strong>
              <span className="text-white/40 text-[10px]">
                {TIPOS[form.tipoId] || '—'}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-3 p-3.5">

            {/* Control inspeccionado KPI — solo tipo 5 */}
            {esEstandar && (
              <RptCard title="Control Inspeccionado">
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {[
                    { label: 'A. Principal', val: control.aPrincipal, on: 'Con Novedad',  off: 'Sin Novedad' },
                    { label: 'A. Soporte',   val: control.aSoporte,   on: 'Con Novedad',  off: 'Sin Novedad' },
                    { label: 'CCTV',         val: control.cctv,       on: 'Con Novedad',  off: 'Sin Novedad' },
                    { label: 'DVR-Cam',      val: control.dvr,        on: 'Con Novedad',  off: '—' },
                  ].map(k => (
                    <div key={k.label} className="bg-[#f8faff] border border-border rounded-lg p-2.5
                                                  flex flex-col items-center gap-1.5 text-center">
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
                  <RptImg src={imgs.cctv} />
                </RptCard>
              </>
            )}

            {/* Imagen default (otros tipos) */}
            {!esEstandar && (
              <RptCard title={form.dvrCamara ? form.dvrCamara.toUpperCase() : 'DVR — Cámara'}>
                <RptImg src={imgs.default} />
              </RptCard>
            )}

            {/* Extras */}
            {extras.map(ex => (
              <RptCard key={ex.id} title={ex.nombre || `Imagen ${ex.id}`}>
                <RptImg src={ex.imagen} />
              </RptCard>
            ))}

          </div>

          {/* Footer */}
          <div className="bg-gray-100 border-t border-border px-5 py-2 flex justify-between text-[9px] text-muted">
            <span>Brinks de Colombia</span>
            <span>{new Date().toLocaleString('es-CO')}</span>
          </div>
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  )
}
