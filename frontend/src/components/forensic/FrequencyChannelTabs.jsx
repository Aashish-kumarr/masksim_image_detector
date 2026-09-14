export default function FrequencyChannelTabs({
  activeChannel = "Combined",
  onSelectChannel,
  channels = ["Combined", "Y", "Cb", "Cr"],
  disabled = false,
}) {
  const channelLabels = {
    Combined: "Combined",
    Y: "Y (Luma)",
    Cb: "Cb (Chroma-B)",
    Cr: "Cr (Chroma-R)",
  };

  return (
    <div
      className="tab-nav"
      role="tablist"
      aria-label="Frequency Channel Selector"
    >
      {channels.map((ch) => {
        const isSelected = activeChannel === ch;
        return (
          <button
            key={ch}
            type="button"
            role="tab"
            aria-selected={isSelected}
            disabled={disabled}
            className={`tab-btn ${isSelected ? "active" : ""}`}
            onClick={() => onSelectChannel?.(ch)}
            style={{
              opacity: disabled ? 0.6 : 1,
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            {channelLabels[ch] || ch}
          </button>
        );
      })}
    </div>
  );
}
