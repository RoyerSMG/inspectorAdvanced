import { useState, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import Header from '../components/Header'
import Toggle from '../components/ui/Toggle'
import ImageBox from '../components/ui/ImageBox'
import Toast from '../components/ui/Toast'
import { useToast } from '../hooks/useToast'
import Preview from '../components/InspeccionSede/Preview'

/* ── Catálogos ── */
const TIPOS = [
  { id: 1, nombre: 'Verifica Alerta' },
  { id: 2, nombre: 'Norma CRS' },
  { id: 3, nombre: 'Riesgo Crítico' },
  { id: 4, nombre: 'Retención CCTV' },
  { id: 5, nombre: 'Estándar Seg. Electrónica' },
  { id: 6, nombre: 'Seguimiento' },
]
const HALLAZGOS = [
  { id: 1, nombre: 'Sin Causa' },
  { id: 2, nombre: 'Ambiental' },
  { id: 3, nombre: 'Animal' },
  { id: 4, nombre: 'Humana' },
  { id: 5, nombre: 'Intrusión' },
]
const ACCIONES = ['Verificación', 'Alerta', 'Reporte', 'Llamada', 'Despacho']

/* ── Conversión DVR ── */
const convertirDvr = (raw) => {
  if (!raw) return ''
  const m = raw.toUpperCase().match(/D(\d+)C(\d+)/)
  if (!m) return raw.toUpperCase()
  return `N${m[1].padStart(2, '0')}${m[2].padStart(2, '0')}`
}

/* ── Estado inicial ── */
const initialForm = () => ({
  tipoId:    '',
  nombreSede:'',
  abonado:   '',
  dvrCamara: '',
  detalle:   '',
  accion:    '',
  hallazgoId:'',
  observacion:'',
})
const initialControl = () => ({
  aPrincipal: false,
  aSoporte:   false,
  cctv:       false,
  dvr:        false,
})
const initialImgs = () => ({
  aPrincipal: null,
  aSoporte:   null,
  cctv:       null,
  default:    null,
})

export default function InspeccionSede() {
  const { session, operador: operadorCtx } = useAuth()
  const { toast, mostrar } = useToast()

  const [form,    setForm]    = useState(initialForm())
  const [control, setControl] = useState(initialControl())
  const [imgs,    setImgs]    = useState(initialImgs())
  const [extras,  setExtras]  = useState([])  // [{ id, nombre, imagen }]
  const [saving,  setSaving]  = useState(false)
  const extraCounter          = useRef(0)

  const esEstandar = form.tipoId === '5'

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }))

  /* ── Imágenes extra ── */
  const agregarExtra = () => {
    extraCounter.current++
    setExtras(ex => [...ex, { id: extraCounter.current, nombre: `Imagen ${extraCounter.current}`, imagen: null }])
  }
  const actualizarExtra = (id, key, val) =>
    setExtras(ex => ex.map(e => e.id === id ? { ...e, [key]: val } : e))
  const eliminarExtra = id => setExtras(ex => ex.filter(e => e.id !== id))

  /* ── Limpiar ── */
  const limpiar = () => {
    setForm(initialForm())
    setControl(initialControl())
    setImgs(initialImgs())
    setExtras([])
    mostrar('Formulario limpiado')
  }

  /* ── Guardar ── */
  const guardar = async () => {
    if (!form.tipoId)    { mostrar('Selecciona el tipo de inspección.', 'err'); return }
    if (!form.hallazgoId){ mostrar('Selecciona un hallazgo.', 'err');           return }

    if (!operadorCtx?.codigoOperador) {
      mostrar('Tu perfil de operador no está completo.', 'err')
      return
    }

    setSaving(true)
    const { error } = await supabase.from('inspecciones_sede').insert([{
      abonado:            form.abonado    || null,
      dvr_camara:         convertirDvr(form.dvrCamara) || null,
      tipo_inspeccion:    parseInt(form.tipoId),
      detalle_inspeccion: form.detalle    || null,
      evidencia:          '',
      accion:             form.accion     || null,
      hallazgo:           parseInt(form.hallazgoId),
      observacion:        form.observacion || null,
      operador:           operadorCtx.codigoOperador,
    }])
    setSaving(false)

    if (error) { mostrar('Error al guardar: ' + error.message, 'err'); return }
    mostrar('✓ Inspección guardada correctamente')
  }

  /* ── Clases reutilizables ── */
  const inputCls = `bg-[#fafafa] border-[1.5px] border-border rounded-btn px-3.5 py-2.5
                    text-[0.87rem] text-ink outline-none w-full
                    focus:border-accent1 focus:ring-[3px] focus:ring-accent1/10 focus:bg-white transition-all`

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-9 pb-20">

        {/* Page header */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-[2rem] font-extrabold text-ink leading-none">Inspección de Sede</h2>
            <p className="text-[0.88rem] text-muted mt-1.5">Centro Control Monitoreo — Brinks de Colombia</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={limpiar}
              className="bg-gray-100 border border-border text-muted text-[0.78rem] font-bold
                         uppercase tracking-wide px-4 py-2.5 rounded-btn hover:bg-red-50
                         hover:border-red-300 hover:text-red-400 transition-all">
              ↺ Limpiar todo
            </button>
            <button onClick={guardar} disabled={saving}
              className="gradient-green text-white font-extrabold text-[0.82rem] px-5 py-2.5 rounded-btn
                         shadow-[0_2px_10px_rgba(45,158,95,0.4)] flex items-center gap-2
                         hover:opacity-90 disabled:opacity-55 transition-all">
              {saving && <div className="spinner" />}
              <svg className="w-4 h-4 stroke-white fill-none" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Guardar inspección
            </button>
          </div>
        </div>

        {/* ── Card: Datos de la inspección ── */}
        <div className="bg-card border border-border rounded-card shadow-card p-6 mb-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="card-title-bar" />
            <span className="text-[0.7rem] font-bold uppercase tracking-[2px] text-accent1">
              Datos de la inspección
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.72rem] font-semibold uppercase tracking-wide text-muted">Tipo de inspección</label>
              <select value={form.tipoId} onChange={e => setField('tipoId', e.target.value)} className={inputCls}>
                <option value="" disabled>Seleccione</option>
                {TIPOS.map(t => <option key={t.id} value={String(t.id)}>{t.nombre}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.72rem] font-semibold uppercase tracking-wide text-muted">Nombre Sede</label>
              <input type="text" value={form.nombreSede} onChange={e => setField('nombreSede', e.target.value)}
                     placeholder="Nombre de la sede" className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.72rem] font-semibold uppercase tracking-wide text-muted">Abonado</label>
              <input type="text" value={form.abonado} onChange={e => setField('abonado', e.target.value)}
                     placeholder="Código abonado" className={inputCls} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.72rem] font-semibold uppercase tracking-wide text-muted">DVR — Cámara</label>
            <input type="text" value={form.dvrCamara} onChange={e => setField('dvrCamara', e.target.value)}
                   placeholder="Ej: D01C14" className={inputCls} />
          </div>
        </div>

        {/* ── Grid: Detalle Operador + Control Inspeccionado ── */}
        <div className={`grid gap-5 mb-5 ${esEstandar ? 'grid-cols-2' : 'grid-cols-1'}`}>

          {/* Detalle operador */}
          <div className="bg-card border border-border rounded-card shadow-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="card-title-bar" />
              <span className="text-[0.7rem] font-bold uppercase tracking-[2px] text-accent1">Detalle Operador</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.72rem] font-semibold uppercase tracking-wide text-muted">Detalle inspección</label>
                <input type="text" value={form.detalle} onChange={e => setField('detalle', e.target.value)}
                       placeholder="Detalle inspección" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.72rem] font-semibold uppercase tracking-wide text-muted">Acción</label>
                <select value={form.accion} onChange={e => setField('accion', e.target.value)} className={inputCls}>
                  <option value="" disabled>Acción</option>
                  {ACCIONES.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-[0.72rem] font-semibold uppercase tracking-wide text-muted">Hallazgo</label>
              <select value={form.hallazgoId} onChange={e => setField('hallazgoId', e.target.value)} className={inputCls}>
                <option value="" disabled>Seleccione hallazgo</option>
                {HALLAZGOS.map(h => <option key={h.id} value={String(h.id)}>{h.nombre}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.72rem] font-semibold uppercase tracking-wide text-muted">Observación</label>
              <textarea value={form.observacion} onChange={e => setField('observacion', e.target.value)}
                        placeholder="Observación..." rows={4}
                        className={`${inputCls} resize-y`} />
            </div>
          </div>

          {/* Control inspeccionado — solo tipo 5 */}
          {esEstandar && (
            <div className="bg-card border border-border rounded-card shadow-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="card-title-bar" />
                <span className="text-[0.7rem] font-bold uppercase tracking-[2px] text-accent1">Control Inspeccionado</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  { key: 'aPrincipal', label: 'A. Principal', iconColor: '#a5b4fc', bgColor: 'rgba(99,102,241,0.2)' },
                  { key: 'aSoporte',   label: 'A. Soporte',   iconColor: '#fdba74', bgColor: 'rgba(251,146,60,0.2)' },
                  { key: 'cctv',       label: 'CCTV',         iconColor: '#fca5a5', bgColor: 'rgba(239,68,68,0.2)' },
                  { key: 'dvr',        label: 'DVR-Cam',      iconColor: '#6ee7b7', bgColor: 'rgba(52,211,153,0.2)' },
                ].map(item => (
                  <div key={item.key}
                    className="flex items-center justify-between px-4 py-3
                               border border-accent1/10 rounded-xl hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-2.5 text-[0.88rem] font-medium text-ink">
                      <div className="w-8 h-8 rounded-lg grid place-items-center flex-shrink-0"
                           style={{ background: item.bgColor }}>
                        <svg className="w-4 h-4 fill-none" strokeWidth="2"
                             style={{ stroke: item.iconColor }} viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                        </svg>
                      </div>
                      {item.label}
                    </div>
                    <Toggle
                      checked={control[item.key]}
                      onChange={val => setControl(c => ({ ...c, [item.key]: val }))}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-5 bg-gray-100 border border-border rounded-xl p-4 text-center">
                <span className="text-[2rem] font-black text-ink tracking-widest">
                  {form.dvrCamara ? form.dvrCamara.toUpperCase() : '—'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Evidencia Fotográfica ── */}
        <div className="bg-card border border-border rounded-card shadow-card p-6 mb-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="card-title-bar" />
            <span className="text-[0.7rem] font-bold uppercase tracking-[2px] text-accent1">Evidencia Fotográfica</span>
          </div>

          {esEstandar ? (
            /* Tipo 5: A.Principal + A.Soporte + CCTV en grid 3 cols */
            <div className="grid grid-cols-3 gap-4">
              <ImageBox label="A. Principal"
                image={imgs.aPrincipal}
                onImage={v => setImgs(i => ({ ...i, aPrincipal: v }))}
                onClear={() => setImgs(i => ({ ...i, aPrincipal: null }))} />
              <ImageBox label="A. Soporte"
                image={imgs.aSoporte}
                onImage={v => setImgs(i => ({ ...i, aSoporte: v }))}
                onClear={() => setImgs(i => ({ ...i, aSoporte: null }))} />
              <ImageBox
                label={form.dvrCamara ? `CCTV: ${form.dvrCamara.toUpperCase()}` : 'CCTV: —'}
                image={imgs.cctv}
                onImage={v => setImgs(i => ({ ...i, cctv: v }))}
                onClear={() => setImgs(i => ({ ...i, cctv: null }))} />
              {/* Extras dentro del mismo grid */}
              {extras.map(ex => (
                <div key={ex.id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <input
                      value={ex.nombre}
                      onChange={e => actualizarExtra(ex.id, 'nombre', e.target.value)}
                      className="bg-transparent border-b border-border text-[0.78rem] font-semibold
                                 text-ink outline-none px-1 py-0.5 w-40 focus:border-accent1"
                    />
                    <button onClick={() => eliminarExtra(ex.id)}
                      className="text-[0.72rem] font-bold text-red-400 hover:text-red-600 transition-colors">
                      ✕ Eliminar
                    </button>
                  </div>
                  <ImageBox
                    image={ex.imagen}
                    onImage={v => actualizarExtra(ex.id, 'imagen', v)}
                    onClear={() => actualizarExtra(ex.id, 'imagen', null)} />
                </div>
              ))}
            </div>
          ) : (
            /* Otros tipos: 1 imagen + extras en grid 3 cols */
            <div className="grid grid-cols-3 gap-4">
              <ImageBox
                label={form.dvrCamara ? form.dvrCamara.toUpperCase() : 'DVR — Cámara'}
                image={imgs.default}
                onImage={v => setImgs(i => ({ ...i, default: v }))}
                onClear={() => setImgs(i => ({ ...i, default: null }))}
                height="200px" />
              {extras.map(ex => (
                <div key={ex.id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <input
                      value={ex.nombre}
                      onChange={e => actualizarExtra(ex.id, 'nombre', e.target.value)}
                      className="bg-transparent border-b border-border text-[0.78rem] font-semibold
                                 text-ink outline-none px-1 py-0.5 w-40 focus:border-accent1"
                    />
                    <button onClick={() => eliminarExtra(ex.id)}
                      className="text-[0.72rem] font-bold text-red-400 hover:text-red-600 transition-colors">
                      ✕ Eliminar
                    </button>
                  </div>
                  <ImageBox
                    image={ex.imagen}
                    onImage={v => actualizarExtra(ex.id, 'imagen', v)}
                    onClear={() => actualizarExtra(ex.id, 'imagen', null)} />
                </div>
              ))}
            </div>
          )}

          <button onClick={agregarExtra}
            className="mt-5 flex items-center gap-1.5 bg-blue-50 border border-dashed border-accent1
                       text-accent1 text-[0.78rem] font-bold px-4 py-2 rounded-btn
                       hover:bg-accent1 hover:text-white hover:border-solid transition-all">
            <svg className="w-3.5 h-3.5 stroke-current fill-none" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Agregar imagen
          </button>
        </div>

        {/* ── Preview ── */}
        <Preview form={form} control={control} imgs={imgs} extras={extras} esEstandar={esEstandar} />

      </main>
      <Toast toast={toast} />
    </div>
  )
}
