import React, { useState } from "react";

import { Tab, TabList } from "@fluentui/react-components";
import Search from "../dues/Search";
import PaysListPage from "./PaysListPage.jsx";
import { useNavigate } from "react-router-dom";
const PayPage = () => {
	//hooks
	const navigate = useNavigate();
	//states

	const [selectedValue, setSelectedValue] = useState("searchDues");

	//functions
	const onTabSelect = (event, data) => {
		setSelectedValue(data.value);
	};
	return (
		<>
			<div style={{ marginTop: "50px" }}>
				<TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
					<Tab
						id="Arrivals"
						value="searchDues"
						style={{ width: "50%" }}
						onClick={() => navigate("./search")}
					>
						بحث المستحقات
					</Tab>
					<Tab
						id="Departures"
						value="pays"
						style={{ width: "50%" }}
						onClick={() => navigate("./paysList")}
					>
						سندات الصرف
					</Tab>
				</TabList>
				<div>
					{selectedValue === "searchDues" && <Search />}
					{selectedValue === "pays" && <PaysListPage />}
				</div>
			</div>
		</>
	);
};

export default PayPage;
