import classes from "./textInput.module.scss";
import PropTypes from "prop-types";
const TextInput = ({
	title,
	// width,
	type,
	disabled,
	onChange,
	value,
	// defaultValue,
	min,
	max,
	placeholder,
	step,
	// className,
}) => {
	TextInput.propTypes = {
		title: PropTypes.any,
		// width: PropTypes.any,
		type: PropTypes.any,
		disabled: PropTypes.any,
		onChange: PropTypes.any,
		value: PropTypes.any,
		// defaultValue: PropTypes.any,
		min: PropTypes.any,
		max: PropTypes.any,
		placeholder: PropTypes.any,
		step: PropTypes.any,
		// className: PropTypes.any,
	};

	return (
		<div className={classes.container}>
			<label htmlFor={`${title}_input`}>{title}</label>
			<input
				// className={className}
				type={type ? type : "text"}
				// id={`${title}_input`}
				// style={{ width: width }}
				disabled={disabled}
				onChange={onChange}
				value={value}
				// defaultValue={defaultValue}
				min={min}
				max={max}
				placeholder={placeholder}
				step={step}
			/>
		</div>
	);
};

export default TextInput;
