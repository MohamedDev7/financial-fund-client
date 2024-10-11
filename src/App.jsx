import { useContext } from "react";

import Navbar from "./components/navbar/Navbar";
import SideBar from "./components/sideBar/SideBar";
import LoginPage from "./pages/login/LoginPage";

import PropTypes from "prop-types";
import {
	createHashRouter,
	RouterProvider,
	Outlet,
	Navigate,
} from "react-router-dom";
import { AuthContext } from "./store/auth-context";
import DuesListsPage from "./pages/dues/DuesListsPage";
import DuesUsingExcelFormPage from "./pages/dues/DuesUsingExcelFormPage";
import Search from "./pages/dues/Search";
import BeneficiariesPage from "./pages/beneficiaries/BeneficiariesPage";
import BeneficiaryFormPage from "./pages/beneficiaries/BeneficiaryFormPage";
import DueFormPage from "./pages/dues/DueFormPage";
import HomePage from "./pages/home/HomePage";
import ReceivePage from "./pages/receive/ReceivePage";
import AddReceivePage from "./pages/receive/AddReceivePage";
import ReceiveTemplate from "./pages/templates/ReceiveTemplate";
import DuesListTemplate from "./pages/templates/DueListTemplate";
import PayTemplate from "./pages/templates/PayTemplate";
import PayPage from "./pages/pay/PayPage";
import AddPayPage from "./pages/pay/AddPayPage";
import TreasuryFromPage from "./pages/treasuries/TreasuryFromPage";
import TreasuriesPage from "./pages/treasuries/TreasuriesPage";
import UsersPage from "./pages/users/UsersPage";
import UserFormPage from "./pages/users/UserFormPage";
import PaysListPage from "./pages/pay/PaysListPage";
import PayDuesTemplate from "./pages/templates/PayDuesTemplate";
import ReceiveReport from "./pages/reports/ReceiveReport";
import ReceiveReportTemplate from "./pages/templates/ReceiveReportTemplate";
import SalaryAdvancesPage from "./pages/salaryAdvances/SalaryAdvancesPage";
import SalaryAdvanceFormPage from "./pages/salaryAdvances/SalaryAdvanceFormPage";
import PaySalaryAdvanceTemplate from "./pages/templates/PaySalaryAdvanceTemplate";
import PayDuesListTemplate from "./pages/templates/PayDuesListTemplate";
import AddDuesUsingTemplatePage from "./pages/dues/AddDuesUsingTemplatePage";
import SelectYearPage from "./pages/selectYear/SelectYearPage";
import HrDuesFormPage from "./pages/dues/HrDuesFormPage";

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
					backgroundColor: "#f4f6f9",
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
					<div style={{ overflowY: "auto", padding: " 0 15px" }}>
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
					path: "duesLists",
					element: <Outlet />,
					children: [
						{
							path: "",
							element: <DuesListsPage />,
						},
						{
							path: "add",
							element: <DueFormPage />,
						},
						{
							path: "edit",
							element: <DueFormPage />,
						},
						{
							path: "editExcel",
							element: <DuesUsingExcelFormPage />,
						},
						{
							path: "print",
							element: <DuesListTemplate />,
						},
						{
							path: "addUsingExcel",
							element: <DuesUsingExcelFormPage />,
						},
						{
							path: "addUsingTemplate",
							element: <AddDuesUsingTemplatePage />,
						},
						{
							path: "addHrDues",
							element: <HrDuesFormPage />,
						},
						{
							path: "editHrDues",
							element: <HrDuesFormPage />,
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
							path: "print",
							element: <ReceiveTemplate />,
						},
					],
				},
				{
					path: "salaryAdvance",
					element: <Outlet />,
					children: [
						{
							path: "",
							element: <SalaryAdvancesPage />,
						},
						{
							path: "add",
							element: <SalaryAdvanceFormPage />,
						},
						{
							path: "print",
							element: <PaySalaryAdvanceTemplate />,
						},
					],
				},
				{
					path: "pay",
					element: <Outlet />,
					children: [
						{
							path: "",
							element: <PayPage />,
							children: [
								{ path: "paysList", element: <PaysListPage /> },
								{ path: "search", element: <Search /> },
							],
						},
						{
							path: "add",
							element: <AddPayPage />,
						},
						{
							path: "print",
							element: <PayTemplate />,
						},
						{
							path: "printDues",
							element: <PayDuesTemplate />,
						},
						{
							path: "printDuesList",
							element: <PayDuesListTemplate />,
						},
					],
				},
				{
					path: "users",
					element: <Outlet />,
					children: [
						{
							path: "",
							element: <UsersPage />,
						},
						{
							path: "add",
							element: <UserFormPage />,
						},
						{
							path: "edit",
							element: <UserFormPage />,
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
							element: <BeneficiaryFormPage />,
						},
						{
							path: "edit",
							element: <BeneficiaryFormPage />,
						},
					],
				},
				{
					path: "treasuries",
					element: <Outlet />,
					children: [
						{
							path: "",
							element: <TreasuriesPage />,
						},
						{
							path: "add",
							element: <TreasuryFromPage />,
						},
						{
							path: "edit",
							element: <TreasuryFromPage />,
						},
					],
				},
				{
					path: "ReceiveReport",
					element: <Outlet />,
					children: [
						{
							path: "",
							element: <ReceiveReport />,
						},
						{
							path: "print",
							element: <ReceiveReportTemplate />,
						},
					],
				},
				{
					path: "year",
					element: <SelectYearPage />,
				},
			],
		},
	]);
	return <RouterProvider router={router} />;
}

export default App;
