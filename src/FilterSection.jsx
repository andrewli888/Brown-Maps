import PropTypes from 'prop-types';
import Select from 'react-select';

function FilterSection({ labelText, inputId, selectOptions, handleChange }) {
  return (
    <div className="filter-section">
      <label htmlFor="inputId" className="form-label">
        {labelText}
      </label>
      <Select
        isMulti
        options={selectOptions}
        placeholder={`Any ${labelText}`}
        inputId={inputId}
        onChange={handleChange}
      />
    </div>
  );
}

// Prop validation
FilterSection.propTypes = {
  labelText: PropTypes.string,
  inputId: PropTypes.string,
  selectOptions: PropTypes.list,
  handleChange: PropTypes.func,
}

export default FilterSection;