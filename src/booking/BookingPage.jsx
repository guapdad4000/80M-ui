import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CollageArt from '../CollageArt';
import IntakeSteps from './IntakeSteps';
import { buildBrief, CONTACT_EMAIL, DRAFT_KEY, emptyData, readDraft, services, stepCopy, steps, validateStep } from './intakeData';
import './booking.css';

export default function BookingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [wizard, setWizard] = useState(() => readDraft(searchParams.get('service')));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const titleRef = useRef(null);
  const paneRef = useRef(null);
  const formRef = useRef(null);
  const previewRef = useRef(null);
  const detailsRef = useRef(null);
  const { data, step, furthest } = wizard;
  const service = services.find(item => item.id === data.serviceId);
  const [title, hint] = stepCopy(step, service);
  const brief = buildBrief(data);

  useEffect(() => {
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(wizard)); } catch { /* The flow also works with storage disabled. */ }
  }, [wizard]);

  function goTo(next) {
    setWizard(current => ({ ...current, step: next, furthest: Math.max(current.furthest, next) }));
    setErrors({});
    setStatus(null);
    requestAnimationFrame(() => {
      paneRef.current?.scrollTo({ top: 0, behavior: 'instant' });
      titleRef.current?.focus({ preventScroll: true });
    });
  }

  function change(name, value) {
    setWizard(current => ({
      ...current,
      ...(name === 'serviceId' && value !== current.data.serviceId ? { furthest: 0 } : {}),
      data: { ...current.data, [name]: value, ...(name === 'serviceId' && value !== current.data.serviceId ? { startingPoint: '' } : {}) },
    }));
    setErrors(current => ({ ...current, [name]: undefined }));
    setStatus(null);
    if (name === 'serviceId') {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('service', value);
      setSearchParams(nextParams, { replace: true, preventScrollReset: true });
    }
  }

  function showErrors(nextErrors) {
    setErrors(nextErrors);
    requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
  }

  function validateAll() {
    for (let index = 0; index < 5; index++) {
      const nextErrors = validateStep(index, data);
      if (Object.keys(nextErrors).length) {
        goTo(index);
        showErrors(nextErrors);
        return false;
      }
    }
    return true;
  }

  function advance(event) {
    event.preventDefault();
    if (step === 5) {
      if (!validateAll()) return;
      setStatus({ kind: 'ready', message: 'Your email draft is ready to review and send. If your email app doesn’t open, use Copy brief.' });
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`80M project inquiry: ${service.label}`)}&body=${encodeURIComponent(brief)}`;
      return;
    }
    const nextErrors = validateStep(step, data);
    if (Object.keys(nextErrors).length) { showErrors(nextErrors); return; }
    goTo(step + 1);
  }

  async function copyBrief() {
    if (!validateAll()) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(brief);
      setStatus({ kind: 'copied', message: `Brief copied. Paste it into an email to ${CONTACT_EMAIL}.` });
    } catch {
      if (detailsRef.current) detailsRef.current.open = true;
      previewRef.current?.focus();
      previewRef.current?.select();
      setStatus({ kind: 'error', message: `Your brief is selected in the preview. Copy it manually and email ${CONTACT_EMAIL}.` });
    }
  }

  function startOver() {
    setWizard({ data: emptyData(), step: 0, furthest: 0 });
    setSearchParams({}, { replace: true, preventScrollReset: true });
    setErrors({});
    setStatus(null);
    requestAnimationFrame(() => {
      paneRef.current?.scrollTo({ top: 0, behavior: 'instant' });
      titleRef.current?.focus({ preventScroll: true });
    });
  }

  return (
    <main className="project-intake">
      <header className="intake-header">
        <Link to="/#top" aria-label="80M home"><img src="/brand/80m-mark-white.svg" alt="80M" width="78" height="48" /></Link>
        <Link to="/#top">← Back to the studio</Link>
      </header>
      <div className="intake-layout">
        <aside className="intake-intro">
          <p className="intake-eyebrow">A good place to start</p>
          <h1><CollageArt name="start-project" text="Start a project." eager /></h1>
          <p className="intake-intro__copy">The idea. The rough draft. The thing you almost finished. Let’s see where we can take it.</p>
          <ol className="intake-step-list" aria-label="Project brief steps">
            {steps.map((item, index) => (
              <li key={item.label} aria-current={index === step ? 'step' : undefined}>
                <button type="button" disabled={index > furthest} onClick={() => goTo(index)}>
                  <span className="intake-step-list__number">{index < step ? '✓' : `0${index + 1}`}</span>
                  <span><strong>{item.label}</strong><small>{item.note}</small></span>
                </button>
              </li>
            ))}
          </ol>
          <p className="intake-intro__aside">You don’t need a finished plan.<br />We’ll figure out the next move together.</p>
        </aside>

        <section className="intake-window" aria-label="Project starter">
          <div className="intake-window__chrome" aria-hidden="true">
            <img src="/brand/landing-art/frame-flat-black.webp" alt="" width="1672" height="941" />
            <span>80M / PROJECT STARTER</span>
          </div>
          <form ref={formRef} className="intake-form" onSubmit={advance} noValidate>
            <div className="intake-progress">
              <div><span>Step {step + 1} of {steps.length}</span><strong>{steps[step].label}</strong></div>
              <div role="progressbar" aria-label="Project brief progress" aria-valuemin={1} aria-valuemax={6} aria-valuenow={step + 1} aria-valuetext={`Step ${step + 1} of 6: ${steps[step].label}`}><span style={{ width: `${(step + 1) / steps.length * 100}%` }} /></div>
            </div>
            <div className="intake-pane" ref={paneRef}>
              <div className="intake-step" key={step}>
                <h2 ref={titleRef} tabIndex={-1}>{title}</h2>
                <p className="intake-step__hint">{hint}</p>
                <IntakeSteps step={step} data={data} service={service} onChange={change} errors={errors} onEdit={goTo} brief={brief} previewRef={previewRef} detailsRef={detailsRef} />
              </div>
            </div>
            <div className="intake-status-area" aria-live="polite" aria-atomic="true">
              {status && <p role={status.kind === 'error' ? 'alert' : 'status'} className="intake-status">{status.message}</p>}
            </div>
            <div className="intake-controls">
              {step > 0 ? <button type="button" className="intake-back" onClick={() => goTo(step - 1)}>← Back</button> : <span className="intake-controls__note">One step at a time.</span>}
              <div>
                {step === 5 && <button type="button" className="intake-copy" onClick={copyBrief}>Copy brief</button>}
                <button type="submit" className="intake-next">{step === 5 ? 'Open email draft' : step === 4 ? 'Review my brief' : 'Continue'} <span aria-hidden="true">↗</span></button>
              </div>
            </div>
          </form>
          <div className="intake-window__footnote"><span>{step === 5 ? 'Nothing is sent until you send the email.' : 'Your answers stay with you as you move between steps.'}</span>{furthest > 0 && <button type="button" onClick={startOver}>Start over</button>}</div>
        </section>
      </div>
    </main>
  );
}
