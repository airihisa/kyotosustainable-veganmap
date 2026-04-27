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
  }),

  multiValueRemove: (provided: any) => ({
    ...provided,
    color: '#ffffff',
    '&:hover': { backgroundColor: '#CAAD5F', color: '#ffffff' },
  }),

  indicatorSeparator: () => ({ display: 'none' }),
};
