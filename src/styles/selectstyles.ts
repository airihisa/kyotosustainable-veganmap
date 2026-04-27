export const selectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderRadius: '0px',
    border: 'none',
    borderBottom: state.hasValue
      ? '1.5px solid #CAAD5F'
      : '1.5px solid #000000',
    boxShadow: 'none',
    minHeight: '34px',
    height: '34px',
    fontSize: '10px',
    fontWeight: '400',
    backgroundColor: '#ffffff',
    letterSpacing: '0.10em',
    cursor: 'pointer',
    transition: 'border-color 0.3s ease',
    '&:hover': {
      borderBottom: '1.5px solid #CAAD5F',
    }
  }),

  valueContainer: (provided: any) => ({
    ...provided,
    padding: '0 2px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
  }),

  placeholder: (provided: any) => ({
    ...provided,
    color: '#000000',
    opacity: 1,
    fontSize: '10px',
    fontWeight: '400',
  }),

  singleValue: (provided: any) => ({
    ...provided,
    color: '#000000',
    fontSize: '10px',
    fontWeight: '400',
  }),

  input: (provided: any) => ({
    ...provided,
    margin: '0px',
    padding: '0px',
    fontSize: '10px',
  }),

  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: '9px',
    fontWeight: '700',
    backgroundColor: state.isSelected
      ? '#000000'
      : state.isFocused
        ? '#eeeeee'
        : '#ffffff',
    color: state.isSelected ? '#ffffff' : '#000000',
    cursor: 'pointer',
    padding: '12px 16px',
    transition: 'all 0.2s ease',
  }),

  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: '#CAAD5F',
    borderRadius: '0px',
  }),

  multiValueLabel: (provided: any) => ({
    ...provided,
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: '400',
    padding: '2px 6px',
  }),

  multiValueRemove: (provided: any) => ({
    ...provided,
    color: '#ffffff',
    '&:hover': { backgroundColor: '#CAAD5F', color: '#ffffff' },
  }),

  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#fafafa',
    borderRadius: '0px',
    border: '1.5px solid #000000',
    boxShadow: '10px 10px 0px rgba(0,0,0,0.03)',
    marginTop: '4px',
  }),

  indicatorSeparator: () => ({ display: 'none' }),

  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#000000',
    padding: '2px',
    transform: 'scale(0.8)',
  }),

  clearIndicator: (provided: any) => ({
    ...provided,
    color: '#000000',
    padding: '2px',
    transform: 'scale(0.8)',
  }),
};
