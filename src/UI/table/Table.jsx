import React from "react";
// import classes from "./table.module.scss";
// import TableRow from "./TableRow";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { DataGrid, arSD } from "@mui/x-data-grid";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
const cacheRtl = createCache({
	key: "data-grid-rtl-demo",
	stylisPlugins: [prefixer, rtlPlugin],
});
const Table = ({
	rows,
	columns,
	hideFooter,
	checkboxSelection,
	onRowSelectionModelChange,
	pageSize,
}) => {
	const existingTheme = useTheme();
	const theme = React.useMemo(
		() =>
			createTheme({}, arSD, existingTheme, {
				// direction: "rtl",
			}),
		[existingTheme]
	);
	return (
		<div
			dir="rtl"
			// style={{ width: "100%" }}
		>
			<CacheProvider value={cacheRtl}>
				<ThemeProvider theme={theme}>
					<DataGrid
						rows={rows}
						autoHeight
						columns={columns}
						initialState={{
							pagination: {
								paginationModel: { page: 0, pageSize: pageSize ? pageSize : 5 },
							},
						}}
						hideFooter={hideFooter ? hideFooter : false}
						checkboxSelection={checkboxSelection ? checkboxSelection : false}
						onRowSelectionModelChange={(ids) => {
							const selectedIDs = new Set(ids);
							const selectedRowData = rows.filter((row) =>
								selectedIDs.has(row.id)
							);

							onRowSelectionModelChange(selectedRowData);
						}}
						sx={{
							fontSize: "18px",
							outline: "none !important",
							maxWidth: "100%",
							"&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
								outline: "none !important",
							},
							".highlight": {
								bgcolor: "rgba(255, 0, 0,.1)",
								"&:hover": {
									bgcolor: "rgba(255, 0, 0,.1)",
								},
							},
							"& .MuiDataGrid-columnHeaderTitle": {
								whiteSpace: "normal",
								lineHeight: "normal",
							},
							"& .MuiDataGrid-columnHeader": {
								// Forced to use important since overriding inline styles
								height: "unset !important",
							},
							"& .MuiDataGrid-columnHeaders": {
								// Forced to use important since overriding inline styles
								maxHeight: "168px !important",
							},
						}}
						pageSizeOptions={pageSize ? [pageSize] : [5]}
						// checkboxSelection
						disableRowSelectionOnClick
						getRowClassName={(params) => {
							return params.row.isDeleted === 1 ? "highlight" : "";
						}}
					/>
				</ThemeProvider>
			</CacheProvider>
		</div>
	);
};

export default Table;
