import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

function Disclaimer ({ handleCloseDisclaimer }) {
  return (
    <div className="disclaimer-banner" role="alert">
      <h3>Course locations for Fall 2025 have not been released. The map is currently showing course locations for Spring 2025.</h3>
      <button className="close-disclaimer-btn" onClick={handleCloseDisclaimer} aria-label="Close disclaimer">
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

// Prop validation
Disclaimer.propTypes = {
  handleCloseDisclaimer: PropTypes.func.isRequired,
};

export default Disclaimer;