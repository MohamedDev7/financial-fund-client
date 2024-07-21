import { createContext, useEffect, useState } from "react";
// import { db } from "./../connection.js";
import PropTypes from "prop-types";
import { serverApi } from "./../api/serverApi";
export const AuthContext = createContext({
	currUser: "",
	login: () => {},
	logout: () => {},
});
const AuthContextProvider = ({ children }) => {
	AuthContextProvider.propTypes = {
		children: PropTypes.any,
	};
	const [currUser, setCurrUser] = useState(
		JSON.parse(localStorage.getItem("user")) || null
	);

	useEffect(() => {
		localStorage.setItem("user", JSON.stringify(currUser));
	}, [currUser]);
	const login = async (data) => {
		serverApi.defaults.withCredentials = true;
		const res = await serverApi.post(
			"http://127.0.0.1:8050/api/v1/auth/login",
			// "https://pixalloy.com/edt/api/v1/auth/login",
			data,
			{
				withCredentials: true,
				headers: { crossDomain: true, "Content-Type": "application/json" },
			}
		);
		localStorage.setItem("token", JSON.stringify(res.data.token));
		setCurrUser(res.data.user);
		serverApi.defaults.headers.common["Authorization"] = `Bearer ${JSON.parse(
			localStorage.getItem("token")
		)}`;
	};
	const logout = () => {
		setCurrUser(null);
		localStorage.setItem("token", null);
	};
	const value = {
		currUser,
		login,
		logout,
	};
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContextProvider;
