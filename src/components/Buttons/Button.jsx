import classes from "./buttons.module.scss";
import PropTypes from "prop-types";

const Button = ({
	type,
	disabled,
	onClick,
	children,
	color,
	backgroundColor,
	icon,
}) => {
	Button.propTypes = {
		type: PropTypes.any,
		disabled: PropTypes.any,
		onClick: PropTypes.any,
		children: PropTypes.any,
		color: PropTypes.any,
		backgroundColor: PropTypes.any,
		icon: PropTypes.any,
	};
	return (
		<button
			className={classes.button}
			type={type}
			style={{
				background: `${backgroundColor ? backgroundColor : "blue"}`,
				opacity: disabled ? "50%" : "100%",
				color: `${color ? color : "#000"}`,
				cursor: disabled ? "default" : "pointer",
			}}
			onClick={onClick}
			disabled={disabled}
		>
			{icon && <div className={classes.icon}>{icon}</div>}
			<div className={classes.text}>{children}</div>
		</button>
	);
};

export default Button;
