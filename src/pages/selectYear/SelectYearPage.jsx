import React from "react";
import Card from "../../UI/card/Card";
import Row from "../../UI/row/Row";
import { Button, Field } from "@fluentui/react-components";

const SelectYearPage = () => {
	return (
		<div
			style={{
				padding: "0 5px",
				marginTop: "20px",
				paddingBottom: "120px",
				display: "flex",
				flexDirection: "column",
				gap: "15px",
			}}
		>
			<Card title="تقارير الاستلام">
				<form
				// onSubmit={(e) => {
				// 	e.preventDefault();
				// 	submitMutation.mutate({ searchBy, value });
				// }}
				>
					<Row>
						<div
							style={{ display: "flex", alignItems: "flex-end", gap: "15px" }}
						>
							<Button appearance="primary" type="submit">
								عرض
							</Button>
						</div>
					</Row>
				</form>
			</Card>
		</div>
	);
};

export default SelectYearPage;
