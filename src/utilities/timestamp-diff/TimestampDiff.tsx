import { useState } from 'react';
import './TimestampDiff.css';

type TimestampUnit = 'seconds' | 'milliseconds';

interface MomentState {
  timestamp: string;
  unit: TimestampUnit;
  dateTimeLocal: string;
}

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

function toDateTimeLocalValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function createMomentState(date: Date): MomentState {
  return {
    timestamp: Math.floor(date.getTime() / 1000).toString(),
    unit: 'seconds',
    dateTimeLocal: toDateTimeLocalValue(date),
  };
}

/** Returns the moment's value in milliseconds since the epoch, or null if invalid. */
function momentToMs(moment: MomentState): number | null {
  const numericTimestamp = Number(moment.timestamp);
  if (moment.timestamp.trim() === '' || !Number.isFinite(numericTimestamp)) {
    return null;
  }
  return moment.unit === 'seconds' ? numericTimestamp * 1000 : numericTimestamp;
}

function formatDuration(absMs: number): string {
  const totalSeconds = Math.floor(absMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor(absMs % 1000);

  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (hours || parts.length) parts.push(`${hours}h`);
  if (minutes || parts.length) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  if (milliseconds) parts.push(`${milliseconds}ms`);

  return parts.join(' ');
}

interface MomentInputProps {
  label: string;
  moment: MomentState;
  onChange: (moment: MomentState) => void;
}

function MomentInput({ label, moment, onChange }: MomentInputProps) {
  const handleUnitChange = (nextUnit: TimestampUnit) => {
    const ms = momentToMs(moment);
    if (ms === null || nextUnit === moment.unit) {
      onChange({ ...moment, unit: nextUnit });
      return;
    }
    const nextTimestamp = nextUnit === 'seconds' ? Math.floor(ms / 1000) : Math.floor(ms);
    onChange({ ...moment, unit: nextUnit, timestamp: nextTimestamp.toString() });
  };

  const handleDateTimeChange = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      onChange({ ...moment, dateTimeLocal: value });
      return;
    }
    const ms = parsed.getTime();
    onChange({
      ...moment,
      dateTimeLocal: value,
      timestamp: moment.unit === 'seconds' ? Math.floor(ms / 1000).toString() : ms.toString(),
    });
  };

  const handleUseNow = () => onChange(createMomentState(new Date()));

  return (
    <div className="moment-input">
      <h4>{label}</h4>
      <div className="field-row">
        <label>Timestamp</label>
        <input
          type="text"
          inputMode="numeric"
          value={moment.timestamp}
          onChange={(event) => onChange({ ...moment, timestamp: event.target.value })}
          placeholder="e.g. 1700000000"
        />
        <div className="unit-toggle" role="group" aria-label={`${label} timestamp unit`}>
          <button
            type="button"
            className={moment.unit === 'seconds' ? 'active' : ''}
            onClick={() => handleUnitChange('seconds')}
          >
            Seconds
          </button>
          <button
            type="button"
            className={moment.unit === 'milliseconds' ? 'active' : ''}
            onClick={() => handleUnitChange('milliseconds')}
          >
            Milliseconds
          </button>
        </div>
      </div>
      <div className="field-row">
        <label>Date &amp; time</label>
        <input
          type="datetime-local"
          step="1"
          value={moment.dateTimeLocal}
          onChange={(event) => handleDateTimeChange(event.target.value)}
        />
        <button type="button" onClick={handleUseNow}>
          Use now
        </button>
      </div>
    </div>
  );
}

export function TimestampDiff() {
  const [momentA, setMomentA] = useState<MomentState>(() => createMomentState(new Date()));
  const [momentB, setMomentB] = useState<MomentState>(() => createMomentState(new Date()));

  const msA = momentToMs(momentA);
  const msB = momentToMs(momentB);
  const bothValid = msA !== null && msB !== null;
  const diffMs = bothValid ? msB - msA : null;

  return (
    <div className="utility timestamp-diff">
      <header className="utility-header">
        <h2>Timestamp Diff</h2>
        <p>Calculate the difference between two timestamps or dates.</p>
      </header>

      <section className="utility-section">
        <div className="moment-grid">
          <MomentInput label="A" moment={momentA} onChange={setMomentA} />
          <MomentInput label="B" moment={momentB} onChange={setMomentB} />
        </div>
      </section>

      <section className="utility-section">
        <h3>Difference (B &minus; A)</h3>
        {diffMs === null ? (
          <p className="error">Enter valid numeric timestamps for both A and B.</p>
        ) : (
          <>
            <p className="diff-summary">
              {diffMs === 0
                ? 'A and B are the same moment.'
                : `B is ${formatDuration(Math.abs(diffMs))} ${diffMs > 0 ? 'after' : 'before'} A.`}
            </p>
            <div className="result-grid">
              <div>
                <span className="label">Milliseconds</span>
                <code>{diffMs}</code>
              </div>
              <div>
                <span className="label">Seconds</span>
                <code>{(diffMs / 1000).toFixed(3)}</code>
              </div>
              <div>
                <span className="label">Minutes</span>
                <code>{(diffMs / 60000).toFixed(3)}</code>
              </div>
              <div>
                <span className="label">Hours</span>
                <code>{(diffMs / 3600000).toFixed(3)}</code>
              </div>
              <div>
                <span className="label">Days</span>
                <code>{(diffMs / 86400000).toFixed(3)}</code>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
