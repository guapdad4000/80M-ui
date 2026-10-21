import { CONTACT_EMAIL, scopeAnswers, services } from './intakeData';

function Choices({ name, options, value, onChange, error, serviceCards = false }) {
  return (
    <fieldset className={`intake-choices${serviceCards ? ' intake-choices--services' : ''}`}>
      <legend className="sr-only">{name === 'serviceId' ? 'Choose your direction' : 'Choose your starting point'}</legend>
      {options.map((option, index) => {
        const id = typeof option === 'string' ? option : option.id;
        const selected = value === id;
        return (
          <label className="intake-choice" key={id} data-selected={selected}>
            <input type="radio" name={name} value={id} checked={selected} onChange={() => onChange(name, id)} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} />
            <span className="intake-choice__number" aria-hidden="true">{selected ? '✓' : `0${index + 1}`}</span>
            {serviceCards && <span className="intake-choice__tag">{option.tag}</span>}
            <strong>{typeof option === 'string' ? option : option.label}</strong>
            {serviceCards && <span className="intake-choice__description">{option.description}</span>}
          </label>
        );
      })}
      {error && <p className="intake-error" id={`${name}-error`} role="alert">{error}</p>}
    </fieldset>
  );
}

function Field({ label, name, value, onChange, error, hint, multiline = false, ...props }) {
  const Control = multiline ? 'textarea' : 'input';
  return (
    <label className="intake-field">
      <span>{label}</span>
      {hint && <small id={`${name}-hint`}>{hint}</small>}
      <Control name={name} value={value} onChange={event => onChange(name, event.target.value)} aria-invalid={Boolean(error)} aria-describedby={[hint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(' ') || undefined} {...props} />
      {error && <span className="intake-error" id={`${name}-error`} role="alert">{error}</span>}
    </label>
  );
}

function Chips({ legend, name, options, value, onChange }) {
  return (
    <fieldset className="intake-chips">
      <legend>{legend}</legend>
      <div>
        {options.map(option => (
          <label key={option.value || option} data-selected={value === (option.value || option)}>
            <input type="radio" name={name} checked={value === (option.value || option)} value={option.value || option} onChange={() => onChange(name, option.value || option)} />
            <span>{option.label || option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function IntakeSteps({ step, data, service, onChange, errors, onEdit, brief, previewRef, detailsRef }) {
  if (step === 0) return <Choices name="serviceId" options={services} value={data.serviceId} onChange={onChange} error={errors.serviceId} serviceCards />;
  if (step === 1) return <Choices name="startingPoint" options={service?.startingPoints || []} value={data.startingPoint} onChange={onChange} error={errors.startingPoint} />;
  if (step === 2) return (
    <div className="intake-fields">
      <Field multiline label="The idea" name="goal" value={data.goal} onChange={onChange} error={errors.goal} rows={5} maxLength={3000} required placeholder={service?.example} />
      <Field label={<>A link or a reference <em>Optional</em></>} name="links" value={data.links} onChange={onChange} maxLength={1000} placeholder="Your site, project, moodboard, or inspiration" hint="A link is plenty for now. You can share files when we talk." />
    </div>
  );
  if (step === 3) return (
    <div className="intake-fields">
      <Chips legend="Budget" name="budgetMode" options={[{ value: 'discuss', label: 'Let’s scope it together' }, { value: 'range', label: 'I have a range in mind' }]} value={data.budgetMode} onChange={onChange} />
      {data.budgetMode === 'range' && <Field label={<>Your range <em>Optional</em></>} name="budget" value={data.budget} onChange={onChange} maxLength={150} placeholder="e.g. $2,000–$5,000" />}
      <Chips legend="Timing" name="timingChoice" options={['Flexible', 'Next few weeks', 'This month', 'A specific window']} value={data.timingChoice} onChange={onChange} />
      {data.timingChoice === 'A specific window' && <Field label={<>When are you thinking? <em>Optional</em></>} name="timeline" value={data.timeline} onChange={onChange} maxLength={150} placeholder="A date, launch window, or deadline" />}
      <p className="intake-note">Still working these out? Keep the defaults and move on. We’ll talk through scope before making a plan.</p>
    </div>
  );
  if (step === 4) return (
    <div className="intake-fields">
      <Field label="Your name" name="name" value={data.name} onChange={onChange} error={errors.name} autoComplete="name" required maxLength={120} placeholder="What should we call you?" />
      <Field label="Email" name="email" type="email" value={data.email} onChange={onChange} error={errors.email} autoComplete="email" required maxLength={254} placeholder="you@example.com" />
      <p className="intake-note">We’ll use this to reply about your project. No account needed.</p>
    </div>
  );
  const scope = scopeAnswers(data);
  return (
    <div className="intake-review">
      <div className="intake-review__row">
        <div><span>Your direction</span><strong>{service?.label}</strong></div><button type="button" onClick={() => onEdit(0)} aria-label="Edit your direction">Edit ↗</button>
      </div>
      <div className="intake-review__row">
        <div><span>Starting point</span><p>{data.startingPoint}</p></div><button type="button" onClick={() => onEdit(1)} aria-label="Edit starting point">Edit ↗</button>
      </div>
      <div className="intake-review__row">
        <div><span>The idea</span><p>{data.goal.trim()}</p>{data.links.trim() && <p className="intake-review__references">References: {data.links.trim()}</p>}</div><button type="button" onClick={() => onEdit(2)} aria-label="Edit the idea">Edit ↗</button>
      </div>
      <div className="intake-review__row">
        <div><span>Scope & timing</span><p>{scope.budget}<br />{scope.timing}</p></div><button type="button" onClick={() => onEdit(3)} aria-label="Edit scope and timing">Edit ↗</button>
      </div>
      <div className="intake-review__row">
        <div><span>About you</span><p>{data.name.trim()}<br />{data.email.trim()}</p></div><button type="button" onClick={() => onEdit(4)} aria-label="Edit contact details">Edit ↗</button>
      </div>
      <details className="intake-brief" ref={detailsRef}>
        <summary>View the full email brief</summary>
        <label htmlFor="project-brief-preview" className="sr-only">Your complete project brief</label>
        <textarea id="project-brief-preview" ref={previewRef} readOnly value={brief} rows={14} />
      </details>
      <p className="intake-note">Your brief opens as a draft in your email app. Review it, then send it to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </div>
  );
}
