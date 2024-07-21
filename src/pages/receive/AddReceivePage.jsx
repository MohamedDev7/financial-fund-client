import React, { useState } from "react";
import Card from "../../UI/card/Card";
import {
	Field,
	Select,
	DataGridBody,
	DataGridRow,
	DataGrid,
	DataGridHeader,
	DataGridHeaderCell,
	DataGridCell,
	TableCellLayout,
	createTableColumn,
	Button,
} from "@fluentui/react-components";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { addReceive, getAllDocs, updateDoc } from "../../api/serverApi";
import { toast } from "react-toastify";

const AddReceivePage = () => {
	//hooks
	const queryClient = useQueryClient();
	//states
	const [type, setType] = useState("مستحقات");
	const [sortState, setSortState] = useState({
		sortColumn: "id",
		sortDirection: "ascending",
	});
	//queries
	const { data: docs } = useQuery({
		queryKey: ["doc", "1", type],
		queryFn: getAllDocs,
		select: (res) => {
			console.log(`res.data`, res.data.docs);

			return res.data.docs.map((el) => el);
		},
		enabled: type === "مستحقات",
	});
	const addMutation = useMutation({
		mutationFn: addReceive,
		onSuccess: (res) => {
			toast.success("تم قبض المبلغ بنجاح الحالة بنجاح", {
				position: toast.POSITION.TOP_CENTER,
			});
			queryClient.invalidateQueries({ queryKey: ["doc", "reviewed", type] });
		},
		onError: (err) => {
			toast.error("حصل خطأ أثناء عملية الحفظ،الرجاء التواصل مع الدعم الفني", {
				position: toast.POSITION.TOP_CENTER,
			});
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
			columnId: "total",
			compare: (a, b) => {
				return a.total.toString().localeCompare(b.total.toString());
			},
			renderHeaderCell: () => {
				return "الاجمالي";
			},
			renderCell: (item) => {
				return <TableCellLayout>{item.total.toLocaleString()}</TableCellLayout>;
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
			columnId: "options",
			renderHeaderCell: () => {
				return "خيارات";
			},
			renderCell: (item) => {
				return (
					<TableCellLayout>
						<Button
							appearance="primary"
							onClick={() =>
								addMutation.mutate({
									...item,
									state: "received",
									type: "مستحقات",
								})
							}
						>
							قبض
						</Button>
					</TableCellLayout>
				);
			},
		}),
	];
	return (
		<div>
			<Card title="بيانات القبض">
				<Field label="نوع القبض">
					<Select value={type} onChange={(e) => setType(e.target.value)}>
						<option value="مستحقات">مستحقات</option>
						<option value="اخرى">اخرى</option>
					</Select>
				</Field>
			</Card>
			{docs && docs.length > 0 && (
				<Card title="المستحقات القابلة للقبض">
					<DataGrid
						items={docs}
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
									<DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
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
	);
};

export default AddReceivePage;
