import { AlertCircle, LoaderCircle } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import type { ProjectInput } from '../types';

type FormValues = Omit<ProjectInput, 'units' | 'pvPower'> & { units: string; pvPower: string };

export function ProjectForm({ initial, submitLabel, onSubmit, onCancel }: { initial?: ProjectInput; submitLabel: string; onSubmit: (data: ProjectInput) => Promise<void>; onCancel: () => void }) {
  const [values, setValues] = useState<FormValues>({ name: initial?.name ?? '', address: initial?.address ?? '', city: initial?.city ?? '', units: initial ? String(initial.units) : '', pvPower: initial ? String(initial.pvPower) : '' });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const setField = (field: keyof FormValues, value: string) => setValues((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); setError(null);
    const units = Number(values.units); const pvPower = Number(values.pvPower);
    if (!values.name.trim() || !values.address.trim() || !values.city.trim()) return setError('Bitte fülle alle Pflichtfelder aus.');
    if (!Number.isInteger(units) || units <= 0) return setError('Die Anzahl der Wohneinheiten muss eine positive ganze Zahl sein.');
    if (!Number.isInteger(pvPower) || pvPower <= 0) return setError('Die PV-Leistung muss eine positive ganze Zahl sein.');
    setSubmitting(true);
    try { await onSubmit({ name: values.name.trim(), address: values.address.trim(), city: values.city.trim(), units, pvPower }); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Speichern fehlgeschlagen.'); }
    finally { setSubmitting(false); }
  };

  return <form className="project-form" onSubmit={handleSubmit} noValidate>
    {error && <div className="form-error"><AlertCircle />{error}</div>}
    <div className="form-grid">
      <label className="form-field form-field--wide"><span>Projektname *</span><input value={values.name} onChange={(event) => setField('name', event.target.value)} placeholder="z. B. Hafenquartier" autoFocus /></label>
      <label className="form-field form-field--wide"><span>Adresse *</span><input value={values.address} onChange={(event) => setField('address', event.target.value)} placeholder="Straße und Hausnummer" /></label>
      <label className="form-field"><span>Ort *</span><input value={values.city} onChange={(event) => setField('city', event.target.value)} placeholder="z. B. Hamburg" /></label>
      <label className="form-field"><span>Anzahl Wohneinheiten *</span><input type="number" min="1" step="1" value={values.units} onChange={(event) => setField('units', event.target.value)} placeholder="24" /></label>
      <label className="form-field"><span>PV-Leistung in kWp *</span><input type="number" min="1" step="1" value={values.pvPower} onChange={(event) => setField('pvPower', event.target.value)} placeholder="48" /></label>
    </div>
    <footer className="form-actions"><button type="button" className="button button--ghost" onClick={onCancel}>Abbrechen</button><button className="button" disabled={submitting}>{submitting && <LoaderCircle className="spin-icon" />}{submitLabel}</button></footer>
  </form>;
}
