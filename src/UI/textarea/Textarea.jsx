import classes from "./textInput.module.scss";
import PropTypes from "prop-types";
const Textarea = ({
	title,
	disabled,
	onChange,
	value,
	defaultValue,
	min,
	max,
	placeholder,
}) => {
	Textarea.propTypes = {
		title: PropTypes.any,
		type: PropTypes.any,
		disabled: PropTypes.any,
		onChange: PropTypes.any,
		value: PropTypes.any,
		defaultValue: PropTypes.any,
		min: PropTypes.any,
		max: PropTypes.any,
		placeholder: PropTypes.any,
	};

	return (
		<div className={classes.container}>
			<label htmlFor={`${title}_input`}>{title}</label>
			<textarea
				id={`${title}_input`}
				style={{ resize: "none" }}
				disabled={disabled}
				onChange={onChange}
				value={value}
				defaultValue={defaultValue}
				min={min}
				max={max}
				placeholder={placeholder}
				rows="5"
			/>
		</div>
	);
};

export default Textarea;
