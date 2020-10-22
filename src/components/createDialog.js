import React from 'react';
import { observer } from 'mobx-react-lite';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { Container, Input } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  DateTimePicker,
} from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';
import { DateTime } from 'luxon';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const CreateDialogComponent = ({open, setOpen, addEvent}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [title, setTitle] = React.useState();
  const [selectedStartDate, setSelectedStartDate] = React.useState();
  const [selectedEndDate, setSelectedEndDate] = React.useState();
  const [allDay, setAllDay] = React.useState(false);

  React.useEffect(() => {
    if (open === true) {
      setTitle('');
      setAllDay(false);
      setSelectedStartDate(DateTime.local());
      setSelectedEndDate(DateTime.local().plus({ minutes: 30, }));
    }
  }, [open]);

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };

  function handleClose() {
    setOpen(false);
  };

  function handleSave() {
    const eventInfo = {
      start: selectedStartDate.toISO(),
      end: selectedEndDate.toISO(),
      title: title.trim() === '' ? '(제목없음)' : title,
      allDay,
    };
    addEvent(eventInfo);
    setOpen(false);
  };

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleAllDayChange = (event) => {
    setAllDay(event.target.checked);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-create-dialog"
    >
      <DialogTitle id="responsive-dialog-title">새 일정</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Container>
            <Grid container>
            <Input autoFocus placeholder="제목을 입력해주세요" value={title} onChangeCapture={handleTitle} />
            <FormControlLabel
              control={<Checkbox checked={allDay} onChange={handleAllDayChange} name="allDay" />}
              label="종일"
            />
            </Grid>
          </Container>
          <Container>
            <MuiPickersUtilsProvider utils={LuxonUtils}>
              <Grid container justify="space-around">
                <DateTimePicker
                  margin="normal"
                  id="create-datetime-picker"
                  label="시작 날짜 시간"
                  format="yyyy-MM-dd HH:mm:ss"
                  value={selectedStartDate}
                  onChange={handleStartDateChange}
                />
                <DateTimePicker
                  margin="normal"
                  id="end-datetime-picker"
                  label="끝 날짜 시간"
                  format="yyyy-MM-dd HH:mm:ss"
                  value={selectedEndDate}
                  onChange={handleEndDateChange}
                />
                </Grid>
              </MuiPickersUtilsProvider>
          </Container>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          취소
        </Button>
        <Button onClick={handleSave} color="primary">
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const CreateDialog = observer(CreateDialogComponent);