﻿import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { Container, Input, MenuItem, Select } from '@material-ui/core';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';
import { DateTime } from 'luxon';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ColorPalette } from 'material-ui-color';

const palette = {
  IndianRed: '#CD5C5C',
  Crimson: '#DC143C',
  Tomato: '#FF6347',
  Gold: '#FFD700',
  Magenta: '#FF00FF',
  RebeccaPurple: '#663399',
  Indigo: '#4B0082',
  Lime: '#00FF00',
  ForestGreen: '#228B22',
  SaddleBrown: '#8B4513',
};

const CreateDialogComponent = ({ setOpen, addEvent, defaultSettings, categoryList }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [title, setTitle] = React.useState();
  const [selectedStartDate, setSelectedStartDate] = React.useState();
  const [selectedEndDate, setSelectedEndDate] = React.useState();
  const [allDay, setAllDay] = React.useState(false);
  const [importance, setImportance] = React.useState();
  const [category, setCategory] = React.useState('default');
  const [place, setPlace] = React.useState();
  const [color, setColor] = React.useState('black');

  React.useEffect(() => {
    setTitle('');
    setPlace('');
    if (defaultSettings && defaultSettings.start) {
      setSelectedStartDate(DateTime.fromISO(defaultSettings.start));
    } else {
      setSelectedStartDate(DateTime.local());
    }
    if (defaultSettings && defaultSettings.end) {
      setSelectedEndDate(DateTime.fromISO(defaultSettings.end));
    } else {
      setSelectedEndDate(DateTime.local().plus({ minutes: 30 }));
    }
    if (defaultSettings && defaultSettings.allDay) {
      setAllDay(true);
    } else {
      setAllDay(false);
    }
    if (defaultSettings && defaultSettings.importance) {
      setImportance(true);
    } else {
      setImportance(false);
    }
    if (defaultSettings && defaultSettings.category) {
      setCategory(defaultSettings.category);
    }
  }, [defaultSettings]);

  const handleStartDateChange = date => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = date => {
    setSelectedEndDate(date);
  };

  function handleClose() {
    setOpen(false);
  }

  function handleSave() {
    const isAllDay = (selectedEndDate - selectedStartDate) / (60 * 60 * 1000) >= 24;
    const eventInfo = {
      start: selectedStartDate.toISO(),
      end: selectedEndDate.toISO(),
      importance,
      title: title.trim() === '' ? '(제목없음)' : title,
      allDay: allDay || isAllDay,
      place,
      forceAllDay: allDay,
      color,
      category,
      display: 'block',
    };
    addEvent(eventInfo);
    setOpen(false);
  }

  const handleTitle = event => {
    setTitle(event.target.value);
  };

  const handleAllDayChange = event => {
    setAllDay(event.target.checked);
  };

  const handleimportanceChange = event => {
    setImportance(event.target.checked);
  };
  const handlePlaceChange = event => {
    setPlace(event.target.value);
  };

  const handleChange = event => {
    setCategory(event.target.value);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open
      onClose={handleClose}
      aria-labelledby="responsive-create-dialog"
    >
      <DialogTitle id="responsive-dialog-title">새 일정</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {categoryList && (
            <Container>
              <Select value={category} onChange={handleChange}>
                {categoryList.map(item => (
                  <MenuItem value={item}>{item === 'default' ? '기본 캘린더' : item}</MenuItem>
                ))}
              </Select>
            </Container>
          )}
          <Container>
            <Grid container>
              <Input
                autoFocus
                placeholder="제목을 입력해주세요"
                value={title}
                onChangeCapture={handleTitle}
              />
              <FormControlLabel
                control={<Checkbox checked={allDay} onChange={handleAllDayChange} name="allDay" />}
                label="종일"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={importance}
                    onChange={handleimportanceChange}
                    name="importance"
                  />
                }
                label="중요"
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
          <Container>
            <Input placeholder="장소를 입력해주세요" value={place} onChange={handlePlaceChange} />
          </Container>
          <Container>
            <ColorPalette palette={palette} value={color} onSelect={setColor} />
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

export const CreateDialog = CreateDialogComponent;
