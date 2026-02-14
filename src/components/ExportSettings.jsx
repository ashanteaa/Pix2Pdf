import { ORIENTATIONS, PAGE_SIZES } from '../utils/constants';

function ExportSettings({ settings, onSettingsChange, darkMode, onToggleDarkMode }) {
  return (
    <section className="panel">
      <h2>Export Settings</h2>
      <div className="settings-grid">
        <label>
          Orientation
          <select
            value={settings.orientation}
            onChange={(e) => onSettingsChange('orientation', e.target.value)}
          >
            {ORIENTATIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Page Size
          <select value={settings.pageSize} onChange={(e) => onSettingsChange('pageSize', e.target.value)}>
            {PAGE_SIZES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Margin ({settings.margin}mm)
          <input
            type="range"
            min="5"
            max="30"
            step="1"
            value={settings.margin}
            onChange={(e) => onSettingsChange('margin', Number(e.target.value))}
          />
        </label>

        <label className="toggle-row">
          Dark pastel mode
          <button type="button" className="toggle-btn" onClick={onToggleDarkMode}>
            {darkMode ? 'On' : 'Off'}
          </button>
        </label>
      </div>
    </section>
  );
}

export default ExportSettings;
