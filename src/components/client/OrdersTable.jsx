// import * as React from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import { TableVirtuoso } from "react-virtuoso";

// export const OrdersTable = () => {
//   return (
//     <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
//       <TableVirtuoso
//         data={rows}
//         components={VirtuosoTableComponents}
//         fixedHeaderContent={fixedHeaderContent}
//         itemContent={rowContent}
//       />
//     </div>
//   );
// };

import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Collapse, IconButton } from "@mui/material";
import { HumanDate } from "../shared/HumanDate";
import { getMostRecentTimestamp } from "../../utils/misc";
import { Copyable } from "../shared/Copyable";
import { getHumanDate } from "../../utils/constants";
import { StatusDisplay } from "../shared/StatusDisplay";
import { ProductsDisplay } from "../shared/ProductsDisplay";
import { TrackedItems } from "../shared/TrackedItems";
import { OrderPaymentStatus } from "../shared/OrderPaymentStatus";
import { MessagesButton, SmallMessagesButton } from "../shared/MessagesButton";
import { CardDatePicker } from "../shared/CardDatePicker";
import { CostDisplay } from "../shared/CostDisplay";
import { ActionsMenu } from "../shared/ActionsMenu";
import { TargetDisplay } from "../shared/TargetDisplay";
import { useQuickEditor } from "../shared/ToolsProvider";
import { usePrintOrders } from "../shared/PrintOrders";
import { MessageStatusMenu } from "../shared/MessageStatusMenu";
import { CardSectionx } from "../shared/CardSection";
import HiddenPhone from "../shared/HiddenPhone";
// cost,
// target,
// products,
// status,
// desired_date,
// timestamps,
// timeline,
// messages,
// locked_items,
// payments_made,
// replacing_order,
// tracked_items,
// replacement_order,

export function OrdersTable({ documents }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="left">ID</TableCell>
              <TableCell align="center">City</TableCell>
              <TableCell align="center">Phone</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Date</TableCell>

              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((data) => (
              <Row key={data._id} {...data} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={documents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

function Row({
  _id,
  cost,
  target,
  products,
  status,
  desired_date,
  timestamps,
  messages,
  locked_items,
  payments_made,
  replacing_order,
  tracked_items,
  replacement_order,
}) {
  const [open, setOpen] = React.useState(false);
  const [isSaving, editDocument, deleteDocument] = useQuickEditor(_id, "orders");

  const printOrders = usePrintOrders();

  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        style={{ backgroundColor: open ? "#f3f3f3" : undefined }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
          </IconButton>
        </TableCell>
        <TableCell align="center">
          <div className="text-sm text-gray-700 hover:text-gray-600 flex items-center cursor-pointer w-max">
            <Copyable text={_id} />
          </div>
        </TableCell>
        <TableCell align="center">
          <div className="rounded-full h-10 flex items-center justify-center col-span-2 gap-2">
            <i className="fas fa-city"></i>
            <span className="line-clamp-2 capitalize">{target.city}</span>
          </div>
        </TableCell>
        <TableCell align="center">
          <div className="rounded-full h-10 flex items-center justify-center col-span-2 gap-2">
            <i className="fas fa-phone-alt"></i>
            <HiddenPhone phone={target.phone} className="line-clamp-2 capitalize" metadata={{ model: "orders", _id }} />
          </div>
        </TableCell>
        <TableCell align="center">
          <StatusDisplay model="orders" status={status} />
        </TableCell>
        <TableCell align="center">
          {getHumanDate(getMostRecentTimestamp(timestamps), true)}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-[5px]">
            <SmallMessagesButton _id={_id} model="orders" />
            <MessageStatusMenu _id={_id} model="orders" status={status} role="client" />
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className="grid grid-cols-4 gap-2 p-4 relative overflow-hidden">
              <CardSectionx label="client" className="border-none !bg-white/30" colSpan={1}>
                <div className="col-span-4">{target.name}</div>
              </CardSectionx>
              <CardSectionx label="Address" className="border-none !bg-white/30" colSpan={1}>
                <div className="col-span-4">{target.address}</div>
              </CardSectionx>
              <CardSectionx label="Cost" className="border-none !bg-white/30" colSpan={1}>
                <div className="col-span-4">{cost} DH</div>
              </CardSectionx>

              <CardSectionx
                label="Produits"
                className="border-none !bg-white/30"
                colSpan={products.length}>
                <div className="col-span-4">
                  <ProductsDisplay products={products} tracked_items={tracked_items} />
                </div>
              </CardSectionx>

              <CardSectionx label="Postponed to" className="border-none !bg-white/30" colSpan={1}>
                <div className="col-span-4">-</div>
              </CardSectionx>
              <CardSectionx label="Latest Message" className="border-none !bg-white/30" colSpan={1}>
                <div className="col-span-4">-</div>
              </CardSectionx>

              {["cancelled", "refused", "draft"].includes(status) &&
                tracked_items &&
                tracked_items.length > 0 && <TrackedItems tracked_items={tracked_items} />}

              {replacing_order && (
                <div className="col-span-4 rounded-full h-10 flex items-center col-span-4 bg-white border-2 border-dashed border-blue-200 text-xl text-gray-400 cursor-default">
                  <p className="text-center text-sm flex-1">
                    Commande pour remplacer <span className="underline">{replacing_order._id}</span>
                  </p>
                </div>
              )}

              {replacement_order && (
                <div className="col-span-4 rounded-full h-10 flex items-center col-span-4 bg-white border-2 border-dashed border-yellow-200 text-xl text-gray-400 cursor-default">
                  <p className="text-center text-sm flex-1">
                    Commande a été remplacée par{" "}
                    <span className="underline">{replacement_order._id}</span>
                  </p>
                </div>
              )}

              {status === "fulfilled" && typeof payments_made === "boolean" && (
                <OrderPaymentStatus payments_made={payments_made} />
              )}

              {/* <CardDatePicker
                date={desired_date}
                editDocument={editDocument}
                _id={_id}
                model="orders"
                disabled={isSaving || timestamps.cancelled || timestamps.fulfilled}
              /> */}

              {/* <ActionsMenu
                _id={_id}
                editDocument={editDocument}
                deleteDocument={deleteDocument}
                model="orders"
                status={status}
                pending={status === "draft"}
                edit={status === "draft"}
                draft={status === "awaiting pickup" || status === "pending" || status === "problem"}
                remove={
                  status === "draft" ||
                  status === "awaiting pickup" ||
                  status === "awaiting transfer" ||
                  status === "pending" ||
                  status === "problem" ||
                  status === "cancelled"
                }
                print={status === "awaiting pickup" && locked_items ? printOrders : undefined}
                replace={status === "fulfilled" && !replacement_order}
              /> */}
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
