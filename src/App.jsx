import { useContext } from "react";

import Navbar from "./components/navbar/Navbar";
import SideBar from "./components/sideBar/SideBar";
import LoginPage from "./pages/login/LoginPage";

import PropTypes from "prop-types";
import Card from "./UI/card/Card";
import {
	createHashRouter,
	RouterProvider,
	Outlet,
	Navigate,
} from "react-router-dom";
import { AuthContext } from "./store/auth-context";
import RemittancesListsPage from "./pages/remittances/RemittancesListsPage";
import AddRemittancesUsingExcelPage from "./pages/remittances/AddRemittancesUsingExcelPage";
import Search from "./pages/remittances/Search";
import BeneficiariesPage from "./pages/beneficiaries/BeneficiariesPage";
import AddBeneficiaryPage from "./pages/beneficiaries/AddBeneficiaryPage";
import AddRemittancesPage from "./pages/remittances/AddRemittancesPage";
import HomePage from "./pages/home/HomePage";
import ReceivePage from "./pages/receive/ReceivePage";
import AddReceivePage from "./pages/receive/AddReceivePage";
import AddOtherReceivePage from "./pages/receive/AddOtherReceivePage";

function App() {
	const { currUser } = useContext(AuthContext);
	const ProtectedRoute = ({ children }) => {
		ProtectedRoute.propTypes = { children: PropTypes.any };
		if (!currUser) {
			return <Navigate to="/login" />;
		}
		return children;
	};
	const RedirectLogedinUser = ({ children }) => {
		RedirectLogedinUser.propTypes = { children: PropTypes.any };
		if (currUser) {
			return <Navigate to="/" />;
		}
		return children;
	};
	const Layout = () => {
		return (
			<div
				style={{
					display: "flex",
					backgroundColor: "#edeef5",
					height: "100vh",
				}}
			>
				<SideBar />

				<div
					style={{
						flex: 17,
						display: "flex",
						flexDirection: "column",
						position: "relative",
					}}
				>
					<Navbar />
					<div style={{ overflowY: "auto" }}>
						<Outlet />
					</div>
				</div>
			</div>
		);
	};

	const router = createHashRouter([
		{
			path: "login",
			element: (
				<RedirectLogedinUser>
					<LoginPage />
				</RedirectLogedinUser>
			),
		},
		{
			path: "/",
			element: (
				<ProtectedRoute>
					<Layout />
				</ProtectedRoute>
			),
			children: [
				{
					path: "/",
					element: <Navigate to="/home" />,
				},
				{
					path: "remittancesLists",
					element: <Outlet />,
					children: [
						{
							path: "",
							element: <RemittancesListsPage />,
						},
						{
							path: "add",
							element: <AddRemittancesPage />,
						},
						{
							path: "addUsingExcel",
							element: <AddRemittancesUsingExcelPage />,
						},
					],
				},
				{
					path: "search",
					element: <Search />,
				},
				{
					path: "home",
					element: <HomePage />,
				},
				{
					path: "receive",
					element: <Outlet />,
					children: [
						{
							path: "",
							element: <ReceivePage />,
						},
						{
							path: "add",
							element: <AddReceivePage />,
						},
						{
							path: "addOther",
							element: <AddOtherReceivePage />,
						},
					],
				},
				{
					path: "beneficiaries",
					element: <Outlet />,
					children: [
						{
							path: "",
							element: <BeneficiariesPage />,
						},
						{
							path: "add",
							element: <AddBeneficiaryPage />,
						},
					],
				},
			],
		},
	]);
	return <RouterProvider router={router} />;
}

export default App;
