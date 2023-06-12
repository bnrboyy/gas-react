import React, {  useEffect, useState } from "react";
import { bookingConfirm, bookingDelete } from "../../services/booking.service";
import ButtonUI from "../../components/ui/button/button";
import DateMoment from "../../components/ui/date-moment/date-moment";
import SwalUI from "../../components/ui/swal-ui/swal-ui";

import "./order-tab.scss";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import { faCheck, faSubscript } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";




import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const modalSwal = withReactContent(Swal);

const OrderTable = (props) => {
  const { filteredData } = props;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {}, [filteredData, selected]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredData.filter((n) => {
        if (n.status === "reserve") {
          return n.id;
        }
      });
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          setSelected={setSelected}
          numSelected={selected.length}
          selected={selected}
          setRefreshData={props.setRefreshData}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredData.length}
            />
            <TableBody>
              {stableSort(filteredData, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  let num = page * rowsPerPage + (index + 1);

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        {row.status === "reserve" && (
                          <Checkbox
                            onClick={(event) => handleClick(event, row.id)}
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {num}
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.phone}</TableCell>
                      <TableCell align="left">{row.request}</TableCell>
                      <TableCell align="left">{row.forgroup}</TableCell>
                      <TableCell align="center">{row.amount}</TableCell>
                      <TableCell align="left">
                        {row.bookingDate && (
                          <DateMoment format={"LLL"} date={row.bookingDate} />
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {row.created_at && (
                          <DateMoment format={"LLL"} date={row.created_at} />
                        )}
                      </TableCell>
                      <TableCell width={50} align="center">
                        {row.status === "reserve" ? (
                          <p className="reserve-status ">Pending</p>
                        ) : (
                          <p className="reserve-status confirm">Confirmed</p>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30, 100]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
export default OrderTable;

/* Settings Tables */

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "No",
    align: "left",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
    align: "left",
  },
  {
    id: "phone",
    numeric: true,
    disablePadding: false,
    label: "Phone Number",
    align: "left",
  },
  {
    id: "request",
    numeric: false,
    disablePadding: false,
    label: "Special Request",
    align: "left",
  },
  {
    id: "Grouprequest",
    numeric: false,
    disablePadding: false,
    label: "Group Request",
    align: "left",
  },
  {
    id: "amount",
    numeric: true,
    disablePadding: false,
    label: "Amount",
    align: "center",
  },
  {
    id: "bookingDate",
    numeric: false,
    disablePadding: false,
    label: "Booking Date",
    align: "left",
  },
  {
    id: "created_at",
    numeric: false,
    disablePadding: false,
    label: "Created Date",
    align: "left",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    align: "center",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={`${headCell.align}`}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, selected } = props;

  const confirmBookingHandler = () => {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Confirm",
        text: "Confirming a reservation?",
        showConfirmButton: true,
        confirmButtonText: "Confirm",
        showCancelButton: true,
      })
      .then((res) => {
        if (res.isConfirmed) {
          const idIn = selected.reduce((o, n) => o + n + ",", ",");
          bookingConfirm(idIn).then((res) => {
            if (res.status) {
              props.setRefreshData((prev) => prev + 1);
            }
            SwalUI({ status: res.status, description: res.description });
            props.setSelected([]);
          });
        }
      });
  };
  const removeBookingHandler = () => {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Delete",
        text: "You want to delete these data!",
        showConfirmButton: true,
        confirmButtonText: "Yes, delete it!",
        showCancelButton: true,
      })
      .then((res) => {
        if(res.isConfirmed){
          const idIn = selected.reduce((o, n) => o + n + ",", ",");
          bookingDelete(idIn).then((res) => {
            if (res.status) {
              props.setRefreshData((prev) => prev + 1);
            }
            props.setSelected([]);
            SwalUI({ status: res.status, description: res.description });
          });
        }
      });
 
  };
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Restaurant Reservations
        </Typography>
      )}
      {numSelected > 0 && (
        <div className="actions">
          <ButtonUI
            on="add"
            size="sm"
            className="btn-confirm"
            icon={<FontAwesomeIcon icon={faCheck} />}
            onClick={confirmBookingHandler}
          >
            Approve
          </ButtonUI>
          <ButtonUI
            on="delete"
            size="sm"
            className="btn-delete"
            onClick={removeBookingHandler}
          >
            Remove
          </ButtonUI>
        </div>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
