export default function PortfolioButton({ onClick, children = 'Explore the portfolio', className = '' }) {
  return (
    <button type="button" onClick={onClick} className={`portfolio-cta ${className}`}>
      <span>{children}</span><span aria-hidden="true">↗</span>
    </button>
  );
}
