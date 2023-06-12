import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./post-option.scss";

export default function PostOption({onChangeFunction, valuePricetag}) {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false)
  const [tagForm, setTagForm] = useState(valuePricetag);
  const [keyValue, setKeyValue] = useState({
    key : "",
    value: ""
  })
  const [indexCurrent, setIndexCurrent] = useState(0)

  useEffect(() => {
    onChangeFunction(JSON.stringify(tagForm))
  }, [tagForm])
  
  
  const handleDelete = (e, indexs) => {
    const result = tagForm.filter((el, index) => index !== indexs)
    setTagForm(result)
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleAdd = (e) => {
    setTagForm([...tagForm, keyValue])
    handleClose()
  };

  const handleEdit = (e) => {
    setTagForm(tagForm.map((el, i) => {
      if(i === indexCurrent){
        return keyValue
      } else {
        return el
      }
    }))
    handleCloseEdit()
  };

  const handleClick = (e, index) => {
    setIndexCurrent(index)
    setKeyValue(tagForm[index])
    handleClickOpenEdit()
  }

  return (
    <React.Fragment>
      <div className="tags">
        <Stack direction="row" spacing={1}>
          {tagForm?.map((data, index) => (
            <Chip key={index} label={data.key} onClick={(e) => handleClick(e, index)} onDelete={(e) => handleDelete(e, index)} />
          ))}
          <Chip
            className="add"
            label="Add Tag"
            onDelete={(e) => handleClickOpen(e)}
            deleteIcon={<FontAwesomeIcon icon={faCirclePlus} />}
          />
        </Stack>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Tag</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="keytag"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={e => setKeyValue({...keyValue, key: e.target.value })}
          />
          <TextField
            margin="dense"
            id="valuetag"
            label="Value"
            type="text"
            fullWidth
            variant="standard"
            onChange={e => setKeyValue({...keyValue, value: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Edit Tag</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="keytag"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={keyValue.key}
            onChange={e => setKeyValue({...keyValue, key: e.target.value })}
          />
          <TextField
            margin="dense"
            id="valuetag"
            label="Value"
            type="text"
            fullWidth
            variant="standard"
            value={keyValue.value}
            onChange={e => setKeyValue({...keyValue, value: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleEdit}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
