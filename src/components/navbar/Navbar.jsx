import classes from "./navbar.module.scss";

import { Link } from "react-router-dom";
import Button from "../Buttons/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { useContext } from "react";
import { AuthContext } from "../../store/auth-context";
// import { AuthContext } from "../../store/auth-context";

const Navbar = () => {
	const authCtx = useContext(AuthContext);
	const logoutHandler = async () => {
		try {
			authCtx.logout();
		} catch (err) {
			console.log(`err`, err);
		}
	};

	return (
		<div className={classes.navbar}>
			<div className={classes.user}>
				{/* <div className={classes.userImg}>
					<img src={authCtx.currUser.img} alt="" />
				</div> */}
				<div>
					{authCtx.currUser.f_name} {authCtx.currUser.l_name}
				</div>
			</div>
			<div>
				<Button
					color="#f0f0f0"
					onClick={logoutHandler}
					backgroundColor="#b23b3b"
					icon={<LogoutIcon />}
				>
					تسجيل الخروج
				</Button>
			</div>
		</div>
	);
};

export default Navbar;
