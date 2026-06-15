import { useEffect, useState } from 'react';
import './TimestampConverter.css';

type TimestampUnit = 'seconds' | 'milliseconds';

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

function toDateTimeLocalValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function TimestampConverter() {
  const [timestamp, setTimestamp] = useState(() => Math.floor(Date.now() / 1000).toString());
  const [unit, setUnit] = useState<TimestampUnit>('seconds');
  const [dateTimeLocal, setDateTimeLocal] = useState(() => toDateTimeLocalValue(new Date()));
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const numericTimestamp = Number(timestamp);
  const hasValidTimestamp = timestamp.trim() !== '' && Number.isFinite(numericTimestamp);
  const milliseconds = hasValidTimestamp
    ? unit === 'seconds'
      ? numericTimestamp * 1000
      : numericTimestamp
    : NaN;
  const parsedDate = hasValidTimestamp ? new Date(milliseconds) : null;
  const isValidDate = parsedDate !== null && !Number.isNaN(parsedDate.getTime());

  const handleUseNow = () => {
    const nowMs = Date.now();
    setTimestamp(unit === 'seconds' ? Math.floor(nowMs / 1000).toString() : nowMs.toString());
  };

  const handleUnitChange = (nextUnit: TimestampUnit) => {
    if (nextUnit === unit || !hasValidTimestamp) {
      setUnit(nextUnit);
      return;
    }
    const ms = unit === 'seconds' ? numericTimestamp * 1000 : numericTimestamp;
    setTimestamp(nextUnit === 'seconds' ? Math.floor(ms / 1000).toString() : Math.floor(ms).toString());
    setUnit(nextUnit);
  };

  const handleDateTimeChange = (value: string) => {
    setDateTimeLocal(value);
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      const ms = parsed.getTime();
      setTimestamp(unit === 'seconds' ? Math.floor(ms / 1000).toString() : ms.toString());
    }
  };

  return (
    <div className="utility timestamp-converter">
      <header className="utility-header">
        <h2>Timestamp Converter</h2>
        <p>Convert between Unix timestamps and human-readable dates.</p>
      </header>

      <section className="utility-section">
        <h3>Current time</h3>
        <div className="current-time">
          <div>
            <span className="label">Seconds</span>
            <code>{Math.floor(now.getTime() / 1000)}</code>
          </div>
          <div>
            <span className="label">Milliseconds</span>
            <code>{now.getTime()}</code>
          </div>
          <div>
            <span className="label">ISO 8601</span>
            <code>{now.toISOString()}</code>
          </div>
        </div>
      </section>

      <section className="utility-section">
        <h3>Timestamp &rarr; Date</h3>
        <div className="field-row">
          <label htmlFor="timestamp-input">Timestamp</label>
          <input
            id="timestamp-input"
            type="text"
            inputMode="numeric"
            value={timestamp}
            onChange={(event) => setTimestamp(event.target.value)}
            placeholder="e.g. 1700000000"
          />
          <div className="unit-toggle" role="group" aria-label="Timestamp unit">
            <button
              type="button"
              className={unit === 'seconds' ? 'active' : ''}
              onClick={() => handleUnitChange('seconds')}
            >
              Seconds
            </button>
            <button
              type="button"
              className={unit === 'milliseconds' ? 'active' : ''}
              onClick={() => handleUnitChange('milliseconds')}
            >
              Milliseconds
            </button>
          </div>
          <button type="button" onClick={handleUseNow}>
            Use now
          </button>
        </div>

        {isValidDate && parsedDate ? (
          <div className="result-grid">
            <div>
              <span className="label">Local</span>
              <code>{parsedDate.toString()}</code>
            </div>
            <div>
              <span className="label">UTC</span>
              <code>{parsedDate.toUTCString()}</code>
            </div>
            <div>
              <span className="label">ISO 8601</span>
              <code>{parsedDate.toISOString()}</code>
            </div>
          </div>
        ) : (
          <p className="error">Enter a valid numeric timestamp.</p>
        )}
      </section>

      <section className="utility-section">
        <h3>Date &rarr; Timestamp</h3>
        <div className="field-row">
          <label htmlFor="date-input">Local date &amp; time</label>
          <input
            id="date-input"
            type="datetime-local"
            step="1"
            value={dateTimeLocal}
            onChange={(event) => handleDateTimeChange(event.target.value)}
          />
        </div>
        <div className="result-grid">
          <div>
            <span className="label">Seconds</span>
            <code>{isValidDate && parsedDate ? Math.floor(parsedDate.getTime() / 1000) : '-'}</code>
          </div>
          <div>
            <span className="label">Milliseconds</span>
            <code>{isValidDate && parsedDate ? parsedDate.getTime() : '-'}</code>
          </div>
        </div>
      </section>
    </div>
  );
}
