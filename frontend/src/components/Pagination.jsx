import './Pagination.css';

const Pagination = ({ pagination, onChange }) => {
  if (!pagination?.pages || pagination.pages <= 1) return null;
  const { page, pages } = pagination;
  const prev = () => onChange(Math.max(1, page - 1));
  const next = () => onChange(Math.min(pages, page + 1));

  return (
    <div className="pager">
      <button className="btn secondary" disabled={page === 1} onClick={prev}>Previous</button>
      <span className="pager-status">Page {page} of {pages}</span>
      <button className="btn secondary" disabled={page === pages} onClick={next}>Next</button>
    </div>
  );
};

export default Pagination;
