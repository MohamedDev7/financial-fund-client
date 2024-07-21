import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { getAllReceives } from "../../api/serverApi";
import {
	Button,
	createTableColumn,
	DataGrid,
	DataGridBody,
	DataGridCell,
	DataGridHeader,
	DataGridHeaderCell,
	DataGridRow,
	TableCellLayout,
} from "@fluentui/react-components";
import { AddRegular } from "@fluentui/react-icons";
import Card from "../../UI/card/Card";
import TopBar from "../../components/TopBar/TopBar";

const ReceivePage = () => {
	//hooks
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	//states
	const [sortState, setSortState] = useState({
		sortColumn: "id",
		sortDirection: "ascending",
	});
	//queries
	const { data: receives } = useQuery({
		queryKey: ["receives"],
		queryFn: getAllReceives,
		select: (res) => {
			console.log(`res`, res);
			return res.data.receives.map((el) => el);
		},
	});
	//functions

	const onSortChange = (e, nextSortState) => {
		setSortState(nextSortState);
	};

	const columns = [
		createTableColumn({
			columnId: "id",
			compare: (a, b) => {
				return a.id.toString().localeCompare(b.id.toString());
			},
			renderHeaderCell: () => {
				return "م";
			},
			renderCell: (item) => {
				return <TableCellLayout>{item.id}</TableCellLayout>;
			},
		}),
		createTableColumn({
			columnId: "title",
			compare: (a, b) => {
				return a.title.toString().localeCompare(b.title.toString());
			},
			renderHeaderCell: () => {
				return "العنوان";
			},
			renderCell: (item) => {
				return <TableCellLayout>{item.title}</TableCellLayout>;
			},
		}),
		createTableColumn({
			columnId: "amount",
			compare: (a, b) => {
				return a.amount.toString().localeCompare(b.amount.toString());
			},
			renderHeaderCell: () => {
				return "الاجمالي";
			},
			renderCell: (item) => {
				return (
					<TableCellLayout>{item.amount.toLocaleString()}</TableCellLayout>
				);
			},
		}),
		createTableColumn({
			columnId: "date",
			compare: (a, b) => {
				return a.date.toString().localeCompare(b.date.toString());
			},
			renderHeaderCell: () => {
				return "التاريخ";
			},
			renderCell: (item) => {
				return <TableCellLayout>{item.date}</TableCellLayout>;
			},
		}),
		createTableColumn({
			columnId: "type",
			compare: (a, b) => {
				return a.type.toString().localeCompare(b.type.toString());
			},
			renderHeaderCell: () => {
				return "النوع";
			},
			renderCell: (item) => {
				return <TableCellLayout>{item.type}</TableCellLayout>;
			},
		}),
	];
	return (
		<>
			<TopBar
				right={
					<>
						<Button
							appearance="primary"
							icon={<AddRegular />}
							onClick={() => {
								navigate("./add");
							}}
						>
							قبض مستحقات
						</Button>
						<Button
							appearance="secondary"
							icon={<AddRegular />}
							onClick={() => {
								navigate("./addOther");
							}}
						>
							قبض اخرى
						</Button>
					</>
				}
			/>
			<div
				style={{
					padding: "0 5px",
					marginTop: "80px",
					paddingBottom: "120px",
					display: "flex",
					flexDirection: "column",
					gap: "15px",
				}}
			>
				{receives && (
					<Card>
						<DataGrid
							items={receives}
							columns={columns}
							sortable
							selectionMode="multiselect"
							getRowId={(item) => item.id}
							sortState={sortState}
							onSortChange={onSortChange}
							style={{ minWidth: "500px" }}
						>
							<DataGridHeader>
								<DataGridRow>
									{({ renderHeaderCell }) => (
										<DataGridHeaderCell>
											{renderHeaderCell()}
										</DataGridHeaderCell>
									)}
								</DataGridRow>
							</DataGridHeader>
							<DataGridBody>
								{({ item, rowId }) => (
									<DataGridRow key={rowId}>
										{({ renderCell }) => (
											<DataGridCell>{renderCell(item)}</DataGridCell>
										)}
									</DataGridRow>
								)}
							</DataGridBody>
						</DataGrid>
					</Card>
				)}
			</div>
		</>
	);
};

export default ReceivePage;
