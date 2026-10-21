const SectionIndex = ({ number, label }) => {
  return (
    <div className="section-index-badge">
      <span className="index-hash">//</span>
      <span className="index-number">{number}</span>
      <span className="index-divider">•</span>
      <span className="index-label">{label}</span>
    </div>
  );
};

export default SectionIndex;
