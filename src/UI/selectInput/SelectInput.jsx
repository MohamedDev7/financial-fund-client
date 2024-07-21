import classes from "./selectInput.module.scss";
import { FormControl, MenuItem, Select } from "@mui/material";
import PropTypes from "prop-types";
const SelectInput = ({
	label,
	options,
	onChange,
	value,
	emptyMsg,
	disableMain,
}) => {
	SelectInput.propTypes = {
		label: PropTypes.any,
		options: PropTypes.any,
		onChange: PropTypes.any,
		value: PropTypes.any,
		emptyMsg: PropTypes.any,
		disableMain: PropTypes.any,
	};

	return (
		<div className={classes.container}>
			<label>{label}</label>
			<FormControl>
				<Select
					sx={{ height: 30, fontSize: 14 }}
					value={value}
					displayEmpty
					onChange={onChange}
					defaultValue=""
				>
					{emptyMsg ? <MenuItem value="">{emptyMsg}</MenuItem> : ""}

					{options &&
						options.map((el, i) => (
							<MenuItem
								value={el.value}
								key={i}
								disabled={disableMain && el.children.length > 0 ? true : false}
								sx={{ fontSize: 14 }}
							>
								{el.text}
							</MenuItem>
						))}
				</Select>
			</FormControl>
		</div>
	);
};

export default SelectInput;
