import { Component, OnInit } from '@angular/core';
import * as moment from  "moment";
import { Moment } from 'moment';

class Day {
  constructor(readonly date: number,
    private _selected: boolean,
    private _disabled: boolean) {}

  set disabled(val) {
    this._disabled = val;
  }

  get disabled() {
    return this._disabled;
  }

  set selected(val) {
    this._selected = val;
  }

  get selected() {
    return this._selected;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  weeks: Day[][] = [];
  selecting = false;
  displayedDate: Moment = moment(new Date());
  mmt = moment;
  startDate: Moment = null;
  endDate: Moment = null;
  date: Moment = null;
  minDate: Moment = moment().set('date', 13);
  maxDate: Moment = null;
  range = true;

  ngOnInit() {
    this.populate();
  }

  populate() {
    // populate displayed month
    if (this.weeks.length === 0) {
      let week = [];
      let weeks = [];
      let daysInMonth = this.displayedDate.daysInMonth();
      let startOfMonth = moment(this.displayedDate).set("date", 1);
      let offset = startOfMonth.day();
      // padding in first week of the month - until 1st of the month
      week = week.concat(
        Array.from({ length: offset }, () => null)
      );
      for (let i = 1; i <= daysInMonth; ++i) {
        const state = this.getDayState(i);
        week.push(new Day(i, state.selected, state.disabled));
        if ((i + offset) % 7 === 0 || i === daysInMonth) {
          if (week.length < 7) {
            // padding in last week of the month - from last day of the month
            week = week.concat(
              Array.from({ length: 7 - week.length }, () => null)
            );
          }
          weeks.push(week);
          week = [];
        }
      }
      this.weeks = [...weeks];
    } else {
      // set selected and disabled states if the weeks are already populated
      this.weeks.forEach((week) => {
        week.forEach((day) => {
          if (day) {
            const state = this.getDayState(day.date);
            day.selected = state.selected;
            day.disabled = state.disabled;
          }
        })
      })
    }
  }

  getDayState(date) {
    let day = moment(this.displayedDate).set("date", date);
    return {
      selected: this.isSelected(day),
      disabled: this.isDisabled(day),
    };
  }

  isSelected(date) {
    return (
      (this.startDate &&
        this.endDate &&
        date.isBetween(this.startDate, this.endDate, null, "[]")) ||
      (this.startDate && date.isSame(this.startDate, "day")) ||
      (this.date && date.isSame(this.date, "day"))
    );
  }

  isDisabled(date) {
    return (
      (this.minDate && date.isBefore(this.minDate, "day")) ||
      (this.maxDate && date.isAfter(this.maxDate, "day"))
    );
  }

  selectDate(day) {
    if (day && !day.disabled) {
      let date = moment(this.displayedDate).set("date", day.date);
      if (this.range) {
        if (this.selecting) {
          if (date.isBefore(this.startDate, "day")) {
              this.selecting = true;
              this.startDate = date;
              this.populate();
          } else {
            this.selecting = false;
            this.endDate = date;
            this.populate();
          }
        } else {
          this.selecting = true;
          this.startDate = date;
          this.endDate = null;
          this.date = null;
          this.populate();
        }
      } else {
        this.date = date;
        this.startDate = null;
        this.endDate = null;
        this.populate();
      }
    }
  }

  previousMonth = () => {
    this.displayedDate = moment(this.displayedDate).subtract(1, "months");
    this.weeks = [];
    this.populate();
  };

  nextMonth = () => {
    this.displayedDate = moment(this.displayedDate).add(1, "months");
    this.weeks = [];
    this.populate();
  };


}
