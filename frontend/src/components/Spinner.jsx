import PropTypes from 'prop-types';

const Spinner = ({ message = 'Loading…' }) => (
  <div className="spinner-wrap" role="status" aria-live="polite">
    <div className="spinner" aria-hidden="true" />
    {message && <p className="spinner-msg">{message}</p>}
  </div>
);

Spinner.propTypes = {
  message: PropTypes.string,
};

export default Spinner;
