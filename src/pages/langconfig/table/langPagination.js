import React from 'react'

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faBackward, faForward } from '@fortawesome/free-solid-svg-icons';

import './pagi.scss';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };
  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <FontAwesomeIcon icon={faForward} /> : <FontAwesomeIcon icon={faBackward} /> }
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <FontAwesomeIcon icon={faAngleRight} /> : <FontAwesomeIcon icon={faAngleLeft} /> }
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <FontAwesomeIcon icon={faAngleLeft} /> : <FontAwesomeIcon icon={faAngleRight} />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FontAwesomeIcon icon={faBackward} />  : <FontAwesomeIcon icon={faForward} /> }
      </IconButton>
    </Box>
  );
}
 

function LangConfigPagination(props) {
  const {pageIndex, total, pageLength } = props;
  const pagiPageChangeHandler = (event, newPage) => {
    props.filterData({
      pageIndex: newPage,
      pageLimit: pageLength
    })
  }

  const pagiLimitChangeHandler = (event) => {
    props.filterData({
      pageIndex: 0,
      pageLimit: parseInt(event.target.value, 10)
    })
  }

  return (
    <TableRow>
        <TablePagination
        page={pageIndex}
        count={total}
        rowsPerPage={pageLength}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        SelectProps={{
            inputProps: {
            "aria-label": "rows per page",
            },
            native: true,
        }}
        onPageChange={pagiPageChangeHandler}
        onRowsPerPageChange={pagiLimitChangeHandler}
        ActionsComponent={TablePaginationActions}
        />
    </TableRow>
  )
}

export default LangConfigPagination;



